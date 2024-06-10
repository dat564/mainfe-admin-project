import { buildValidate } from "utils/utils";

const rules = {
  address: buildValidate(["required"]),
  name: buildValidate(["required"]),
  email: buildValidate(["email"]),
  newEmail: buildValidate(["required", "email"]),
  birthday: buildValidate(["required"]),
  // phone: [
  //   {
  //     required: true,
  //     message: "Please enter this field",
  //   },
  //   // {
  //   //   pattern: /^(\+84|0){1}\d{9}$/g,
  //   //   message: "Phone number invalid",
  //   // },
  // ],
  oldPassword: [
    {
      pattern: /^.{6,}$/g,
      message: "Password must be greater than 6 characters",
    },
  ],
  newPassword: [
    {
      pattern: /^.{6,}$/g,
      message: "Password must be greater than 6 characters",
    },
  ],
  // reNewPassword: [
  //   {
  //     required: true,
  //     message: "Please enter this field",
  //   },
  //   ({ getFieldValue }) => ({
  //     validator(_, value) {
  //       if (!value || getFieldValue("newPassword") === value) {
  //         return Promise.resolve();
  //       }
  //       return Promise.reject(new Error("Mật khẩu không khớp!"));
  //     },
  //   }),
  // ],
};

export default rules;
