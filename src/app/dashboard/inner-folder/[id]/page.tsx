"use client";
import SideBar from "@/app/component/sideBar";
import StorageSide from "@/app/component/storageSide";
import { Divider, Layout } from "antd";
import { useParams } from "next/navigation";
import React from "react";

const PagesCom = () => {
  const params = useParams();
  console.log(params);
  return (
    <div className="flex">
      <Layout className="min-h-[100vh] ">
        <SideBar />
      </Layout>

      <div className="w-[55%] bg-[#E6E6E6] ">
        <div className="flex justify-between bg-[#818181] p-[9px]">
          <h1 className="text-[#fff] text-center">Name</h1>
          <Divider className="bg-[#fff] h-[40px]" type="vertical" />
          <h1 className="text-[#fff]">Date modified</h1>
          <Divider className="bg-[#fff] h-[40px]" type="vertical" />
          <h1 className="text-[#fff]">type</h1>
        </div>
      </div>

      <StorageSide />
    </div>
  );
};

export default PagesCom;
