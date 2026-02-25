import type { ReactNode } from 'react';
import { Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface AppViewStateProps {
  viewState?: AppViewStateType;
  errorMsg?: string;
  children: ReactNode;
  callBackError?: () => void;
}

export type AppViewStateType = 'content' | 'loading' | 'error';

export default function AppViewState(props: AppViewStateProps) {
  const { viewState = 'content', children, errorMsg, callBackError } = props;

  let content = children;

  if (viewState === 'loading') {
    content = (
      <div className="flex h-full w-full items-center justify-center py-5">
        <div className="flex flex-col items-center">
          <div className="mb-8 h-24 w-24">
            <div className="relative">
              <div className="border-t-12 border-b-12 h-24 w-24 rounded-full border-gray-200"></div>
              <div className="border-t-12 border-b-12 border-primary-filled absolute left-0 top-0 h-24 w-24 animate-spin rounded-full"></div>
            </div>
          </div>
          <h4 className="mb-2">Harap Tunggu</h4>
          <p className="text-gray-500">Memuat informasi, mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (viewState === 'error') {
    content = (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <IconAlertTriangle className="text-destructive mb-5 h-20 w-20" />
        <h4 className="mb-1">Gagal memuat data!</h4>
        <p className="mb-4 text-gray-500">
          {errorMsg ?? 'Data tidak dapat dimuat. Silakan coba lagi.'}
        </p>
        <Button onClick={callBackError}>Coba Lagi</Button>
      </div>
    );
  }

  return content;
}
