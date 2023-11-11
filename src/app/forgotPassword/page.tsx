"use client";

import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";

import { Button, Form, Input, Modal } from "antd";

import { auth } from "../../../firebase";
import { CloseOutlined } from "@ant-design/icons";

const Page = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const handleSendLink = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Email successfully sent!!");
        setTimeout(() => {
          router.push("/");
        }, 3000);

        Modal.success({
          title: "Email sent successful!",
          content: "Please check your email and reset your password",
          okText: "Close",
          closeIcon: <CloseOutlined />,
          onOk: () => {},

          className: "custom-success-modal",
        });
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error: any) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  return (
    <div className="mx-auto max-w-[460px] mt-[50px] pl-[10px] pr-[10px]  items-center flex flex-col leading-[70px]">
      <h1 className="font-[600] text-[30px] font-poppins text-[#000] mb-[-30px]">
        Reset Password
      </h1>
      <p className="font-[500] text-[14px] font-poppins text-[#8591A3]  mb-[45px]"></p>

      <Form form={form} className="max-w-[450px] w-full">
        <Form.Item
          name=" Send Email"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-[500] text-[14px]  rounded-[10px] font-poppins text-[#8591A3] h-[60px] max-w-[460px] mb-[20px] "
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item>
          <Button
            onClick={handleSendLink}
            loading={loading}
            className="rounded-[10px] bg-[#cc9726] max-w-[450px] w-full h-[50px]  login text-white text-[18px] font-[500]  font-poppins"
          >
            send email
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Page;
