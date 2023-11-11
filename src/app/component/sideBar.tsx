"use client";
import {
  HomeFilled,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Form,
  Layout,
  List,
  Modal,
  Upload,
  message,
} from "antd";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import Image from "next/image";
import React, { useEffect, useState } from "react";
const { Sider } = Layout;
import { Input } from "antd";
import { useAuthContext } from "../layout";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import menu from "./data/menu";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const SideBar = () => {
  const { user }: { user: any } = useAuthContext();
  const [eventData, setEventData] = useState<any>(null);
  const [folderIds, setFolderId] = useState<any>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [SHOWisModalOpen, setSHOWisModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params: any = useParams();

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
          folderImage: "/images/preview.png",
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
    folderImage: "/images/preview.png",
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
  const handleFileUploads = async (file: any) => {
    try {
      const storage = getStorage();
      const firestore = getFirestore();

      const storageRef = ref(storage, `images.jpeg/${file.name}`);
      await uploadBytes(storageRef, file, metadata);

      const downloadURL = await getDownloadURL(storageRef);

      const collectionRef = doc(firestore, "fileData", "yourDocumentID");
      const eventData = {
        fileupload: downloadURL,
        folderImage: `images.jpeg/${file.name}`,
      };
      await setDoc(collectionRef, eventData);

      console.log("File uploaded and data added to Firestore.", eventData);
    } catch (error) {
      console.error("Error uploading file or adding data to Firestore:", error);
    }
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const handleCancels = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleItemClick = (index: any) => {
    setSelectedItemIndex(index);
  };

  return (
    <>
      <Layout className="min-h-[100vh] contrast-150 ">
        <Sider className=" w-[30%] !bg-[#ffffff] ">
          {" "}
          <div className="flex mt-[20px] max-xl:flex-col max-xl:items-center cursor-pointer">
            <Image
              src="/images/cloud-data.png"
              width={100}
              height={100}
              alt=""
              className="cursor-pointer"
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
                onCancel={handleCancell}
              >
                <Form
                  form={form}
                  onFinish={handleFileUploads}
                  className="w-full"
                  initialValues={
                    isEditMode ? eventfileData : { fileupload: "" }
                  }
                >
                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-circle"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancels}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                  <List
                    dataSource={fileList}
                    renderItem={(item: any) => <div>images</div>}
                  />

                  <div className="flex justify-end gap-2">
                    <Button key="cancelButton" onClick={handleCancell}>
                      Cancel
                    </Button>
                    <Button loading={loading} key="customButton">
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
              {menu.list.map(
                (item, index) => (
                  console.log("item", item, index),
                  (
                    <div
                      onClick={() => handleItemClick(index)}
                      className={`flex gap-4 text-[18px] text-[#707070] cursor-pointer hover:bg-[#1b6bb6] hover:text-[#ffffff] p-[10px] rounded-[10px] ${
                        selectedItemIndex === index
                          ? "bg-[#317cd1] text-white"
                          : ""
                      }`}
                      key={index}
                    >
                      {item.logo}
                      {item.name}
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </Sider>
      </Layout>
    </>
  );
};

export default SideBar;
