import type { ModalSettings } from '@/components/Shared/AppModal';

export class ModalManager {
  private openModalFn: ((settings: ModalSettings) => string) | null = null;
  private closeModalFn: ((id: string) => void) | null = null;
  private closeAllModalFn: (() => void) | null = null;

  setAddModalFn(fn: ((settings: ModalSettings) => string) | null) {
    this.openModalFn = fn;
  }

  setCloseModalFn(fn: ((id: string) => void) | null) {
    this.closeModalFn = fn;
  }

  setCloseAllModalFn(fn: (() => void) | null) {
    this.closeAllModalFn = fn;
  }

  open(settings: ModalSettings): string {
    return this.openModalFn?.(settings) ?? '';
  }

  close(id: string) {
    this.closeModalFn?.(id);
  }

  closeAll() {
    this.closeAllModalFn?.();
  }
}

export const modalManager = new ModalManager();
