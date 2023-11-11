"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Table,
  message,
  Input,
  Breadcrumb,
  Divider,
  Switch,
  Cascader,
} from "antd";
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
import { ColorPicker, theme } from "antd";
interface Option {
  value: React.Key;
  label: string;
  children: object[];
}

const options: Option[] = [
  {
    value: "folder",
    label: "folder",
    children: [
      {
        value: "images",
        label: "images",
        children: [
          {
            value: "image",
            label: "image",
          },
        ],
      },
    ],
  },
  {
    value: "folders",
    label: "folders",
    children: [
      {
        value: "multi folders",
        label: "multi folders",
        children: [
          {
            value: "current folder",
            label: "current folder",
          },
        ],
      },
    ],
  },
];
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
    title: "Action",
    dataIndex: "delete",
    render: (text: any) => (
      <span
        className="cursor-pointer hover:text-red-500"
        // onClick={() => {
        //   handleDeleteRow(text?.key);
        // }}
      >
        <DeleteOutlined style={{ marginRight: 8 }} />
      </span>
    ),
  },
];

const data: DataType[] = [
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
];

const getStoredColor = () => {
  const storedColor = localStorage.getItem("backgroundColor");
  return storedColor || "#ffffff";
};
const Page = () => {
  const { user }: { user: any } = useAuthContext();

  const [folderIds, setFolderId] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const params: any = useParams();

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

  const [backColor, setBackColor] = useState("");
  const handleColorChange = (color: any) => {
    const colorHex = color.toHexString();
    localStorage.setItem("backgroundColor", colorHex);
    setBackgroundColor(colorHex);
    setBackColor(colorHex);
  };
  useEffect(() => {
    const storedColor = getStoredColor();
    setBackgroundColor(storedColor);
    setBackColor(storedColor);
  }, []);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [switchChecked, setSwitchChecked] = useState(true);

  const onChange = (checked: any) => {
    setSwitchChecked(checked);
    setBackgroundColor(checked ? "#86B5F4" : "#ffffff");
  };
  const checker = (value: any) => {
    console.log("value :", value);
  };

  return (
    <>
      <div className="flex  bg-[#ffffff]">
        <SideBar />

        <Divider className="bg-[#ffffff] h-[1000px]" type="vertical" />
        <div
          style={{ backgroundColor, transition: "background-color 3s" }}
          className="w-[55%] pl-[20px] bg-[#ffffff] max-w-[1280px] flex flex-col mx-auto gap-[20px] "
        >
          <div className="flex justify-between w-[95%]">
            <Breadcrumb
              className="flex justify-between  mt-5  font-[700]"
              items={[
                {
                  title: "Dashboard",
                },

                {},
              ]}
            />

            <Switch
              className="mt-[20px]"
              defaultChecked={switchChecked}
              onChange={onChange}
            />
          </div>
          <Input
            className="w-[95%] mt-[10px] text-[14px] h-[40px] rounded-[8px]"
            placeholder="Search"
            prefix={<SearchOutlined className="site-form-item-icon" />}
          />
          <div
            style={{ backgroundColor, transition: "background-color 3s" }}
            className="bg-[#ffffff] w-[95%]  rounded-[8px] "
          >
            <div className="flex justify-between">
              <h1 className="font-[800] Poppins">Recent Folders</h1>

              <Cascader
                options={options}
                onChange={checker}
                placeholder="view all"
              />
            </div>
            <ColorPicker
              className=""
              showText
              value={backgroundColor}
              onChangeComplete={handleColorChange}
            >
              /
            </ColorPicker>
            <div className="flex flex-wrap gap-[10px] ">
              {folderIds?.map((folder: any, index: any) => (
                <div
                  key={index}
                  className=" bg-[#fff] shadow-md p-[30px] rounded-[8px] text-center cursor-pointer relative transform hover:scale-105 transition-transform"
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
          <div className="w-[95%]">
            <h1 className="font-[800] Poppins mb-[20px]">Recent files</h1>
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
        <Divider className="bg-[#ffffff] h-[1000px]" type="vertical" />
        <StorageSide />
      </div>
    </>
  );
};

export default Page;
