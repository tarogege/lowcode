import useUserStore, { login, logout, fetchUserInfo } from "../store/userStore";
import { Modal, Form, Input, Button, Checkbox } from "antd";
import Axios from "../request/axios";
import { registerEnd } from "../request/end";
import { useEffect } from "react";
import useGlobalStore from "../store/globalStore";

const Login = () => {
  const { isLogin, name } = useUserStore();
  const loading = useGlobalStore((state) => state.loading);

  console.log(isLogin, name, "uuuu");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return;
  }

  if (isLogin) {
    return (
      <div style={{ float: "right" }} onClick={() => logout()}>
        {name}退出登录
      </div>
    );
  }

  const onFinish = async ({
    name,
    password,
    register_login,
  }: {
    name: string;
    password: string;
    register_login: boolean;
  }) => {
    if (register_login) {
      await registerAndLogin({ name, password });
    } else {
      await login({ name, password });
    }
  };
  const onFinishFailed = () => {};

  const registerAndLogin = async (values: {
    name: string;
    password: string;
  }) => {
    await Axios.post(registerEnd, values);
    await login(values);
  };

  return (
    <Modal title="登录与注册" open={true} closable={false} footer={[]}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        preserve={false}
      >
        <Form.Item
          label="用户名"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="register_login"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>注册并登录</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
