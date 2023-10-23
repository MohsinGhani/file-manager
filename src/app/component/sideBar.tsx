"use client";
import {
  DeleteOutlined,
  FileOutlined,
  HomeFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Layout, Modal, Upload, message } from "antd";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { useRef } from "react";
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
import { UploadOutlined } from "@ant-design/icons";
const SideBar = () => {
  const { user }: { user: any } = useAuthContext();
  const [eventData, setEventData] = useState<any>(null);
  const [folderIds, setFolderId] = useState<any>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [SHOWisModalOpen, setSHOWisModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params: any = useParams();
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const uid = user?.uid;
  const metadata = {
    contentType: "image/jpeg",
  };
  const { folderId } = params;
  const isEditMode = folderId && folderId !== uid;
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showoPENModal = () => {
    setSHOWisModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancell = () => {
    setSHOWisModalOpen(false);
  };
  const handleEvent = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      const { foldername, fileupload } = form.getFieldsValue();

      if (isEditMode) {
        if (eventData && eventData.folderId) {
          const docRef = doc(db, "folder", eventData.folderId);
          await updateDoc(docRef, {
            foldername: foldername,
            folderId: eventData.folderId,
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
          console.log("eventData", folderData);
        });

        setFolderId(folderData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        message.error(error?.message);
      }
    };

    fetchData();
  }, [user, folderId]);

  const storage = getStorage();
  const { fileupload } = form.getFieldsValue();
  // Create a reference to 'mountains.jpg'
  const mountainsRef: any = ref(storage, "mountains.jpg");
  const eventfileData = {
    fileupload: fileupload,
    folderImage: "/images/file_explorer (2).webp",
  };
  const handleFileUpload = async () => {
    // const storage = getStorage();
    // const mountainImagesRef = ref(storage, "images/mountains.jpg");
    // mountainsRef.name === mountainImagesRef.name; // true
    // mountainsRef.fullPath === mountainImagesRef.fullPath;
    // setFileList(mountainsRef);
    // if (mountainImagesRef) {
    //   const storageRef = ref(
    //     storage,
    //     `your-upload-path/${mountainImagesRef.name}`
    //   );
    //   try {
    //     // uploadBytes(storageRef, fileupload).then((snapshot) => {
    //     //   console.log("Uploaded a blob or file!");
    //     // });
    //   } catch (error) {
    //     console.error("Error uploading file:", error);
    //   }
    // }
  };
  const onFileChange = (info: any) => {
    setFileList(info.fileList);
  };
  return (
    <>
      {" "}
      '{" "}
      <Layout className="min-h-[100vh] contrast-150 ">
        <Sider className=" w-[30%] !bg-[#faf9f9] ">
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
                cloud{" "}
                <p className="bg-[#b6dbf0] p-[5px] rounded-[10px]">Store</p>
              </h1>
            </div>
          </div>
          <div className="flex  flex-col justify-center mx-auto w-[80%] mt-[40px] gap-[14px]">
            <Button
              className="text-center text-[#fff] flex  items-center h-[50px] text-[14px]   bg-[#0d6eaf]"
              id="upload-button"
              onClick={showoPENModal}
            >
              Add New File
            </Button>
            <div className="flex  flex-col justify-center mx-auto w-[80%] mt-[40px] gap-[14px]">
              <Modal
                title="ADD FILE"
                open={SHOWisModalOpen}
                cancelButtonProps={{ style: { display: "none" } }}
                okButtonProps={{ style: { display: "none" } }}
              >
                <Form
                  form={form}
                  onFinish={handleFileUpload}
                  className="w-full"
                  initialValues={
                    isEditMode ? eventfileData : { fileupload: "" }
                  }
                >
                  <Form.Item
                    name="fileupload"
                    valuePropName="fileList"
                    getValueFromEvent={onFileChange}
                    rules={[
                      {
                        required: true,
                        message: "Please ADD FILE UPLOAD",
                      },
                    ]}
                  >
                    <Upload.Dragger
                      name="fileupload"
                      customRequest={() => {}}
                      fileList={fileList}
                      onChange={onFileChange}
                    >
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload.
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                  <div className="flex justify-end gap-2">
                    <Button key="cancelButton" onClick={handleCancell}>
                      Cancel
                    </Button>

                    <Button
                      loading={loading}
                      onClick={handleFileUpload}
                      key="customButton"
                    >
                      add
                    </Button>
                  </div>
                </Form>
              </Modal>

              <div className="demo-logo-vertical" />
            </div>
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
      </Layout>
    </>
  );
};

export default SideBar;
