import { Button, Card, Divider, Modal, Space, Table, message } from "antd";
import { TableProps } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "src/request/axios";
import {
  deleteCanvasByIdEnd,
  getCanvasListEnd,
  saveCanvasEnd,
} from "src/request/end";
import { ICmpWithKey } from "src/store/editStoreType";
import useUserStore from "src/store/userStore";

interface ListItem {
  id?: number;
  type?: string; //页面或模版
  title?: string;
  content?: string;
  [key: string]: any;
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

  const handleDel = (id: number) => {
    Modal.confirm({
      title: "删除",
      content: "您确认要删除吗，一旦删除之后将无法恢复",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        await Axios.post(deleteCanvasByIdEnd, { id });
        message.success("删除成功");
        fresh();
      },
    });
  };

  const editUrl = (item: ListItem) => {
    return `/edit?id=${item.id}&type=${item.type}`;
  };

  const onCopy = async (item: ListItem) => {
    const res: any = Axios.post(saveCanvasEnd, {
      id: null,
      type: item.type,
      title: item.title,
      content: item.content,
    });
    if (res) {
      message.success("复制成功");
      fresh();
    }
  };
  const onSaveTpl = async (item: ListItem) => {
    const res = await Axios.post(saveCanvasEnd, {
      id: null,
      type: "template",
      title: item.title + "模版",
      content: item.content,
    });
    if (res) {
      message.success("保存成功");
      fresh();
    }
  };

  const columns: TableProps<ListItem>["columns"] = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (txt, item: ListItem) => (
        <Link to={editUrl(item)}>{item.id}</Link>
      ),
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      render: (txt, item: ListItem) => (
        <Link to={editUrl(item)}>{item.title}</Link>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (txt, item: ListItem) => {
        const label = item.type === "content" ? "页面" : "模版";
        return <div className="red">{label}</div>;
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (txt, item: ListItem) => {
        return (
          <Space size="middle">
            <a
              target="_blank"
              href={"http://builder.codebus.tech/?id=" + item.id}
            >
              线上查看（切移动端）
            </a>
            <Link to={editUrl(item)}>编辑</Link>
            <Button onClick={() => onCopy(item)}>复制</Button>
            {item.type === "content" && (
              <Button onClick={() => onSaveTpl(item)}>保存为模版</Button>
            )}
            <Button danger onClick={() => handleDel(item.id)}>
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    fresh();
  }, [isLogin]);

  return (
    <Card>
      <Link to="/edit">新增</Link>
      <Divider />
      <Table columns={columns} dataSource={list} />
    </Card>
  );
};

export default ListPage;
