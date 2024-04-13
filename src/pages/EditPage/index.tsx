import { Layout } from "antd";
import styles from "./index.module.less";
import LeftSide from "./LeftSide";
import Center from "./Center";
import RightSide from "./RightSide";

const EditPage = () => {
  return (
    <Layout className={styles.main}>
      <div className={styles.content}>
        <LeftSide />
        <Center />
        <RightSide />
      </div>
    </Layout>
  );
};

export default EditPage;
