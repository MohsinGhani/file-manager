"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { Button, Form, Input } from "antd";

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Received values:", values);

    router.push("/");
  };

  return (
    <div className="mx-auto justify-center max-w-[560px] mt-[50px] pl-[10px] pr-[10px] items-center flex flex-col">
      <h1 className="font-[600] text-[30px] font-poppins text-[#000] ">
        Create a Password
      </h1>
      <p className="font-[500] text-[16px] max-w-[330px] mb-[20px] mt-[20px] text-center font-poppins text-[#8591A3] ">
        Lastly, create a password to secure your account
      </p>

      <Form
        form={form}
        className="max-w-[460px] w-full"
        name="password-form"
        onFinish={onFinish}
        initialValues={{ password1: "", password2: "" }}
        scrollToFirstError
      >
        <Form.Item
          name="password1"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            className="font-[500] text-[14px] rounded-[10px] font-poppins text-[#8591A3] h-[60px] max-w-[450px] mb-[20px] "
            placeholder="Password"
            maxLength={6}
          />
        </Form.Item>
        <Form.Item
          name="password2"
          dependencies={["password1"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password1") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match");
              },
            }),
          ]}
        >
          <Input.Password
            className="font-[500] text-[14px] rounded-[10px] font-poppins text-[#8591A3] h-[60px] max-w-[450px] mb-[20px] "
            placeholder="Confirm Password"
            maxLength={6}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="rounded-[10px] max-w-[450px] w-full h-[50px] bg-[#d6bd2e] login text-white text-[18px] font-[500] font-poppins"
          >
            Set password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
