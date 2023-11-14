"use client";
import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";

import { auth } from "../../../firebase";
import Error from "next/error";

const ResetPassword = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const searchParams: any = useSearchParams();
  const actionCode = searchParams.get("oobCode");

  const handleSetPassword = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      const { password } = await form.getFieldsValue();
      await verifyPasswordResetCode(auth, actionCode);
      await confirmPasswordReset(auth, actionCode, password);
      message.success("Password reset successful");
      setLoading(false);
      router.push("/");
    } catch (error) {
      setLoading(false);
      if (Error.name === "ValidateError") {
        console.log("Form validation error", error);
      } else {
        console.log("Password reset error", error);
        message.error("Password reset failed");
      }
      return;
    }
  };
  return (
    <div className="mx-auto max-w-[460px] mt-[50px] pl-[10px] pr-[10px] items-center flex flex-col ">
      <h1 className="font-[600] text-[30px] font-poppins text-[#000] ">
        Reset Your Password
      </h1>
      <p className="font-[500] text-[16px] max-w-[330px] mb-[20px] mt-[20px] text-center font-poppins text-[#8591A3] ">
        Enter your new password
      </p>

      <Form
        form={form}
        onFinish={handleSetPassword}
        className="max-w-[450px] w-full"
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="password"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long",
            },
          ]}
        >
          <Input.Password
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="font-[500] text-[14px]  rounded-[10px] font-poppins text-[#8591A3] h-[60px] max-w-[450px] mb-[20px] "
            maxLength={6}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password", "confirmPassword"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("The two passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            className="font-[500] text-[14px]  rounded-[10px] font-poppins text-[#8591A3] h-[60px] max-w-[450px] mb-[20px] "
            maxLength={6}
          />
        </Form.Item>

        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="rounded-[10px] max-w-[450px] w-full h-[50px] bg-[#886d16] login text-white text-[18px] font-[500] font-poppins"
          >
            Set password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ResetPassword;
