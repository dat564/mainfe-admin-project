import { SettingOutlined } from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';

const defaultItems = [
  {
    label: 'Sửa',
    key: '2'
  },
  {
    key: '1',
    label: 'Xóa'
  }
];

export const operatorColumnRender = ({ record, items = [], handleDelete, handleEdit }) => (
  <div className="flex items-center justify-center">
    <Dropdown
      menu={{
        items: [...defaultItems, ...items],
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
);
