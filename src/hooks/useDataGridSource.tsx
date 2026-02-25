import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios, { type AxiosRequestConfig, type AxiosResponseHeaders } from 'axios';
import fileSaver from 'js-file-download';
import Enumerable from 'linq';
import queryString from 'query-string';
// import type { DateRange } from 'react-day-picker';
import { useImmer } from 'use-immer';
import type { ComboboxType } from '@/components/Shared/AppCombobox';
// import { formatDate } from '@/lib/formatters';
import client from '@/lib/http-client';
import { parseError } from '@/lib/http-handlers';
import { modalUtils } from '@/lib/modal-utlis';
import { toastUtils } from '@/lib/toast-utils';

interface useDataGridSourceProps {
  url: string;
  initialSort?: DataSort[];
  queryParam?: DataFilter;
  initialFilter?: DataFilter;
  initialSelection?: number[];
  suppressFetchData?: boolean;

  onDataAssign?: (result: number | null) => void;
}
function isComboboxType(obj: unknown): obj is ComboboxType {
  return typeof obj === 'object' && obj !== null && 'value' in obj && 'label' in obj;
}
// function isDateRange(obj: unknown): obj is DateRange {
//   return typeof obj === 'object' && obj !== null && 'from' in obj && 'to' in obj;
// }

export interface DataGridSource<TData> {
  data: TData[];
  header?: AxiosResponseHeaders;
  loading: boolean;
  error: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageTotal: number;
  };
  searchFilter: string;
  filters: DataFilter;
  sorting: DataSort[];
  selection: number[];
  resolvers: (() => void)[];

  fetchData: () => void;
  exportFile: (url: string, params?: { [key: string]: unknown }) => void;
  insertAll: (data: TData[]) => void;
  insert: (data: TData) => void;
  insertRange: (data: TData[]) => void;
  update: (data: TData) => void;
  remove: (id: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
  setSearchFilter: (value: string) => void;
  setFilters: (data: DataFilter) => void;
  setSorting: (data: DataSort[]) => void;
  setSelection: (data: number[]) => void;
  resetData: () => void;
}

export type DataFilter<T = unknown> = {
  [key: string]: T;
};

export type DataSort = {
  colId: string;
  order: 'asc' | 'desc';
  sortIndex?: number;
};

const resolvers: (() => void)[] = [];
type WithId = { id: number };
export default function useDataGridSource<TData>({
  url,
  initialSort,
  queryParam,
  initialFilter,
  initialSelection,
  suppressFetchData,
  onDataAssign,
}: useDataGridSourceProps): DataGridSource<TData> {
  const [data, setData] = useState<TData[]>([]);
  const [header, setHeader] = useState<AxiosResponseHeaders>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [pagination, setPagination] = useImmer({ pageIndex: 1, pageSize: 20, pageTotal: 0 });
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [filters, setFilters] = useState<DataFilter>(initialFilter ?? {});
  const [sorting, setSorting] = useState<DataSort[]>(initialSort ?? []);
  const [selection, setSelection] = useState<number[]>(initialSelection ?? []);

  const controllerRef = useRef<AbortController | null>(null);

  const resetData = useCallback(() => {
    const dataLoading: TData[] = [];

    for (let i = 0; i < 8; i++) {
      dataLoading.push({} as TData);
    }

    setData(dataLoading);
  }, []);

  const httpRequestProps = useMemo((): AxiosRequestConfig => {
    const sortBy = Enumerable.from(sorting)
      .orderBy((x) => x.sortIndex)
      .select((x) => x.colId)
      .toArray();

    const sortDesc = Enumerable.from(sorting)
      .select((x) => x.order === 'desc')
      .toArray();

    const otherFilter: DataFilter = {};

    for (const key in filters) {
      if (typeof filters[key] === 'object') {
        if (Array.isArray(filters[key])) {
          otherFilter[key] = filters[key].map((item) => (item as ComboboxType).value);
        } else if (isComboboxType(filters[key])) {
          otherFilter[key] = (filters[key] as ComboboxType).value;
        }
        // else if (isDateRange(filters[key])) {
        // otherFilter[key] =
        //   `${formatDate(filters[key]!.from?.toString() ?? '', 'yyyy/MM/dd')},${formatDate(filters[key]!.to?.toString() ?? '', 'yyyy/MM/dd')}`;
        // }
        else {
          otherFilter[key] = filters[key];
        }
      } else {
        otherFilter[key] = filters[key];
      }
    }

    return {
      params: {
        search: searchFilter !== '' ? searchFilter : null,
        page: pagination.pageIndex,
        rowsPerPage: pagination.pageSize,
        sortBy: sortBy,
        sortDesc: sortDesc,
        ...otherFilter,
        ...queryParam,
      },
      paramsSerializer: (params) => queryString.stringify(params),
    };
  }, [sorting, searchFilter, pagination.pageIndex, pagination.pageSize, filters]);

  const fetchData = useCallback(async () => {
    if (suppressFetchData) return;

    if (controllerRef.current) {
      controllerRef.current!.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      // TODO: DELETE THIS AFTER PRODUCTION READY
      if (true) {
        resetData();
        setError(false);
        setLoading(true);
        const res = await fetch(url, {
          signal: controller.signal,
        });

        const data = await res.json();

        // mock header & pagination
        setHeader({} as AxiosResponseHeaders);
        setPagination((draft) => {
          draft.pageTotal = 1;
        });

        resolvers.forEach((resolver) => resolver());
        setData(data);
        onDataAssign?.(data.length);
        setLoading(false);
        return;
      }

      resetData();
      setError(false);
      setLoading(true);
      const res = await client().get(url, {
        ...httpRequestProps,
        signal: controller.signal,
      });
      setHeader(res.headers as AxiosResponseHeaders);
      resolvers.forEach((resolver) => resolver());
      setPagination((draft) => {
        const headerTotal = res.headers['x-total-count'];
        draft.pageTotal = Math.ceil(headerTotal / pagination.pageSize);
      });
      setLoading(false);
      setData(res.data);
    } catch (err) {
      parseError(err, () => {
        if (!axios.isCancel(err)) {
          setError(true);
          setData([]);
        }
      });
    }
  }, [resetData, url, httpRequestProps, setPagination]);

  const exportFile = useCallback(
    async (path: string, params?: { [key: string]: unknown }) => {
      const loading = modalUtils.loading();
      try {
        const config: AxiosRequestConfig = {
          ...httpRequestProps,
          params: {
            ...httpRequestProps.params,
            ...params,
          },
          paramsSerializer: {
            indexes: null,
          },
          responseType: 'arraybuffer',
        };
        const res = await client().get(`${url}/${path}`, config);
        // process data
        const cd = res.headers['content-disposition'];
        const regex = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/;
        const fileName = cd.match(regex)[1];
        const contentType = res.headers['content-type'];
        fileSaver(res.data, fileName, contentType);
        toastUtils.info({ message: 'Data berhasil diexport' });
      } catch (err) {
        parseError(err);
      }
      loading.close();
    },
    [httpRequestProps]
  );

  const insertAll = (newData: TData[]) => {
    setData(newData);
  };

  const insert = (newData: TData) => {
    setData((prevData) => [newData, ...prevData]);
  };

  const insertRange = (newData: TData[]) => {
    setData((prevData) => [...newData, ...prevData]);
  };

  const update = (newData: TData) => {
    const tmpNewData = newData as TData & WithId;
    setData((prevData) =>
      prevData.map((item) => ((item as TData & WithId).id === tmpNewData.id ? tmpNewData : item))
    );
  };

  const remove = (id: number) => {
    setData((prevData) => prevData.filter((item) => (item as TData & WithId).id !== id));
  };

  const onPageSizeChange = (limit: number) => {
    setPagination((draft) => {
      draft.pageSize = limit;
    });
  };

  const onPageChange = (page: number) => {
    setPagination((draft) => {
      draft.pageIndex = page;
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    header,
    loading,
    error,
    pagination,
    searchFilter,
    filters,
    sorting,
    selection,
    resolvers,

    fetchData,
    exportFile,
    onPageSizeChange,
    insertAll,
    insert,
    insertRange,
    update,
    remove,
    onPageChange,
    setSearchFilter,
    setFilters,
    setSorting,
    setSelection,
    resetData,
  };
}
