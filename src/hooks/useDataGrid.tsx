import { useCallback, useMemo } from 'react';
import type {
  ColDef,
  ColTypeDef,
  IRowNode,
  RowDataUpdatedEvent,
  RowSelectionOptions,
  SelectionChangedEvent,
  SortChangedEvent,
} from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import Enumerable from 'linq';
import type { AppDataGridProps, AppDataGridSettings } from '@/components/AppDataGrid/AppDataGrid';
import AppLoadingCell from '@/components/AppDataGrid/AppLoadingCell';
import AppNoDataOverlay from '@/components/AppDataGrid/AppNoDataOverlay';
import { gridColumnTypes } from '@/lib/variable';
import type { DataFilter, DataGridSource, DataSort } from './useDataGridSource';

interface useDataGridProps<TData> extends AppDataGridSettings {
  source: DataGridSource<TData>;
  columnDefs: ColDef[];
  withPagination?: boolean;
  rowSelection?: RowSelectionOptions;
  multipleSort?: boolean;

  onFilterClick?: (setFilters: (data: DataFilter) => void, data?: DataFilter) => void;
  onSelectedRowChanged?: (data: TData[]) => void;
}

export default function useDataGrid<TData>({
  source,
  columnDefs,
  withPagination = true,
  multipleSort = false,
  withBorder = false,
  rowSelection,

  showHeader = true,
  showSearch = true,
  leftAction,
  rightAction,
  showFilter = false,

  onFilterClick,
  onSelectedRowChanged,
}: useDataGridProps<TData>): AppDataGridProps {
  const columnTypes = useMemo(
    (): {
      [key: string]: ColTypeDef<TData>;
    } => gridColumnTypes,
    []
  );

  const onSelectionChanged = useCallback(
    (params: SelectionChangedEvent) => {
      if (!source.loading) {
        source.setSelection(params.api.getSelectedRows().map((x) => x.id));
        if (onSelectedRowChanged) {
          const selectedRow = params.api.getSelectedRows();
          onSelectedRowChanged(selectedRow);
        }
      }
    },
    [source.loading, onSelectedRowChanged]
  );

  const onSortChanged = useCallback((params: SortChangedEvent) => {
    const dataSort: DataSort[] = Enumerable.from(params.api.getColumnState())
      .where((x) => x.sort !== null)
      .toArray()
      .map((x) => {
        return {
          colId: x.colId,
          order: x.sort,
          sortIndex: x.sortIndex,
        } as DataSort;
      });
    source.setSorting(dataSort);
  }, []);

  const onRowDataUpdated = useCallback(
    (params: RowDataUpdatedEvent) => {
      if (!source.loading) {
        const nodesToSelect: IRowNode[] = [];
        params.api.forEachNode((node) => {
          if (source.selection.find((x) => x === node.data.id)) {
            nodesToSelect.push(node);
          }
        });
        params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
      }
    },
    [source.loading, source.selection]
  );

  return {
    rowData: source.data,
    columnDefs: columnDefs.map((col) => ({
      ...col,
      sortable: col.sortable ?? col.headerName !== 'Aksi',
      cellRenderer: !source.loading
        ? col.cellRenderer
        : (params: CustomCellRendererProps) => {
            return (
              <AppLoadingCell
                loading={source.loading}
                cellParams={params}
                resolvers={source.resolvers}
              />
            );
          },
    })),
    enableCellTextSelection: !source.loading,
    initialState: {
      sort: {
        sortModel: source.sorting.map((x) => ({
          colId: x.colId,
          sort: x.order,
        })),
      },
    },

    pagination: withPagination,
    paginationPageSize: source.pagination.pageSize,
    suppressPaginationPanel: true,
    rowSelection: rowSelection,
    alwaysMultiSort: multipleSort,
    noRowsOverlayComponentParams: { error: source.error, onTryAgain: source.fetchData },
    columnTypes,

    animateRows: false,
    suppressColumnMoveAnimation: true,

    onSelectionChanged,
    onSortChanged,
    onRowDataUpdated: rowSelection && onRowDataUpdated,
    noRowsOverlayComponent: AppNoDataOverlay,

    // AppGrid Settings
    settings: {
      showHeader,
      showSearch,
      leftAction,
      rightAction,
      showFilter,
      withBorder,

      pageSize: source.pagination.pageSize,
      currentPage: source.pagination.pageIndex,
      totalPages: source.pagination.pageTotal,
      hasFilter: Object.keys(source.filters).length > 0,

      onRefresh: source.fetchData,
      onSearch: source.setSearchFilter,
      onFilter: () => onFilterClick!(source.setFilters, source.filters),

      onPageSizeChange: source.onPageSizeChange,
      onPageChange: source.onPageChange,
    },
  };
}
