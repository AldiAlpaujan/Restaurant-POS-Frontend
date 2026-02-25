import axios, { AxiosError } from 'axios';
import authToken from './auth-token';
import { modalUtils } from './modal-utlis';
import { toastUtils } from './toast-utils';

export const parseError = (error: unknown, suppressError?: ((message: string) => void) | null) => {
  console.log('[APPLICATION] Request Error ====>');

  let message =
    'Terjadi kesalahan saat menghubungi server, periksa koneksi Anda atau hubungi Administrator untuk informasi lebih lanjut.';

  let needMessage = true;
  let suppressErrorAllowed = true;

  if (error instanceof Error) {
    console.log('Error Message', error.message);
    console.log(`Error Object : ${error}`);
  }

  if (axios.isCancel(error)) {
    return;
  }

  if (error instanceof AxiosError) {
    console.log(`Error Config : ${error.config}`);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('Response ERROR START : ');
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log('Response ERROR END');

      let errorData = error.response.data;
      if (errorData instanceof ArrayBuffer) {
        const decodedString = String.fromCharCode.apply(
          null,
          Array.from(new Uint8Array(errorData))
        );
        try {
          errorData = JSON.parse(decodedString);
        } catch (err) {
          console.info(err);
          errorData = {};
        }
      }
      switch (error.response.status) {
        case 400:
          if (errorData?.errorDetail === 'bad_model_request') {
            message = 'The submitted data model is invalid';
          } else if (errorData.errorDetail === 'bad_request_message') {
            message = errorData.errorData;
          }
          break;

        case 401:
          authToken.clearToken();
          window.location.href = '/';
          toastUtils.info({ message: 'Ops, sesi Anda telah berakhir. Silakan login kembali.' });
          // Untuk silent error, karena sudah menampilkan warning
          suppressErrorAllowed = false;
          needMessage = false;
          break;

        case 403:
          message = 'You do not have permission';
          break;

        case 404:
          if (errorData.errorDetail === 'resource_not_found') {
            message = 'Resource not found';
          } else {
            // route_not_found or other
            message = 'API path not found';
          }
          break;
        case 419: // CSRF
          window.location.reload();
          break;
        case 500:
          message = 'Terjadi kesalahan internal pada server';
          break;
        default:
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(`Request ERROR : ${error.request}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('General Error', error.message);
    }
  }
  if (needMessage) {
    if (suppressError && suppressErrorAllowed) {
      suppressError(message);
    } else {
      modalUtils.error(message);
    }
  }

  console.log('<==== Request Error [APPLICATION]');
};
