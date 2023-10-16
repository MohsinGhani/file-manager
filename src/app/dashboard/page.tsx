"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Form, Modal, Progress, Tooltip, message } from "antd";

import { PlusCircleOutlined, HomeFilled } from "@ant-design/icons";
import { Table } from "antd";

import {
  SearchOutlined,
  DeleteOutlined,
  FileOutlined,
  StarOutlined,
} from "@ant-design/icons";

import { Layout } from "antd";
const { Sider } = Layout;
import { Input, Menu } from "antd";
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
  {
    key: "6",
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

  const [loading, setLoading] = useState(false);
  const params: any = useParams();
  const [form] = Form.useForm();
  const uid = user?.uid;
  const { folderId } = params;
  const router = useRouter();
  const isEditMode = folderId && folderId !== uid;
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleEvent = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      const { foldername } = form.getFieldsValue();

      if (isEditMode) {
        if (eventData && eventData.folderId) {
          const docRef = doc(db, "BTB_Events", eventData.folderId);
          await updateDoc(docRef, {
            foldername: foldername,
          });
          message.success(`Folder updated successfully`);
        } else {
          message.error(`Folder data is incomplete for editing`);
        }
      } else {
        const eventData = {
          foldername: foldername,
          folderImage: "/images/cloud-data.png",
        };
        const colref = collection(db, "BTB_Events");
        const docRef = await addDoc(colref, eventData);
        message.success(`Folder created successfully`);
        setEventData({ folderId: docRef.id, ...eventData });
      }
    } catch (error: any) {
      console.error("Error:", error);
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (folder: any) => {
    try {
      const docRef = doc(db, "BTB_Events", folder.folderId);
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
        const q = query(collection(db, "BTB_Events"));
        const querySnapshot = await getDocs(q);
        const folderData: any = [];

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          folderData.push({ folderId: doc.id, ...docData });
        });

        setFolderId(folderData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        message.error(error?.message);
      }
    };

    fetchData();
  }, [folderId]);
  return (
    <>
      <div className="flex   bg-[#c4c4c4] ">
        <Layout className="min-h-[100vh] ">
          <Sider className="!bg-[#faf9f9] ">
            {" "}
            <div className="flex mt-[20px] max-xl:flex-col max-xl:items-center">
              <Image
                src="/images/cloud-data.png"
                width={100}
                height={100}
                alt=""
              />
              <div>
                <h1 className="text-center font-[900] text-[24px] flex items-center text-[#275a94]">
                  cloud{" "}
                  <p className="bg-[#b6dbf0] p-[5px] rounded-[10px]">Store</p>
                </h1>
              </div>
            </div>
            <div className="flex  flex-col justify-center mx-auto w-[80%] mt-[40px] gap-[14px]">
              <Button className="text-center text-[#fff]  flex items-center h-[50px] text-[14px]  bg-[#0d6eaf]">
                Add New File
                <PlusCircleOutlined className="text-[18px]" />
              </Button>

              <Button
                className="text-center text-[#fff] flex items-center h-[50px] text-[14px] bg-[#539ecf]"
                onClick={showModal}
              >
                Create Folder
                <PlusCircleOutlined className="text-[18px]" />
              </Button>
              <Modal
                title="Basic Modal"
                open={isModalOpen}
                onCancel={handleCancel}
                okButtonProps={{ style: { display: "none" } }}
                footer={[
                  <Button key="cancelButton" onClick={handleCancel}>
                    Cancel
                  </Button>,
                  <Button key="customButton">add</Button>,
                ]}
              >
                <Form
                  form={form}
                  onFinish={handleEvent}
                  className="w-full"
                  initialValues={isEditMode ? eventData : { foldername: "" }}
                >
                  <Form.Item
                    name="foldername"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a folder name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter folder name" />
                  </Form.Item>
                  <Button
                    loading={loading}
                    htmlType="submit"
                    className="rounded-[10px] bg-[#165188] max-w-[370px] w-full h-[50px] login text-white text-[18px] font-[500] font-poppins"
                  >
                    Save
                  </Button>
                </Form>
              </Modal>
              <br></br>
              <br></br>
              <Button className="text-center text-[#fff] flex  items-center h-[50px] text-[14px]   bg-[#0d6eaf]">
                <HomeFilled />
                Home
              </Button>

              <div className="demo-logo-vertical" />
            </div>
            <Menu
              className="bg-[#faf9f9] flex flex-col  items-center justify-center mt-[40px] text-[16px] font-[500] font-poppins text-[#8591A3]"
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
              {folderIds?.map(
                (folder: any, index: any) => (
                  console.log("folder", folder),
                  (
                    <div
                      key={index}
                      className="border border-1px p-[30px] rounded-[8px] text-center cursor-pointer"
                    >
                      <Image
                        src={folder?.folderImage}
                        width={100}
                        height={100}
                        alt=""
                      />
                      <h1>{folder?.foldername}</h1>
                      <Button
                        onClick={() => {
                          handleDelete(folder);
                        }}
                      >
                        delete
                      </Button>
                    </div>
                  )
                )
              )}
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
              <h1 className="font-[700] text-[20px] text-left">Sarib Ghouri</h1>
              <h1 className="font-[500] text-[#b3b0b0] ">
                sarib.ghouri92@gmail.com
              </h1>
            </div>
          </div>
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
            <div className="flex justify-between p-[10px] mt-[20px]">
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
            <hr></hr>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
