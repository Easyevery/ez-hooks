# useArcoTable

```tsx
function Demo() {
  const [form] = Form.useForm();

  const arcoTableResult = useArcoTable(
    async (params) => {
      const fetchPrams = {
        pageIndex: params.pagination.current,
        pageSize: params.pagination.pageSize,
        ...params.formData,
      };

      const res = Promise.resolve({ data: [], count: 200, params: fetchPrams });

      return {
        list: res.data,
        total: res.recordsCount,
      };
    },
    {
      form,
      queryKey: 'leadz-advertiser',
    },
  );

  return (
    <Table
      rowKey="id"
      columns={columns}
      {...arcoTableResult.tableProps}
      pagination={{
        ...arcoTableResult.tableProps.pagination,
        sizeCanChange: true,
        sizeOptions: [10, 20, 50, 100],
      }}
    />
  );
}
```
