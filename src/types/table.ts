export type TableStatus = "available" | "occupied" | "reserved" | "inactive";

export type Table = {
  id: number;
  number: number;
  status: TableStatus;
  created_at: string;
  updated_at: string;
};

export type TablesResponse = {
  data: Table[];
};
