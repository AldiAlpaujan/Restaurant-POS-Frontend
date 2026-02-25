import type { FormEvent } from 'react';
import { Button, Modal } from '@mantine/core';
import { modalManager } from '@/lib/modal-manager';

interface AppFormModalProps {
  modalId: string;
  title: string;
  onCancel?: () => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  hiddenCancelButton?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
  bigDialog?: boolean;

  headerClassName?: string;
  className?: string;
  footerClassName?: string;
  cancelVariant?: 'filter-cancel' | 'outline';
  children: React.ReactNode;
}

export default function AppFormModal(props: AppFormModalProps) {
  const {
    modalId,
    title,
    onCancel,
    onSubmit,
    hiddenCancelButton = false,
    cancelLabel = 'Batal',
    submitLabel = 'Submit',

    headerClassName,
    className,
    footerClassName,
    cancelVariant = 'outline',
    children,
  } = props;

  return (
    <div className="h-full overflow-clip">
      <div
        className={`border-default-border flex flex-row justify-between rounded-t-md border-b-[0.1px] p-4 ${headerClassName}`}
      >
        <h2 className="p-0 text-lg">{title}</h2>
        <Modal.CloseButton size={'24'} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
        className="h-full"
      >
        <div
          className={`h-[calc(100%-130px)] w-full overflow-auto p-4 md:h-fit md:max-h-[70vh] ${className}`}
        >
          {children}
        </div>

        <div
          className={`border-default-border flex flex-row justify-end gap-4 rounded-b-md border-t bg-white p-4 ${footerClassName}`}
        >
          {!hiddenCancelButton && (
            <Button
              type="button"
              variant={cancelVariant}
              onClick={onCancel ?? (() => modalManager.close(modalId))}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </div>
  );
}
