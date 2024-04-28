import { useState } from "react";
import styles from "./index.module.less";
import useEditStore from "src/store/editStore";
import EditCanvas from "./EditCanvas";
import EditCmp from "./EditCmp";
import EditMultiCmps from "./EditMultiCmps";

const RightSide = () => {
  const [canvas, assembly] = useEditStore((state) => [
    state.canvas,
    state.assembly,
  ]);
  const [showEdit, setShowEdit] = useState(false);

  const handleToggleShow = () => {
    setShowEdit(!showEdit);
  };

  return (
    <div className={styles.main}>
      <div className={styles.switch} onClick={handleToggleShow}>
        {showEdit ? "隐藏菜单" : "显示菜单"}
      </div>
      {showEdit &&
        (assembly.size === 0 ? (
          <EditCanvas canvas={canvas} />
        ) : assembly.size === 1 ? (
          <EditCmp cmp={canvas.cmps[Array.from(assembly)[0]]} />
        ) : (
          <EditMultiCmps />
        ))}
    </div>
  );
};

export default RightSide;
