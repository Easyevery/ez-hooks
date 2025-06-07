import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Service, ArcoTableOptions, ArcoTableResult, TableState, KV, ExportData } from './type';

const useArcoTable = <TData extends unknown[], FormData extends KV<any> = KV<any>>(
  service: Service<TData, FormData>,
  options: ArcoTableOptions<TData, FormData>,
): ArcoTableResult<TData, FormData> => {
  const { form, defaultParams, queryKey, manual = false } = options ?? {};

  const initialParams = useRef<TableState>({
    pagination: {
      current: defaultParams?.current ?? 1,
      pageSize: defaultParams?.pageSize ?? 10,
      total: 0,
    },
    timeStamp: Date.now(),
  });

  const [tableState, setTableState] = useState<TableState>(JSON.parse(JSON.stringify(initialParams.current)));

  const queryResult = useQuery<ExportData<TData>, Error, ExportData<TData>>({
    enabled: !manual,
    queryKey: [queryKey, tableState],
    queryFn: async () => {
      let formData: FormData = {} as FormData;

      if (form && typeof form.validate === 'function') {
        formData = await form.validate();
      }

      const params = {
        ...tableState,
        formData,
      };

      const result = await service(params);
      return result;
    },
  });

  const { data, isFetching, isLoading, refetch } = queryResult;

  const onTableChange: ArcoTableResult<TData, FormData>['tableProps']['onChange'] = (pagination, sorter, filters, extra) => {
    setTableState((prevState) => ({
      ...prevState,
      pagination: {
        ...prevState.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters,
      sorter,
      extra,
    }));
    setTimeout(() => refetch());
  };

  return {
    tableProps: {
      data: data?.list || ([] as unknown as TData),
      loading: isLoading || isFetching,
      onChange: onTableChange,
      pagination: {
        ...tableState.pagination,
        total: data?.total || 0,
      },
    },
    search: {
      submit: () => {
        setTimeout(() => refetch());
      },
      reset: () => {
        setTimeout(() => {
          form?.resetFields();
          setTableState({
            ...initialParams.current,
            timeStamp: Date.now(),
          });
        });
      },
      getParams: () => {
        return Object.assign(tableState, {
          formData: form?.getFieldsValue() as FormData,
        });
      },
    },
    queryResult,
  };
};

export default useArcoTable;
