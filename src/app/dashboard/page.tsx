"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Alert,
  Button,
  Dropdown,
  Form,
  MenuProps,
  Modal,
  Progress,
  Tooltip,
  message,
} from "antd";

import {
  PlusCircleOutlined,
  HomeFilled,
  CloseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Table } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  FileOutlined,
} from "@ant-design/icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "../layout";
import { Layout } from "antd";
const { Sider } = Layout;
import { Input, Menu } from "antd";
import { getAuth, signOut } from "firebase/auth";
import SideBar from "../component/sideBar";

interface DataType {
  key: React.Key;
  name: string;
  Size: string;
  Modified: string;
  delete: "icons8-nature-100.png";
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
  {
    dataIndex: "delete",
    render: (text: string) => (
      <span>
        <DeleteOutlined style={{ marginRight: 8 }} />
      </span>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "icons8-nature-100.png",
    Modified: "july/32/2023",
    Size: "0.00 MB",
    delete: "icons8-nature-100.png",
  },
  {
    key: "2",
    name: "icons8-nature-100.png",
    Modified: "july/32/2023",
    Size: "0.00 MB",
    delete: "icons8-nature-100.png",
  },
  {
    key: "3",
    name: "icons8-nature-100.png",
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
];
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user }: { user: any } = useAuthContext();
  const [eventData, setEventData] = useState<any>(null);
  const [folderIds, setFolderId] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const params: any = useParams();
  const [form] = Form.useForm();
  const uid = user?.uid;
  const { folderId } = params;

  const handleDelete = async (folder: any) => {
    try {
      const docRef = doc(db, "folder", folder.folderId);
      await deleteDoc(docRef);
      message.success(`Folder "${folder.foldername}" deleted successfully`);

      setFolderId((prevFolderIds: any) =>
        prevFolderIds.filter((f: any) => f.id !== folder.folderId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      message.error(`Error deleting folder: ${error?.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "folder"));
        const querySnapshot = await getDocs(q);
        const folderData: any = [];

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          0;
          folderData.push({ folderId: doc.id, ...docData });
        });

        setFolderId(folderData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        message.error(error?.message);
      }
    };

    fetchData();
  }, [user, folderId]);
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
    <>
      <div className="flex   bg-[#c4c4c4] ">
        <SideBar />

        <div className="w-[55%] bg-[#e6e6e6] max-w-[1280px] flex flex-col mx-auto items-center gap-[20px] ">
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
            <div className="flex flex-wrap gap-[10px]">
              {folderIds?.map((folder: any, index: any) => (
                <div
                  key={index}
                  className="shadow-md p-[30px] rounded-[8px] text-center cursor-pointer relative transform hover:scale-105 transition-transform"
                >
                  <CloseOutlined
                    onClick={() => {
                      handleDelete(folder);
                    }}
                    className="absolute top-0 right-0 p-2 cursor-pointer text-red-600 hover:text-red-700"
                  />
                  <Image
                    onClick={() => {
                      router.push("/dashboard/inner-folder");
                    }}
                    src={folder?.folderImage}
                    width={100}
                    height={100}
                    alt=""
                  />
                  <h1>{folder?.foldername}</h1>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[95%] ">
            <h1 className="font-[800] Poppins mb-[20px]">Recent files</h1>
            <Table columns={columns} dataSource={data} />
          </div>
        </div>

        <div className="w-[30%] bg-[#ffffff] ">
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
            <SettingOutlined className="flex justify-end absolute top-0 right-0 p-[20px] text-[24px] cursor-pointer" />
          </Dropdown>

          <div className="flex  items-center justify-center mt-[20px]">
            <Tooltip
              className="w-[90%] "
              title="3 done / 4 in progress / 4 to do"
            >
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
                  <h1 className="font-[600] font-serif font-poppins ">
                    Images
                  </h1>
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
                  <h1 className="font-[600] font-serif font-poppins ">
                    Images
                  </h1>
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
      </div>
    </>
  );
};

export default Page;
