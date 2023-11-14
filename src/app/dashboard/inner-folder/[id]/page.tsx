"use client";
import SideBar from "@/app/component/sideBar";
import StorageSide from "@/app/component/storageSide";
import { DeleteOutlined } from "@ant-design/icons";
import { Breadcrumb, Divider, Layout, Table } from "antd";
import React, { useState } from "react";
const PagesCom = () => {
  interface DataType {
    key: React.Key;
    name: string;
    Size: string;
    Modified: string;
    delete: "icons8-nature-100.png";
  }
  const [data, setData] = useState([
    {
      key: "1",
      name: "camera_lense_0.jpeg",
      Modified: "july/32/2023",
      Size: "0.00 MB",
      delete: "icons8-nature-100.png",
    },
    {
      key: "2",
      name: "file_explorer (1).webp",
      Modified: "july/32/2023",
      Size: "0.00 MB",
      delete: "icons8-nature-100.png",
    },
    {
      key: "3",
      name: "cloud-data-storage.jpg",
      Modified: "july/32/2023",
      Size: "0.00 MB",
      delete: "icons8-nature-100.png",
    },
    {
      key: "4",
      name: "icons8-nature-100.png",
      Modified: "july/32/2023",
      Size: "0.00 MB",
      delete: "icons8-nature-100.png",
    },
    {
      key: "5",
      name: "icons8-nature-100.png",
      Modified: "july/32/2023",
      Size: "0.00 MB",
      delete: "icons8-nature-100.png",
    },
  ]);

  const handleDeleteRow = (key: any) => {
    const updatedData = data.filter((item) => item.key !== key);
    setData(updatedData);
  };
  const columns = [
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "Date modified",
      dataIndex: "Modified",
    },
    {
      title: "Size",
      dataIndex: "Size",
    },

    {
      title: "Action",
      dataIndex: "delete",
      render: (text: any) => (
        <span
          className="cursor-pointer hover:text-red-500"
          onClick={() => {
            handleDeleteRow(text?.key);
          }}
        >
          <DeleteOutlined style={{ marginRight: 8 }} />
        </span>
      ),
    },
  ];

  return (
    <div className="flex">
      <Layout className="min-h-[100vh]">
        <SideBar />
      </Layout>
      <Divider className="bg-[#ffffff] h-[1000px]" type="vertical" />
      <div className="w-[55%] bg-[#ffffff] ">
        <Breadcrumb
          className="flex justify-between w-[95%] mt-5    mb-[20px] font-[700] ml-[25px]"
          items={[
            {
              title: "Dashboard",
            },
            {
              title: (
                <a className="text-[#000]" href="#">
                  inner folder
                </a>
              ),
            },
          ]}
        />

        <Table
          className="w-[70%] ml-[20px] bg-white"
          columns={columns}
          dataSource={data}
        />
      </div>
      <Divider className="bg-[#ffffff] h-[1000px]" type="vertical" />
      <StorageSide />
    </div>
  );
};

export default PagesCom;
