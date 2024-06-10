import { Button } from "antd";
import { ModalForm, ProFormText } from "@ant-design/pro-form";

import styles from "./ChangePasswordModalForm.module.less";
import rules from "./rules.validate";
// import { changePassword } from "./user.service";

function ChangePasswordModalForm() {
  // const handleChangePassword = async (values) => {
  //   const { currentPassword, newPassword } = values;
  //   const params = {
  //     currentPassword,
  //     newPassword,
  //   };
  //   try {
  //     const res = await changePassword(params);
  //     const { response } = res;
  //     if (response?.ok) {
  //       return true;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     return false;
  //   }

  //   return false;
  // };

  return (
    <ModalForm
      title="Đổi mật khẩu"
      width={500}
      trigger={
        <Button type="link" className={styles.changePasswordBtn}>
          Đổi mật khẩu
        </Button>
      }
      modalProps={{
        onCancel: () => true,
        destroyOnClose: true,
        okText: "Xác nhận",
        cancelText: "Hủy",
      }}
      // onFinish={(values) => handleChangePassword(values)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ProFormText.Password
          label="Mật khẩu cũ"
          placeholder="Nhập mật khẩu cũ"
          name="currentPassword"
          rules={rules.currentPassword}
        />
        <ProFormText.Password
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          name="newPassword"
          rules={rules.newPassword}
        />
        <ProFormText.Password
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu mới"
          name="reNewPassword"
          rules={rules.reNewPassword}
        />
      </div>
    </ModalForm>
  );
}

export default ChangePasswordModalForm;
