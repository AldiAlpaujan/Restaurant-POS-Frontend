import { createContext, useEffect, useState, type ReactNode } from 'react';
import { randomId } from '@mantine/hooks';
import type { ModalSettings } from '@/components/Shared/AppModal';
import AppModal from '@/components/Shared/AppModal';
import { nextTick } from '@/lib/function';
import { modalManager } from '@/lib/modal-manager';

type ModalProviderValue = {
  openModal: (settings: ModalSettings) => string;
  closeModal: (id: string) => void;
  closeAllModal: () => void;
};

const ModalContext = createContext<ModalProviderValue | null>(null);
const ModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalSettings[]>([]);
  const [activeModals, setActiveModals] = useState<string[]>([]);

  const openModal = (settings: ModalSettings) => {
    const id = settings.id ?? randomId();
    setModals((current) => [...current, { ...settings, id }]);

    nextTick(() => {
      setActiveModals((current) => [...current, id]);
    });

    return id;
  };

  const closeModal = (id: string) => {
    setActiveModals((current) => current.filter((v) => v !== id));

    nextTick(() => {
      setModals((current) => current.filter((v) => v.id !== id));
    });
  };

  const closeAllModal = () => {
    setActiveModals([]);

    nextTick(() => {
      setModals([]);
    });
  };

  useEffect(() => {
    if (modals.length < 1) {
      window.document.body.style.pointerEvents = 'unset';
    }
  }, [modals]);

  useEffect(() => {
    modalManager.setAddModalFn(openModal);
    modalManager.setCloseModalFn(closeModal);
    modalManager.setCloseAllModalFn(closeAllModal);

    return () => {
      modalManager.setAddModalFn(null);
      modalManager.setCloseModalFn(null);
      modalManager.setCloseAllModalFn(null);
    };
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        closeAllModal,
      }}
    >
      {children}
      {modals.map((modal) => {
        return (
          <AppModal
            key={modal.id}
            open={activeModals.includes(modal.id!)}
            settings={modal}
            onClose={() => closeModal(modal.id!)}
          />
        );
      })}
    </ModalContext.Provider>
  );
};

export { ModalContext };
export default ModalContextProvider;
