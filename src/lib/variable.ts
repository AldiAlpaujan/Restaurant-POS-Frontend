import type { ColTypeDef } from 'ag-grid-community';
import type { OrderStatus } from '@/types/order';
import type { TableStatus } from '@/types/table';
import { currency, formatDate, formatNumber } from './formatters';

export const columnWidth = {
  shortColumn1: 100,
  shortColumn2: 150,
  shortColumn3: 200,
  longColumn1: 300,
  longColumn2: 500,
  dateColumn: 150,
  numericColumn: 150,
  timestampColumn: 180,
  fileColumn: 120,
};

export const gridColumnTypes: { [key: string]: ColTypeDef } = {
  currency: {
    valueFormatter: (params) => {
      return currency(params.value) ?? '-';
    },
  },
  formatDateTime: {
    valueFormatter: (params) => {
      return formatDate(params.value, 'DD/MM/YYYY HH:mm:ss') ?? '-';
    },
  },
  formatDate: {
    valueFormatter: (params) => {
      return formatDate(params.value, 'DD/MM/YYYY') ?? '-';
    },
  },
  nullable: {
    valueFormatter: (params) => {
      return params.value ?? '-';
    },
  },
  upperCase: {
    valueFormatter: (params) => {
      return params.value?.toUpperCase() ?? '-';
    },
  },
  numeric: {
    valueFormatter: (params) => {
      return formatNumber(params.value) ?? '-';
    },
  },
  centerAligned: {
    headerClass: 'text-center',
    cellClass: 'text-center',
  },
  endAligned: {
    headerClass: 'text-end',
    cellClass: 'text-end',
  },
};

export const yesAndNoOption = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const activeStatus = [
  { label: 'AKTIF', value: 'ACTIVE', color: '#40C057' },
  { label: 'TIDAK AKTIF', value: 'NOT_ACTIVE', color: '#FA5252' },
];

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'green' },
  reserved: { label: 'Reserved', color: 'grape' },
  closed: { label: 'Closed', color: 'gray' },
};

export const TABLE_STATUS_CONFIG: Record<
  TableStatus,
  { label: string; bg: string; border: string; text: string; dot: string }
> = {
  available: {
    label: 'Available',
    bg: 'var(--mantine-color-green-1)',
    border: 'var(--mantine-color-green-4)',
    text: 'var(--mantine-color-green-8)',
    dot: 'var(--mantine-color-green-6)',
  },
  occupied: {
    label: 'Occupied',
    bg: 'var(--mantine-color-red-1)',
    border: 'var(--mantine-color-red-4)',
    text: 'var(--mantine-color-red-8)',
    dot: 'var(--mantine-color-red-6)',
  },
  reserved: {
    label: 'Reserved',
    bg: 'var(--mantine-color-grape-1)',
    border: 'var(--mantine-color-grape-4)',
    text: 'var(--mantine-color-grape-8)',
    dot: 'var(--mantine-color-grape-6)',
  },
  inactive: {
    label: 'Inactive',
    bg: 'var(--mantine-color-gray-1)',
    border: 'var(--mantine-color-gray-4)',
    text: 'var(--mantine-color-gray-6)',
    dot: 'var(--mantine-color-gray-4)',
  },
};
