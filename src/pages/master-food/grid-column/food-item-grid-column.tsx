import { ActionIcon, Badge } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { type ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { getActionColumnWidth } from '@/lib/function';
import { columnWidth } from '@/lib/variable';
import type { FoodItem } from '@/types/food-item';
import type { GridAction } from '@/types/grid-action';

export const foodItemGridColumn = (params: GridAction<FoodItem>): ColDef<FoodItem>[] => [
  {
    headerName: 'Aksi',
    type: ['centerAligned'],
    width: getActionColumnWidth(2),
    pinned: 'left',
    sortable: false,
    cellRenderer: (cell: CustomCellRendererProps<FoodItem>) => {
      return (
        <div className="flex h-full items-center justify-center gap-2">
          <ActionIcon onClick={() => params.onEdit?.(cell.data!)} variant="grid-action-view">
            <IconEdit />
          </ActionIcon>
          <ActionIcon onClick={() => params.onDelete?.(cell.data!.id)} variant="grid-action-delete">
            <IconTrash />
          </ActionIcon>
        </div>
      );
    },
  },
  {
    headerName: 'Nama',
    field: 'name',
    width: columnWidth.shortColumn3,
  },
  {
    headerName: 'Kategori',
    field: 'category',
    width: columnWidth.shortColumn2,
    type: 'nullable',
  },
  {
    headerName: 'Harga',
    field: 'price',
    width: columnWidth.numericColumn,
    type: 'currency',
  },
  {
    headerName: 'Deskripsi',
    field: 'description',
    width: columnWidth.longColumn1,
    type: 'nullable',
  },
  {
    headerName: 'Tersedia',
    field: 'is_available',
    width: columnWidth.shortColumn2,
    type: ['centerAligned'],
    cellRenderer: (params: CustomCellRendererProps<FoodItem>) => {
      if (params.value === undefined || params.value === null) return '-';
      return (
        <Badge color={params.value ? 'green' : 'red'} variant="light" size="sm">
          {params.value ? 'Ya' : 'Tidak'}
        </Badge>
      );
    },
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
