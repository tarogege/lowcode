import Center from "./Center";
import Header from "./Header";
import LeftSider from "./LeftSider";
import RightSider from "./RightSider";
import styles from "./index.module.less";

const EditPage = () => {
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.content}>
        <LeftSider />
        <Center />
        <RightSider />
      </div>
    </div>
  );
};

export default EditPage;
