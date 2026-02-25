import type { ReactNode } from "react";
import { Button, Text } from "@mantine/core";
import { randomId } from "@mantine/hooks";
import AppFileViewer, {
  type FileViewerUrlType,
} from "@/components/Shared/AppFileView";
import AppHtmlViewer from "@/components/Shared/AppHtmlViewer";
import type { ModalSettings } from "@/components/Shared/AppModal";
import { modalManager } from "./modal-manager";

const success = (props: { title?: string; message: string }): void => {
  const { title, message } = props;
  const modalId = modalManager.open({
    prefixComponent: (
      <div className="bg-primary-filled/10 flex h-10 w-10 items-center justify-center rounded-full p-0.5">
        <span className="icon-[fluent--checkmark-circle-32-regular] text-primary-filled h-6 w-6"></span>
      </div>
    ),
    header: title ?? "Berhasil",
    body: message,
    footer: (
      <>
        <Button onClick={() => modalManager.close(modalId)}>Tutup</Button>
      </>
    ),
  });
};

const info = (props: { title?: string; message: string }): void => {
  const { title, message } = props;
  const modalId = modalManager.open({
    header: title ?? "Informasi",
    body: message,
    footer: (
      <>
        <Button onClick={() => modalManager.close(modalId)}>Tutup</Button>
      </>
    ),
  });
};

const error = (message: string) => {
  const modalId = modalManager.open({
    showCloseButton: true,
    prefixComponent: (
      <div className="bg-red-6/10 flex h-10 w-10 items-center justify-center rounded-full p-0.5">
        <span className="text-destructive icon-[fluent--warning-28-regular] text-red-6 h-6 w-6"></span>
      </div>
    ),
    header: "Terjadi Kesalahan",
    body: message,
    footer: (
      <>
        <Button variant="filled" onClick={() => modalManager.close(modalId)}>
          Tutup
        </Button>
      </>
    ),
  });
};

const confirm = (
  message: string,
  options?: {
    yesLabel?: string;
    noLabel?: string;
    yesIcon?: ReactNode;
    noIcon?: ReactNode;
  },
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const modalId = modalManager.open({
      showCloseButton: true,
      closeOnClickOutside: false,
      header: "Konfirmasi",
      body: message,
      footer: (
        <>
          <Button
            leftSection={options?.noIcon}
            variant="outline"
            color="gray"
            onClick={() => {
              modalManager.close(modalId);
              resolve(false);
            }}
          >
            {options?.noLabel ?? "Batal"}
          </Button>
          <Button
            variant={"filled"}
            leftSection={options?.yesIcon}
            onClick={() => {
              modalManager.close(modalId);
              resolve(true);
            }}
          >
            {options?.yesLabel ?? "Ya"}
          </Button>
        </>
      ),
    });
  });
};

interface LoadingDialog {
  close: () => void;
}

const loading = (): LoadingDialog => {
  const modalId = modalManager.open({
    closeOnClickOutside: false,
    children: (
      <div className="flex w-full flex-col items-center gap-5 py-6">
        <div className="h-20 w-20">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-b-8 border-t-8 border-gray-200"></div>
            <div className="border-primary-filled absolute left-0 top-0 h-20 w-20 animate-spin rounded-full border-b-8 border-t-8"></div>
          </div>
        </div>
        <Text>{"Mohon tunggu sebentar..."}</Text>
      </div>
    ),
  });

  const close = () => modalManager.close(modalId);

  return {
    close,
  };
};

const customDialog = (
  params: { builder: (modalId: string) => React.ReactNode } & ModalSettings,
) => {
  const modalId = randomId();
  return modalManager.open({
    id: modalId,
    showCloseButton: false,
    children: params.builder(modalId),
    ...params,
  });
};

const fileViewer = (
  urls: FileViewerUrlType[],
  initialUrl?: FileViewerUrlType,
  useAuthorization?: boolean,
) => {
  const modalId = randomId();
  return modalManager.open({
    id: modalId,
    showCloseButton: false,
    size: "lg",
    fullScreenOnMobile: true,
    children: (
      <AppFileViewer
        modalId={modalId}
        urls={urls}
        initialUrl={initialUrl}
        useAuthorization={useAuthorization}
      />
    ),
  });
};

const htmlViewer = (title: string, html: string) => {
  const modalId = randomId();
  return modalManager.open({
    id: modalId,
    showCloseButton: false,
    size: "lg",
    fullScreenOnMobile: true,
    children: <AppHtmlViewer modalId={modalId} title={title} html={html} />,
  });
};

export const modalUtils = {
  success,
  info,
  error,
  confirm,
  loading,
  customDialog,
  fileViewer,
  htmlViewer,
};
