import { Button } from "antd";
import { ModalForm, ProFormText } from "@ant-design/pro-form";

import styles from "./ChangePasswordModalForm.module.less";
import rules from "./rules.validate";
// import { changeEmail } from "./user.service";

function ChangeEmailModalForm() {
  // const handleChangeEmail = async (values) => {
  //   const { newEmail, currentPassword } = values;
  //   const params = {
  //     newEmail,
  //     currentPassword,
  //   };
  //   const res = await changeEmail(params);
  //   if (res?.response?.ok) {
  //     // message.success(i18n._(t`Đổi email thành công`));
  //     // return true;
  //   }
  //   // message.error(i18n._(t`Email cũ không đúng`));
  //   // return false;
  // };

  return (
    <ModalForm
      title="Đổi email"
      width={500}
      trigger={
        <Button type="link" className={styles.changePasswordBtn}>
          Đổi email
        </Button>
      }
      modalProps={{
        onCancel: () => true,
        destroyOnClose: true,
      }}
      // onFinish={(values) => handleChangeEmail(values)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ProFormText label="Email mới" name="newEmail" rules={rules.newEmail} />
        <ProFormText.Password
          label="Mật khẩu"
          name="currentPassword"
          rules={rules.currentPassword}
        />
      </div>
    </ModalForm>
  );
}

export default ChangeEmailModalForm;
