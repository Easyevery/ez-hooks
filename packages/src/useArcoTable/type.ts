import { useQuery } from '@tanstack/react-query';

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type KV<T = unknown> = Record<string, T>;

/* Aroc Interface */
type SorterFn = (a: any, b: any) => number;

type SortDirection = 'descend' | 'ascend';

type SimplePagination = {
  current: number;
  pageSize: number;
  total: number;
};

interface SorterInfo {
  direction?: SortDirection;
  field?: string | number;
  sorterFn?: SorterFn;
  priority?: number;
}

/* Form Interface */
export type FormMethod<FormData extends KV<any> = KV<any>> = {
  getFieldsValue: (...args: any) => FormData;
  resetFields: (...args: any) => void;
  validate: (...args: any) => Promise<FormData>;
  getInternalHooks?: any;
  [key: string]: any;
};

export type ExportData<TData extends unknown[]> = {
  list: TData;
  total: number;
};

export type TableState<T = any> = {
  pagination: SimplePagination;
  sorter?: SorterInfo | SorterInfo[];
  filters?: Partial<Record<keyof T, string[]>>;
  extra?: {
    currentData: T[];
    currentAllData: T[];
    action: 'paginate' | 'sort' | 'filter';
  };
  timeStamp?: number;
};

export type Service<TData extends unknown[], FormData extends KV<any> = KV<any>> = (
  params: TableState<TData> & { formData: FormData },
) => Promise<ExportData<TData>>;

export type ArcoTableOptions<TData extends unknown[], FormData extends KV<any> = any> = {
  form?: FormMethod<FormData>;
  defaultParams?: DeepPartial<ArcoTableResult<TData, FormData>['tableProps']['pagination']>;
  manual?: boolean;
  queryKey: string;
};

export type ArcoTableResult<TData extends unknown[], FormData> = {
  tableProps: {
    data: TData;
    loading: boolean;
    onChange?: (
      pagination: TableState<TData[number]>['pagination'],
      sorter: TableState<TData[number]>['sorter'],
      filters: TableState<TData[number]>['filters'],
      extra: TableState<TData[number]>['extra'],
    ) => void;
    pagination: TableState['pagination'];
  };
  search: {
    submit: () => void;
    reset: () => void;
    getParams: () => TableState<TData> & { formData: FormData };
  };
  queryResult: ReturnType<typeof useQuery>;
};
