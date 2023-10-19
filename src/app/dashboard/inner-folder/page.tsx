"use client";
import SideBar from "@/app/component/sideBar";
import { Layout } from "antd";
import React from "react";

const PagesCom = () => {
  return (
    <div className="flex">
      <Layout className="min-h-[100vh] ">
        <SideBar />
      </Layout>

      <div className="w-[55%] bg-[#d8b130]">
        <h1>dgheghewghwe</h1>
      </div>
      <div className="w-[30%] bg-[#974f4f]">
        <h1>dgheghewghwe</h1>
      </div>
    </div>
  );
};

export default PagesCom;
