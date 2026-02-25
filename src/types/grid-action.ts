export interface GridAction<TData> {
  onView?: (id: number) => void;
  onEdit?: (data: TData) => void;
  onDelete?: (id: number) => void;
}
