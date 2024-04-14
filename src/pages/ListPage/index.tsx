import { Button, Card, Divider, Modal, Space, Table, message } from "antd";
import { TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "src/request/axios";
import { deleteCanvasByIdEnd, getCanvasListEnd } from "src/request/end";
import { deleteCanvas } from "src/request/list";
import useUserStore from "src/store/userStore";

interface ListItem {
  id?: number;
  type?: string; //页面或模版
  title?: string;
  content?: string;
}

const ListPage = () => {
  const [list, setList] = useState([]);
  const isLogin = useUserStore((state) => state.isLogin);

  const fresh = async () => {
    if (!isLogin) {
      return;
    }
    const res: any = await Axios.get(getCanvasListEnd);
    let data = res?.content || [];
    setList(data);
  };

  const handleDel = (values: { id: number }) => {
    Modal.confirm({
      title: "删除",
      content: "您确认要删除吗，一旦删除之后将无法恢复",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        await Axios.post(deleteCanvasByIdEnd, values.id);
        message.success("删除成功");
        fresh();
      },
    });
  };

  const editUrl = (item: ListItem) => {
    return `?id=${item.id}&type=${item.type}`;
  };
  const columns: TableProps<ListItem>["columns"] = [
    {
      title: "id",
      dataIndex: "id",
      render: (item: ListItem) => <Link to={editUrl(item)}>{item.id}</Link>,
    },
    {
      title: "标题",
      dataIndex: "title",
      render: (item: ListItem) => <Link to={editUrl(item)}>{item.title}</Link>,
    },
    {
      title: "类型",
      dataIndex: "type",
      render: (item: ListItem) => {
        const label = item.type === "content" ? "页面" : "模版";
        return <div className="red">{label}</div>;
      },
    },
    {
      title: "操作",
      render: (item: ListItem) => {
        return (
          <Space size="middle">
            <a
              target="_blank"
              href={"https://builder-lemon.vercel.app/?id=" + item.id}
            >
              线上查看（切移动端）
            </a>
            <Link to={editUrl(item)}>编辑</Link>
            <Button danger onClick={handleDel({ id })}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    fresh();
  }, []);

  return (
    <Card>
      <Link to="/">新增</Link>
      <Divider />
      <Table columns={columns} dataSource={list} />
    </Card>
  );
};

export default ListPage;
