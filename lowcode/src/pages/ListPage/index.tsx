import { Button, Card, Divider, Modal, Space, Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "../../request/axios";
import {
  deleteCanvasByIdEnd,
  getCanvasListEnd,
  publishEnd,
  saveCanvasEnd,
  unpublishEnd,
} from "../../request/end";
import useUserStore from "../../store/userStore";

interface ListItem {
  id: number;
  title: string;
  type: string;
  content: string;
  publish: boolean;
}

const ListPage = () => {
  const isLogin = useUserStore((state) => state.isLogin);
  const [list, setList] = useState([]);
  const editUrl = (item: ListItem) => `/?id=${item.id}&type=${item.type}`;

  const fresh = useCallback(async () => {
    if (!isLogin) {
      return;
    }
    const res: any = await Axios.get(getCanvasListEnd);
    const data = res.data || [];

    setList(data);
  }, [isLogin]);
  const delConfirm = (id: number) => {
    Modal.confirm({
      title: "删除",
      content: "确认是否删除画布",
      onOk: async () => {
        await Axios.post(deleteCanvasByIdEnd, { id });
        message.success("删除成功");
        fresh();
      },
    });
  };
  const copyCanvas = async (item: ListItem) => {
    await Axios.post(saveCanvasEnd, {
      id: null,
      type: item.type,
      title: item.title + "副本",
      content: item.content,
    });

    message.success("复制成功");
    fresh();
  };
  const saveAsTpl = async (item: ListItem) => {
    await Axios.post(saveCanvasEnd, {
      id: item.id,
      type: "template",
      title: item.title + "模版",
      content: item.content,
    });

    message.success("改为模版成功");
    fresh();
  };

  const publish = async (id: number) => {
    const res = await Axios.post(publishEnd, {
      id,
    });
    if (res) {
      message.success("发布成功");
      fresh();
    }
  };
  const unpublish = async (id: number) => {
    const res = await Axios.post(unpublishEnd, {
      id,
    });
    if (res) {
      message.success("下架成功");
      fresh();
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: number, item: ListItem) => {
        return <Link to={editUrl(item)}>{id}</Link>;
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      render: (title: string, item: ListItem) => {
        return <Link to={editUrl(item)}>{title || "未命名"}</Link>;
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      render: (type: string) => {
        const typeDesc = type === "content" ? "页面" : "模板页";
        return <div className="red">{typeDesc}</div>;
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_: any, item: ListItem) => {
        const { id } = item;
        return (
          <Space size="middle">
            {item.publish ? (
              <>
                <a
                  target="_blank"
                  href={"http://ssgbuilder.dearmaomao.cn/?id=" + id}
                >
                  线上查看（切移动端）
                </a>
                <Button onClick={() => unpublish(id)}>下架</Button>
              </>
            ) : (
              <>
                <a
                  target="_blank"
                  href={"http://ssgbuilder.dearmaomao.cn/?id=" + id + "&preview"}
                >
                  线下查看（切移动端）
                </a>
                <Button onClick={() => publish(id)}>发布</Button>
              </>
            )}

            <Link to={editUrl(item)}>编辑</Link>
            <Button onClick={() => copyCanvas(item)}>复制</Button>
            {item.type === "content" && (
              <Button onClick={() => saveAsTpl(item)}>保存为模版</Button>
            )}
            <Button onClick={() => delConfirm(id)}>删除</Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    fresh();
  }, [fresh]);

  return (
    <Card>
      <Link to={"/"}>新增</Link>
      <Divider />
      <Table columns={columns} dataSource={list} />
    </Card>
  );
};

export default ListPage;
