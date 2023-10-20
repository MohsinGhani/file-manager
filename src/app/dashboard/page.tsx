"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Form, Table, message, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  SearchOutlined,
  DeleteOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "../layout";

import SideBar from "../component/sideBar";
import StorageSide from "../component/storageSide";

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
  const { user }: { user: any } = useAuthContext();

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
          console.log("folderData :", folderData);
        });

        setFolderId(folderData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        message.error(error?.message);
      }
    };

    fetchData();
  }, [user, folderId]);

  return (
    <>
      <div className="flex bg-[#c4c4c4]">
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
                      router.push(`/dashboard/inner-folder/${folder.folderId}`);
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

        <StorageSide />
      </div>
    </>
  );
};

export default Page;
