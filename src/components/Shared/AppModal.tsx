import type { ReactNode } from 'react';
import { Modal, Text, Title, type ModalProps } from '@mantine/core';
import useIsMobile from '@/hooks/useIsMobile';

export type ModalSettings = Partial<Omit<ModalProps, 'opened'>> & {
  id?: string;
  prefixComponent?: ReactNode;
  header?: string;
  body?: string;
  footer?: ReactNode;
  showCloseButton?: boolean;
  fullScreenOnMobile?: boolean;
};

type AppModalProps = {
  open: boolean;
  onClose: () => void;
  settings: ModalSettings;
};

export default function AppModal(props: AppModalProps) {
  const isMobile = useIsMobile();
  const {
    id,
    size,
    showCloseButton = true,
    prefixComponent,
    header,
    body,
    footer,
    children,
    fullScreenOnMobile,
    fullScreen,
    onClose,
  } = props.settings;

  return (
    <Modal.Root
      {...props.settings}
      key={id}
      centered
      size={size}
      fullScreen={fullScreenOnMobile ? isMobile : fullScreen}
      opened={props.open}
      onClose={() => {
        onClose?.();
        props.onClose();
      }}
    >
      <Modal.Overlay backgroundOpacity={0.55} blur={3} />
      {children ? (
        <Modal.Content>{children}</Modal.Content>
      ) : (
        <Modal.Content>
          <div className="flex gap-3 p-4">
            {prefixComponent && <div className="mt-1 bg-transparent">{prefixComponent}</div>}
            <div className="w-full">
              <div className="mb-4">
                <div className="mb-1 flex">
                  <Title order={4} className="flex-1 font-semibold">
                    {header}
                  </Title>
                  {showCloseButton && <Modal.CloseButton size={'24'} />}
                </div>
                <Text component="p" c="dimmed" className="text-base">
                  {body}
                </Text>
              </div>
              <div className="flex justify-end gap-3">{footer}</div>
            </div>
          </div>
        </Modal.Content>
      )}
    </Modal.Root>
  );
}
