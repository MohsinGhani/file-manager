import {
  DeleteOutlined,
  FileOutlined,
  HomeFilled,
  StarOutlined,
} from "@ant-design/icons";

const list = [
  {
    id: 1,
    name: "Home",
    logo: <HomeFilled />,
  },
  {
    id: 2,
    name: "My Files",
    logo: <FileOutlined />,
  },
  {
    id: 3,
    name: "Starred",
    logo: <StarOutlined />,
  },
  {
    id: 4,
    name: "Trash",
    logo: <DeleteOutlined />,
  },
];

export default {
  list,
};
