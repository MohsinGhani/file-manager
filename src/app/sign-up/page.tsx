"use client";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

import { auth, db } from "../../../firebase";
import { Modal } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, Form, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { doc, setDoc } from "firebase/firestore";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const onFinish = async (values: any) => {
    console.log("🚀 ~ values:", values);

    const { lastName, email, phoneNumber, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const authUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(authUser, "authUser");
      const firstName = values.firstName;

      await updateProfile(authUser.user, { displayName: firstName });
      await sendEmailVerification(authUser.user);

      const uid = authUser.user.uid;
      await setDoc(doc(db, "Users", uid), {
        firstName,
        lastName,
        email,

        phone: phoneNumber,
      });

      setLoading(false);

      Modal.success({
        title: "Sign up successful!",
        content: "Please check your email and verify your account.",
        okText: "Close",
        closeIcon: <CloseOutlined />,
        onOk: () => {
          router.push("/");
        },
        className: "custom-success-modal",
      });
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
      setError("An error occurred during sign up.");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Validation failed:", errorInfo);
  };
  return (
    <div className="w-full bg relative h-[85vh] pl-[10px] pr-[10px] bg-[#fff]">
      <div className="mx-auto max-w-[460px] mt-[50px] items-center flex flex-col">
        <h1 className="font-[600] text-[30px] font-poppins text-[#000] mb-[-30px]">
          Signup
        </h1>
        <p className="font-[500] text-[14px] font-poppins text-[#8591A3] mb-[45px]"></p>
        <Form
          name="signup"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          }}
        >
          <div className="max-w-[1280px] justify-between gap-[10px] w-full flex max-sm:flex-col mb-[20px]">
            <Form.Item
              name="firstName"
              rules={[
                { required: true, message: "Please enter your first name." },
              ]}
            >
              <Input
                className="font-[500] text-[14px]  w-[225px]    max-sm:w-[100%] rounded-[10px] font-poppins text-[#8591A3] h-[60px] "
                placeholder="First Name"
                maxLength={16}
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[
                { required: true, message: "Please enter your last name." },
              ]}
            >
              <Input
                className="font-[500] text-[14px] w-[225px]  max-sm:w-[100%]  rounded-[10px] font-poppins text-[#8591A3] h-[60px] "
                placeholder="Last Name"
                maxLength={16}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email address." },
              {
                type: "email",
                message: "Please enter a valid email address.",
              },
            ]}
          >
            <Input
              className="font-[500] text-[14px]  rounded-[10px] font-poppins text-[#8591A3] h-[60px] mb-[20px] "
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your phone number." },
            ]}
          >
            <Input
              type="number"
              className="font-[500] text-[14px]  rounded-[10px] font-poppins text-[#8591A3] h-[60px] mb-[20px] "
              placeholder="Phone Number"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              className="font-[500] text-[14px]  rounded-[10px] font-poppins text-[#8591A3] h-[60px]  mb-[20px] "
              placeholder="Password"
              maxLength={16}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value.trim()) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Passwords do not match!");
                },
              }),
            ]}
          >
            <Input.Password
              className="font-[500] text-[14px]  rounded-[10px] font-poppins text-[#8591A3] h-[60px]  mb-[20px] "
              placeholder="Confirm Password"
              maxLength={16}
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              className="rounded-[10px] bg-[#ddad45] max-w-[460px] w-full h-[50px] login text-white text-[18px] font-[500] font-poppins"
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center mt-[10px]">
          Already have an account?{" "}
          <a
            onClick={() => {
              router.push("/login");
            }}
            className="rounded-[10px] max-w-[450px] w-full h-[50px] cursor-pointer text-[#cea141] text-[18px] font-[500] hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
