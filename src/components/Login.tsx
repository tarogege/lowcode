import { Button, Checkbox, Form, FormProps, Input, Modal } from "antd";
import { register } from "src/request/register";
import { login, logout } from "src/request/user";
import docCookies from "src/utils/cookies";

type FieldType = {
  username?: string;
  password?: string;
  register_login?: string;
};

const Login = () => {
  // 校验登录
  const auth = docCookies.getItem("sessionId");
  const name = docCookies.getItem("name");

  const handleOk = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout(handleOk);
  };
  if (auth) {
    return (
      <Button onClick={handleLogout} style={{ float: "right", marginTop: 16 }}>
        {name} 退出登录
      </Button>
    );
  }

  const registerAndLogin = (values: { name: string; password: string }) => {
    register(values, () => {
      login(values, () => {
        handleOk();
      });
    });
  };

  const onFinish = ({
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
      login({ name: username, password }, () => {
        handleOk();
      });
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
