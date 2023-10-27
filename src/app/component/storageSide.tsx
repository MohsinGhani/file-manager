"use client";

import { SettingOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Progress, Tooltip } from "antd";
import React from "react";
import Image from "next/image";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../layout";
const StorageSide = () => {
  const { user }: { user: any } = useAuthContext();
  const router = useRouter();
  const signout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        error.message;
      });
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            signout();
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          LogOut
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a rel="noopener noreferrer" href="https://www.aliyun.com">
          Contact Us
        </a>
      ),
    },
  ];
  return (
    <div className="w-[30%] bg-[#ffffff] blur-md invert contrast-125 md:filter-none">
      <div className="flex text-center mt-[40px] ml-[20px]">
        <div className="rounded-full bg-[#2196aa]  w-[50px] h-[50px] text-center flex items-center justify-center ">
          <b className="font-[600]">S</b>
        </div>
        <div className="ml-[10px]">
          <h1 className="font-[700] text-[20px] text-left">
            {user?.firstName} {user?.lastName}
          </h1>
          <h1 className="font-[500] text-[#b3b0b0] ">{user?.email}</h1>
        </div>
      </div>

      <Dropdown menu={{ items }} placement="bottomLeft" trigger={["click"]}>
        <SettingOutlined className=" SettingOutlined flex justify-end absolute top-5 right-5  text-[24px] cursor-pointer" />
      </Dropdown>

      <div className="flex  items-center justify-center mt-[20px]">
        <Tooltip className="w-[90%] " title="3 done / 4 in progress / 4 to do">
          <h1 className="font-[900] text-[24px]">1.83 MB used of 50 MB</h1>
          <Progress percent={70} success={{ percent: 30 }} />
        </Tooltip>
      </div>
      <div>
        <div className=" shadow-md w-[90%] items-center mx-auto rounded-[8px] text-center cursor-pointer relative transform hover:scale-105 transition-transform   flex justify-between p-[10px] mt-[20px]">
          <div className=" flex">
            <Image
              src="/images/file_explorer (2).webp"
              width={100}
              height={100}
              alt=""
            />
            <div className="">
              <h1 className="font-[600] font-serif font-poppins ">Images</h1>
              <p className="font-poppins text-[#8591A3]">98 files</p>
            </div>
          </div>
          <div className="flex justify-between flex-row text-center items-center">
            <div className="">
              <h1 className="font-[900] text-[24px]">1MB</h1>
            </div>
          </div>
        </div>
        <div className=" shadow-md w-[90%] items-center mx-auto rounded-[8px] text-center cursor-pointer relative transform hover:scale-105 transition-transform   flex justify-between p-[10px] mt-[20px]">
          <div className=" flex">
            <Image
              src="/images/file_explorer (2).webp"
              width={100}
              height={100}
              alt=""
            />
            <div className="">
              <h1 className="font-[600] font-serif font-poppins ">Images</h1>
              <p className="font-poppins text-[#8591A3]">98 files</p>
            </div>
          </div>
          <div className="flex justify-between flex-row text-center items-center">
            <div className="">
              <h1 className="font-[900] text-[24px]">50.6MB</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageSide;
