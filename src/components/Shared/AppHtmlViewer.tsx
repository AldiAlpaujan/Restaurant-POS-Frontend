import sanitizeHtml from 'sanitize-html';
import { modalManager } from '@/lib/modal-manager';
import AppFormModal from './AppFormModal';

interface AppHtmlViewerProps {
  modalId: string;
  title: string;
  html: string;
}

export default function AppHtmlViewer({ modalId, title, html }: AppHtmlViewerProps) {
  return (
    <AppFormModal
      hiddenCancelButton
      modalId={modalId}
      title={title}
      submitLabel="Tutup"
      onSubmit={() => modalManager.close(modalId)}
    >
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
    </AppFormModal>
  );
}
