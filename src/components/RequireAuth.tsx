import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Login from "./Login";

const { Header } = Layout;

const RequireAuth = () => {
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 10,
    lineHeight: "64px",
    backgroundColor: "black",
  };
  return (
    <Layout>
      <Header style={headerStyle}>
        <Login />
      </Header>
      <Outlet />
    </Layout>
  );
};

export default RequireAuth;
