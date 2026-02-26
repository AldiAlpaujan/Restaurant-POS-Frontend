import { ActionIcon, Badge } from '@mantine/core';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { getActionColumnWidth } from '@/lib/function';
import { columnWidth, ORDER_STATUS_CONFIG } from '@/lib/variable';
import type { GridAction } from '@/types/grid-action';
import type { Order } from '@/types/order';

export const orderGridColumn = (params: GridAction<Order>): ColDef<Order>[] => [
  {
    headerName: 'Aksi',
    type: ['centerAligned'],
    width: getActionColumnWidth(2),
    pinned: 'left',
    sortable: false,
    cellRenderer: (cell: CustomCellRendererProps<Order>) => {
      const status = cell.data?.status;
      return (
        <div className="flex h-full items-center justify-center gap-2">
          {status === 'closed' ? (
            <ActionIcon onClick={() => params.onView?.(cell.data!.id)} variant="grid-action-view">
              <IconEye />
            </ActionIcon>
          ) : (
            <>
              <ActionIcon onClick={() => params.onEdit?.(cell.data!)} variant="grid-action-view">
                <IconPencil />
              </ActionIcon>
              {status === 'reserved' && (
                <ActionIcon
                  onClick={() => params.onDelete?.(cell.data!.id)}
                  variant="grid-action-delete"
                >
                  <IconTrash />
                </ActionIcon>
              )}
            </>
          )}
        </div>
      );
    },
  },
  {
    headerName: 'No. Meja',
    field: 'table',
    width: columnWidth.shortColumn2,
    valueGetter: (p) => p.data?.table?.number ?? '-',
  },
  {
    headerName: 'Status',
    field: 'status',
    width: columnWidth.shortColumn2,
    type: ['centerAligned'],
    cellRenderer: (p: CustomCellRendererProps<Order>) => {
      if (!p.value) return '-';
      const cfg = ORDER_STATUS_CONFIG[p.value as Order['status']];
      return (
        <Badge color={cfg.color} variant="light" size="sm">
          {cfg.label}
        </Badge>
      );
    },
  },
  {
    headerName: 'Total',
    field: 'total_price',
    width: columnWidth.numericColumn,
    type: ['currency', 'endAligned'],
  },
  {
    headerName: 'Dibuka',
    field: 'opened_at',
    width: columnWidth.timestampColumn,
    type: ['centerAligned', 'formatDateTime'],
  },
  {
    field: 'closed_at',
    headerName: 'Selesai',
    type: ['centerAligned', 'formatDateTime'],
    width: columnWidth.timestampColumn,
  },
  {
    field: 'created_at',
    headerName: 'Dibuat',
    type: ['centerAligned', 'formatDateTime'],
    width: columnWidth.timestampColumn,
  },
  {
    field: 'updated_at',
    headerName: 'Diubah',
    type: ['centerAligned', 'formatDateTime'],
    width: columnWidth.timestampColumn,
  },
];
