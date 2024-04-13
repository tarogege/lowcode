import { useState } from "react";
import styles from "./index.module.less";

const RightSide = () => {
  const [showEdit, setShowEdit] = useState(false);
  const handleToggleShow = () => {
    setShowEdit(!showEdit);
  };
  return (
    <div className={styles.main} onClick={handleToggleShow}>
      <div className={styles.switch}>{showEdit ? "隐藏菜单" : "显示菜单"}</div>
    </div>
  );
};

export default RightSide;
