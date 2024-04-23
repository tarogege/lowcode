import { Layout } from "antd";
import styles from "./index.module.less";
import LeftSide from "./LeftSide";
import Center from "./Center";
import RightSide from "./RightSide";
import Header from "./Header";

const EditPage = () => {
  return (
    <Layout className={styles.main}>
      <Header />
      <div className={styles.content}>
        <LeftSide />
        <Center />
        <RightSide />
      </div>
    </Layout>
  );
};

export default EditPage;
