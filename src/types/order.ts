import type { Table } from './table';

export type OrderStatus = 'open' | 'reserved' | 'closed';

export type Order = {
  id: number;
  table_id: number;
  user_id: number;
  status: OrderStatus;
  total_price: string;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  table: Table;
};
