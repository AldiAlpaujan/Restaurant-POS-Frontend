import { Button, Stack, Text } from '@mantine/core';
import { modalManager } from '@/lib/modal-manager';
import type { Table } from '@/types/table';

interface TableActionModalProps {
  modalId: string;
  table: Table;
  onCreateOrder: () => void;
  onSetInactive: () => void;
}

export default function TableActionModal({
  modalId,
  table,
  onCreateOrder,
  onSetInactive,
}: TableActionModalProps) {
  return (
    <div className="p-5">
      <Text fw={600} size="lg" className="mb-1">
        Meja {table.number}
      </Text>
      <Text size="sm" c="dimmed" className="mb-4">
        Pilih tindakan untuk meja ini
      </Text>
      <Stack gap="sm">
        <Button
          fullWidth
          onClick={() => {
            modalManager.close(modalId);
            onCreateOrder();
          }}
        >
          Buat Pesanan Baru
        </Button>
        <Button
          fullWidth
          variant="outline"
          color="red"
          onClick={() => {
            modalManager.close(modalId);
            onSetInactive();
          }}
        >
          Nonaktifkan Meja
        </Button>
        <Button
          fullWidth
          variant="subtle"
          color="gray"
          onClick={() => modalManager.close(modalId)}
        >
          Batal
        </Button>
      </Stack>
    </div>
  );
}