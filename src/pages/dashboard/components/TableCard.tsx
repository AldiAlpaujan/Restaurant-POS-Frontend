import { Text, UnstyledButton } from '@mantine/core';
import { TABLE_STATUS_CONFIG } from '@/lib/variable';
import type { Table } from '@/types/table';

export default function TableCard({ table, onClick }: { table: Table; onClick: () => void }) {
  const cfg = TABLE_STATUS_CONFIG[table.status];
  const isClickable = table.status === 'available' || table.status === 'occupied';

  return (
    <UnstyledButton
      onClick={isClickable ? onClick : undefined}
      className="flex aspect-square flex-col items-center justify-center rounded-lg transition-all"
      style={{
        backgroundColor: cfg.bg,
        border: `2px solid ${cfg.border}`,
        cursor: isClickable ? 'pointer' : 'default',
      }}
    >
      <Text fw={700} size="md" style={{ color: cfg.text }}>
        {table.number}
      </Text>
    </UnstyledButton>
  );
}
