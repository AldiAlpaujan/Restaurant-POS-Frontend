import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { ColDef, ColTypeDef } from 'ag-grid-community';
import type { AppFormGridProps } from '@/components/AppDataGrid/AppFormGrid';
import { gridColumnTypes } from '@/lib/variable';

interface UseFormGridProps {
  columnDefs: ColDef[];
}

export default function useFormGrid<TData>(props: UseFormGridProps): AppFormGridProps & {
  setData: Dispatch<SetStateAction<TData[]>>;
} {
  const [data, setData] = useState<TData[]>([]);

  const columnTypes = useMemo(
    (): {
      [key: string]: ColTypeDef<TData>;
    } => gridColumnTypes,
    []
  );

  return {
    rowData: data,
    setData,
    columnDefs: props.columnDefs,
    columnTypes,
  };
}
