"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusCircleOutlined, HomeFilled } from "@ant-design/icons";
import { Divider, Radio, Table } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DeleteOutlined,
  FileOutlined,
  StarOutlined,
} from "@ant-design/icons";

import { Layout } from "antd";
const { Sider } = Layout;
import { Input, Menu } from "antd";
interface DataType {
  key: React.Key;
  name: string;
  Size: string;
  Modified: string;
}
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text: string) => (
      <span>
        <FileOutlined style={{ marginRight: 8 }} />
        <a>{text}</a>
      </span>
    ),
  },
  {
    title: "Modified",
    dataIndex: "Modified",
  },
  {
    title: "Size",
    dataIndex: "Size",
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "icons8-nature-100.png",
    Modified: "july/32/2023",
    Size: "0.00 MB",
  },
  {
    key: "1",
    name: "icons8-nature-100.png",
    Modified: "july/32/2023",
    Size: "0.00 MB",
  },
  {
    key: "1",
    name: "icons8-nature-100.png",
    Modified: "july/32/2023",
    Size: "0.00 MB",
  },
  {
    key: "1",
    name: "icons8-nature-100.png",
    Modified: "july/32/2023",
    Size: "0.00 MB",
  },
];
const Page = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="flex  w-full bg-[#c4c4c4] ">
        <Layout className="min-h-[100vh] ">
          <Sider
            className="!bg-[#faf9f9] w-[500px] "
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical ">
              {" "}
              <div className="flex mt-[20px]">
                <Image
                  src="/images/cloud-data.png"
                  width={100}
                  height={100}
                  alt=""
                />
                <h1 className="text-center">cloud store</h1>
              </div>
            </div>

            <div className="flex  flex-col justify-center   gap-[14px] ">
              <Button className="text-center text-[#fff] flex items-center h-[50px] text-[14px] max-w-[200px] bg-[#0d6eaf]">
                Add New File
                <PlusCircleOutlined className="text-[18px]" />
              </Button>

              <Button className="text-center text-[#fff] flex  items-center h-[50px] text-[14px] max-w-[200px]  bg-[#0d6eaf]">
                Create Folder
                <PlusCircleOutlined className="text-[18px]" />
              </Button>
              <br></br>
              <br></br>
              <Button className="text-center text-[#fff] flex  items-center h-[50px] text-[14px] max-w-[200px]  bg-[#0d6eaf]">
                <HomeFilled />
                Home
              </Button>

              <div className="demo-logo-vertical" />
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={[
                {
                  key: "1",
                  icon: <FileOutlined />,
                  label: "My files",
                },
                {
                  key: "2",
                  icon: <StarOutlined />,
                  label: "Starrred",
                },
                {
                  key: "3",
                  icon: <DeleteOutlined />,
                  label: "trash",
                },
              ]}
            />
          </Sider>
        </Layout>

        <div className="w-[50%] bg-[#e6e6e6] max-w-[1280px] flex flex-col mx-auto items-center gap-[20px] ">
          <Input
            className="w-[95%] mt-[20px] text-[14px] h-[40px] rounded-[8px]"
            placeholder="Search"
            prefix={<SearchOutlined className="site-form-item-icon" />}
          />

          <div className="bg-[#ffffff] w-[95%] p-[10px] rounded-[8px] ">
            <div className="flex justify-between mt-[6px] mb-[20px]">
              <h1 className="font-[800] Poppins">Recent Folders</h1>
              <h1 className="text-[#0e5fcadd] font-sans">view all</h1>
            </div>
            <div className="flex justify-between flex-wrap ">
              <div className="border border-1px p-[30px] rounded-[8px] text-center">
                <Image
                  src="/images/file_explorer (2).webp"
                  width={100}
                  height={100}
                  alt=""
                />
                <h1>react</h1>
              </div>
              <div className="border border-1px p-[30px] rounded-[8px] text-center">
                <Image
                  src="/images/file_explorer (2).webp"
                  width={100}
                  height={100}
                  alt=""
                />
                Youtube
              </div>
              <div className="border border-1px p-[30px] rounded-[8px] text-center">
                <Image
                  src="/images/file_explorer (2).webp"
                  width={100}
                  height={100}
                  alt=""
                />
                Angular
              </div>
              <div className="border border-1px p-[30px] rounded-[8px] text-center">
                <Image
                  src="/images/file_explorer (2).webp"
                  width={100}
                  height={100}
                  alt=""
                />
                Projects
              </div>
            </div>
          </div>
          <div className="w-[95%] ">
            <h1 className="font-[800] Poppins mb-[20px]">Recent files</h1>
            <Table columns={columns} dataSource={data} />
          </div>
        </div>

        <div className="w-[30%] bg-[#f5f3ef] ">
          <div className="flex text-center">
            <div className="rounded-full bg-[#d8b414] w-[40px] h-[40px] text-center flex items-center justify-center ">
              S
            </div>
            <h1 className="font-[700] text-center mt-[8px]">Sarib Ghouri</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
