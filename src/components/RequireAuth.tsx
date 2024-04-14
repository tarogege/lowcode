import { Outlet } from "react-router-dom";
import { Layout, Spin } from "antd";
import Login from "./Login";
import useGlobalStore from "src/store/globalStore";

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 10,
  lineHeight: "64px",
  backgroundColor: "black",
};

const RequireAuth = () => {
  const loading = useGlobalStore((state) => state.loading);
  return (
    <Layout>
      {loading && (
        <div className="loading">
          <Spin size="large" />
        </div>
      )}
      <Header style={headerStyle}>
        <Login />
      </Header>
      <Outlet />
    </Layout>
  );
};

export default RequireAuth;
