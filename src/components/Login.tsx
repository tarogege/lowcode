import { Button, Checkbox, Form, FormProps, Input, Modal } from "antd";
import { useEffect } from "react";
import Axios from "src/request/axios";
import { registerEnd } from "src/request/end";
import useGlobalStore from "src/store/globalStore";
import useUserStore, {
  fetchUserInfo,
  login,
  logout,
} from "src/store/userStore";

type FieldType = {
  username?: string;
  password?: string;
  register_login?: string;
};

const Login = () => {
  // 校验登录
  const { isLogin, name } = useUserStore();
  const isLoading = useGlobalStore((state) => state.loading);

  //   useEffect(() => {
  //     fetchUserInfo();
  //   }, []);

  if (isLoading) {
    return;
  }

  // if (isLogin) {
  return (
    <Button onClick={logout} style={{ float: "right", marginTop: 16 }}>
      {name} 退出登录
    </Button>
  );
  // }

  const registerAndLogin = async (values: {
    name: string;
    password: string;
  }) => {
    const res = await Axios.post(registerEnd, values);
    if (res) {
      await login(values);
    }
  };

  const onFinish = async ({
    username,
    password,
    register_login,
  }: {
    username: string;
    password: string;
    register_login: string;
  }) => {
    if (register_login) {
      registerAndLogin({ name: username, password });
    } else {
      await login({ name: username, password });
    }
  };
  const onFinishFail: FormProps<FieldType>["onFinishFailed"] = () => {};
  return (
    <Modal title="注册与登录" open={true} footer={[]} closable={false}>
      <p className="red">登录之后才可使用~</p>
      <Form
        name={"login"}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFail}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "Please input your name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please input your password" }]}
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
