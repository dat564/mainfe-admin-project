import { ProTable } from '@ant-design/pro-components';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import Setting from 'components/svgs/Setting';

const items = [
  {
    label: 'Sửa',
    key: '2'
  },
  {
    key: '1',
    label: 'Xóa'
  }
];

const Tabular = forwardRef(
  ({ columns, isShowSetting = true, handleDelete, handleEdit, loading = false, ...restProps }, ref) => {
    const defaultColumns = [
      {
        title: (
          <div className="flex items-center justify-center">
            <Setting />
          </div>
        ),
        hideInTable: !isShowSetting,
        dataIndex: 'settings',
        width: 100,
        hideInSearch: true,
        key: 'settings',
        search: false,
        align: 'center',
        render: (text, record) => (
          <div className="flex items-center justify-center">
            <Dropdown
              menu={{
                items,
                onClick: async (e) => {
                  switch (e.key) {
                    case '1':
                      Modal.confirm({
                        title: 'Bạn có chắc chắn muốn xóa?',
                        okText: 'Đồng ý',
                        cancelText: 'Hủy',
                        onOk: () => {
                          handleDelete(record.id);
                        }
                      });
                      break;
                    case '2':
                      handleEdit(record);
                      break;
                    default:
                  }
                }
              }}
              trigger={['click']}
            >
              <div className="flex items-center justify-center w-10 h-10 font-medium transition-all bg-white border border-blue-500 rounded-md cursor-pointer hover:bg-blue-500 hover:text-white">
                <SettingOutlined />
              </div>
            </Dropdown>
          </div>
        )
      }
    ];
    const tableColumns = [...defaultColumns, ...columns];
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const tableRef = useRef();

    const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const reload = () => {
      tableRef.current.reload();
    };

    const reset = () => {
      tableRef.current.reset();
    };

    useImperativeHandle(ref, () => ({
      reload,
      selectedRowKeys,
      setSelectedRowKeys,
      reset
    }));

    return (
      <ProTable
        actionRef={tableRef}
        columns={tableColumns}
        bordered
        rowClassName="cursor-pointer"
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        pagination={{
          pageSize: 10
        }}
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
