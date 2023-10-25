"use client";
import { HomeFilled, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Layout,
  Modal,
  Upload,
  UploadProps,
  message,
} from "antd";
import { getStorage, ref, uploadBytes, uploadString } from "firebase/storage";

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
  getFirestore,
  query,
  setDoc,
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
  const [fileURL, setFileURL] = useState(""); // State to store the file URL after upload

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
  const { fileupload } = form.getFieldsValue();

  const eventfileData = {
    fileupload: fileupload,
    folderImage: "/images/file_explorer (2).webp",
  };
  // const handleFileUpload = async () => {
  //   try {
  //     const storageRef = getStorage();
  //     const fileRef = ref(storageRef, " /images/file_explorer (2).webp");
  //     console.log("fileRef", fileRef);
  //     const uploadTask = ref(storageRef, " /images/file_explorer (2).webp");
  //     console.log("uploadTask", uploadTask);
  //     fileRef.name === uploadTask.name; // true
  //     fileRef.fullPath === uploadTask.fullPath;

  //     const message = "This is my message.";
  //     uploadString(fileRef, message).then((snapshot) => {
  //       console.log("Uploaded a raw string!");
  //     });
  //     const uploadTasks = uploadBytes(uploadTask, fileRef, metadata);
  //     console.log("uploadTasks", uploadTasks);
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error uploading file: ", error);
  //   }
  // };

  const handleFileUpload = async () => {
    try {
      const storageRef = getStorage();
      const fileRef = ref(storageRef, " /images/file_explorer (2).webp");
      console.log("fileRef", fileRef);
      const uploadTask = ref(storageRef, " /images/file_explorer (2).webp");
      console.log("uploadTask", uploadTask);
      fileRef.name === uploadTask.name; // true
      fileRef.fullPath === uploadTask.fullPath;

      const message = "This is my message.";
      uploadString(fileRef, message).then((snapshot) => {
        console.log("Uploaded a raw string!");
      });
      const uploadTasks = uploadBytes(uploadTask, fileRef, metadata);
      console.log("uploadTasks", uploadTasks);
      const db = getFirestore();
      const collectionRef = doc(db, "fileData");
      console.log("collectionRef", collectionRef);
      const eventData = {
        fileupload: fileupload,
        folderImage: "/images/file_explorer (2).webp",
      };

      await setDoc(collectionRef, eventData);

      console.log("File uploaded and data added to Firestore.");
    } catch (error) {
      console.error(
        "Error uploading file or adding data to Firestore: ",
        error
      );
    }
  };
  const onFileChange = (info: any) => {
    setFileList(info.fileList);
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
    handleFileUpload();
    fetchData();
  }, [user, folderId]);
  const props: UploadProps = {
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange({ file, fileList }) {
      if (file.status !== "uploading") {
        console.log(fileList);
      }
    },
    defaultFileList: [
      {
        uid: "1",
        name: "xxx.png",
        status: "uploading",
        percent: 33,
      },
      {
        uid: "2",
        name: "yyy.png",
        status: "done",
        url: "https://www.seiu1000.org/post/image-dimensions",
      },
      {
        uid: "3",
        name: "zzz.png",
        status: "error",
        response: "Server Error 500",
        url: "file_explorer (2).webp",
      },
    ],
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
              className="text-center text-[#fff] flex items-center h-[50px] text-[14px] bg-[#0d6eaf]"
              id="upload-button"
              onClick={showoPENModal}
            >
              Add New File
            </Button>
            <div className="flex flex-col justify-center mx-auto w-[80%] mt-[40px] gap-[14px]">
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
                  <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>

                  <div className="flex justify-end gap-2">
                    <Button key="cancelButton" onClick={handleCancell}>
                      Cancel
                    </Button>
                    <Button
                      loading={loading}
                      onClick={onFileChange}
                      key="customButton"
                    >
                      add
                    </Button>
                  </div>
                </Form>
              </Modal>
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
