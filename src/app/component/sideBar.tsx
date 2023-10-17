import {
  DeleteOutlined,
  FileOutlined,
  HomeFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Layout, Modal, message } from "antd";

import Image from "next/image";
import React, { useEffect, useState } from "react";
const { Sider } = Layout;
import { Input } from "antd";
import { useAuthContext } from "../layout";
import { useParams, useRouter } from "next/navigation";
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
import menu from "./data/menu";

const SideBar = () => {
  const { user }: { user: any } = useAuthContext();
  const [eventData, setEventData] = useState<any>(null);
  const [folderIds, setFolderId] = useState<any>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params: any = useParams();
  const [form] = Form.useForm();
  const uid = user?.uid;
  const { folderId } = params;
  const isEditMode = folderId && folderId !== uid;
  const showModal = () => {
    setIsModalOpen(true);
  };
  console.log("folderId", folderId);
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
          const docRef = doc(db, "folder", eventData.folderId);
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
          folderImage: "/images/file_explorer (2).webp",
        };
        const colref = collection(db, "folder");
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
  return (
    <>
      {" "}
      <Sider className="!bg-[#faf9f9]">
        {" "}
        <div className="flex mt-[20px] max-xl:flex-col max-xl:items-center">
          <Image
            src="/images/cloud-data.png"
            width={100}
            height={100}
            alt=""
            className=""
          />
          <div>
            <h1 className="text-center font-[900] text-[24px] flex items-center text-[#275a94]">
              cloud <p className="bg-[#b6dbf0] p-[5px] rounded-[10px]">Store</p>
            </h1>
          </div>
        </div>
        <div className="flex  flex-col justify-center mx-auto w-[80%] mt-[40px] gap-[14px]">
          <Button className="text-center text-[#fff]  flex items-center h-[50px] text-[14px]  bg-[#0d6eaf]">
            Add New File
            <PlusCircleOutlined className="text-[18px]" />
          </Button>

          <Button
            className="text-center text-[#fff] flex  items-center h-[50px] text-[14px]   bg-[#539ecf]"
            onClick={showModal}
          >
            Create Folder
            <PlusCircleOutlined className="text-[18px]" />
          </Button>
          <br></br>
          <br></br>
          <Button className="text-center text-[#fff] flex  items-center h-[50px] text-[14px]   bg-[#0d6eaf]">
            <HomeFilled />
            Home
          </Button>
          <div className="flex  flex-col justify-center mx-auto w-[80%] mt-[40px] gap-[14px]">
            <Modal
              title="Create Folder"
              open={isModalOpen}
              cancelButtonProps={{ style: { display: "none" } }}
              okButtonProps={{ style: { display: "none" } }}
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
                <div className="flex justify-end gap-2">
                  <Button key="cancelButton" onClick={handleCancel}>
                    Cancel
                  </Button>

                  <Button
                    loading={loading}
                    htmlType="submit"
                    key="customButton"
                  >
                    add
                  </Button>
                </div>
              </Form>
            </Modal>

            <div className="demo-logo-vertical" />
          </div>

          <div className="flex gap-6 flex-col">
            {menu.list.map((item, index) => (
              <div
                onClick={() => {
                  router.push("/inner-folder");
                }}
                className="flex gap-4 text-[18px] text-[#707070] cursor-pointer "
                key={index}
              >
                {item.logo}
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </Sider>
    </>
  );
};

export default SideBar;
