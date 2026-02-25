import { useEffect, useState } from 'react';
import DocViewer, {
  DocViewerRenderers,
  type IDocument,
  type IHeaderOverride,
} from '@cyntler/react-doc-viewer';
import { ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconTriangle, IconX } from '@tabler/icons-react';
import client from '@/lib/http-client';
import { modalManager } from '@/lib/modal-manager';

export type FileViewerUrlType = {
  fileName: string;
  url?: string;
  file?: File;
};

interface AppFileViewerProps {
  modalId: string;
  urls: FileViewerUrlType[];
  initialUrl?: FileViewerUrlType;
  useAuthorization?: boolean;
}

const AppFileViewer = ({
  modalId,
  urls,
  initialUrl,
  useAuthorization = false,
}: AppFileViewerProps) => {
  const [docs, setDocs] = useState<IDocument[]>([]);

  const fetch = async () => {
    const tmp = [];

    for (const item of urls) {
      // Handle local File object
      if (item.file) {
        tmp.push({
          uri: URL.createObjectURL(item.file),
          fileName: item.fileName,
        });
      }
      // Handle URL with authorization
      else if (useAuthorization && item.url) {
        const response = await client().get(item.url, {
          responseType: 'blob',
        });
        tmp.push({
          uri: URL.createObjectURL(response.data),
          fileName: item.fileName,
        });
      }
      // Handle regular URL
      else if (item.url) {
        tmp.push({
          uri: item.url,
          fileName: item.fileName,
        });
      }
    }

    setDocs(tmp);
  };

  useEffect(() => {
    fetch();

    return () => {
      docs.forEach((doc) => {
        if (doc.uri.startsWith('blob:')) {
          URL.revokeObjectURL(doc.uri);
        }
      });
    };
  }, []);

  return (
    <div className="h-screen sm:h-[90vh]">
      <DocViewer
        documents={docs}
        initialActiveDocument={
          initialUrl && docs.find((doc) => doc.fileName === initialUrl.fileName)
        }
        pluginRenderers={DocViewerRenderers}
        config={{
          header: { overrideComponent: createHeader(modalId) },
          loadingRenderer: {
            overrideComponent: () => (
              <div className="flex h-full w-full items-center justify-center py-5">
                <div className="flex flex-col items-center">
                  <div className="mb-8 h-32 w-32">
                    <div className="relative">
                      <div className="border-b-12 border-t-12 h-32 w-32 rounded-full border-gray-200"></div>
                      <div className="border-primary border-b-12 border-t-12 absolute left-0 top-0 h-32 w-32 animate-spin rounded-full"></div>
                    </div>
                  </div>
                  <h4 className="mb-2">Harap Tunggu</h4>
                  <p className="text-gray-500">Memuat gambar, mohon tunggu sebentar</p>
                </div>
              </div>
            ),
          },
          noRenderer: {
            overrideComponent: () => (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <IconTriangle className="text-destructive mb-5 h-20 w-20" />
                <h4 className="mb-1">Gagal memuat gambar!</h4>
                <p className="mb-4 text-gray-500">Gambar tidak dapat dimuat.</p>
              </div>
            ),
          },
        }}
      />
    </div>
  );
};

const createHeader = (modalId: string): IHeaderOverride => {
  const header: IHeaderOverride = (state, previousDocument, nextDocument) => {
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null;
    }

    console.info(state.documents.map((elm) => elm.uri).indexOf(state.currentDocument.uri));

    const fileIndex = state.documents.map((elm) => elm.uri).indexOf(state.currentDocument.uri);
    const isFirst = fileIndex === 0;
    const isLast = fileIndex === state.documents.length - 1;

    return (
      <div className="border-gray-4 flex h-20 items-center justify-between rounded-t-md border-b px-4">
        <span className="text-lg font-bold">{state.currentDocument.fileName}</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Document {fileIndex + 1} of {state.documents.length}
          </span>
          <div className="flex items-center gap-2">
            <ActionIcon
              size="lg"
              disabled={isFirst}
              onClick={previousDocument}
              className="rounded-full"
            >
              <IconArrowLeft className="h-5 w-5" />
            </ActionIcon>

            <ActionIcon size="lg" disabled={isLast} onClick={nextDocument} className="rounded-full">
              <IconArrowRight className="h-5 w-5" />
            </ActionIcon>

            <ActionIcon
              variant="light"
              size="lg"
              color="red"
              onClick={() => modalManager.close(modalId)}
              className="rounded-full"
            >
              <IconX className="h-5 w-5" />
            </ActionIcon>
          </div>
        </div>
      </div>
    );
  };

  return header;
};

export default AppFileViewer;
