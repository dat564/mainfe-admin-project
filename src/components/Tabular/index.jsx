import { ProTable } from '@ant-design/pro-components';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { renderFormCol } from 'utils';

const Tabular = forwardRef(
  (
    {
      columns,
      handleDelete,
      handleEdit,
      loading = false,
      rowSelectionType = 'checkbox',
      customOnSelectChange,
      ...restProps
    },
    ref
  ) => {
    const tableColumns = [...columns].map((column) => {
      if (column.hideInSearch === true || column.search === false || column.renderFormCol === false) return column;
      column['renderFormItem'] = renderFormCol;
      return column;
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const tableRef = useRef();
    const selectedRowKeysRef = useRef(selectedRowKeys);

    const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(() => newSelectedRowKeys);
      selectedRowKeysRef.current = newSelectedRowKeys;
      customOnSelectChange && customOnSelectChange(newSelectedRowKeys);
    };

    const reload = () => {
      tableRef.current.reload();
    };

    const reset = () => {
      tableRef.current.reset();
    };

    useImperativeHandle(
      ref,
      () => ({
        reload,
        setSelectedRowKeys,
        getSelectedRowKeys: () => selectedRowKeysRef.current || [],
        reset
      }),
      []
    );

    return (
      <ProTable
        actionRef={tableRef}
        columns={tableColumns}
        bordered
        rowClassName="cursor-pointer"
        rowSelection={{ selectedRowKeys, onChange: onSelectChange, type: rowSelectionType }}
        pagination={{
          pageSize: 10
        }}
        scroll={{ y: 500 }}
        search={{
          labelWidth: 'auto'
        }}
        loading={loading}
        {...restProps}
      />
    );
  }
);

export default Tabular;
