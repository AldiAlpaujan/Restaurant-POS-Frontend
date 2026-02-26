import client, { api } from '@/lib/http-client';
import type { Table } from '@/types/table';

export class TableService {
  static async getAvailableTables(): Promise<Table[]> {
    const res = await client().get<{ data: Table[] }>(api.getTables);
    const tables: Table[] = res.data?.data ?? (res.data as unknown as Table[]);
    return tables.filter((t) => t.status === 'available');
  }

  static async getTableById(id: number): Promise<Table | undefined> {
    const res = await client().get<{ data: Table[] }>(api.getTables);
    const tables: Table[] = res.data?.data ?? (res.data as unknown as Table[]);
    return tables.find((t) => t.id === id);
  }
}
