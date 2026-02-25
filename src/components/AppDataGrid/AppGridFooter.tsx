import { Pagination } from '@mantine/core';
import AppCombobox, { type ComboboxType } from '../Shared/AppCombobox';

export interface AppGridFooterProps {
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
}

export default function AppGridFooter(props: AppGridFooterProps) {
  const pageSizes: ComboboxType[] = [
    {
      value: 5,
      label: '5',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
    {
      value: 150,
      label: '150',
    },
  ];

  if (!props.totalPages) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-end gap-3 p-2">
      <AppCombobox
        srcOpt={pageSizes}
        value={pageSizes.find((item) => item.value === props.pageSize)}
        className="w-19.5!"
        onChange={(e) => {
          props.onPageSizeChange(e?.value);
          props.onPageChange(1);
        }}
      />
      <Pagination
        value={props.currentPage}
        onChange={props.onPageChange}
        total={props.totalPages}
      />
    </div>
  );
}
