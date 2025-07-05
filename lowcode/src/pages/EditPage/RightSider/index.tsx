import { useState } from "react";
import styles from "./index.module.less";
import useEditStore from "../../../store/editStore";
import EditCanvas from "./EditCanvas";
import EditCmp from "./EditCmp";
import EditMultiCmp from "./EditMultiCmps";
import { isGroupComponent } from "../../../utils/const";

const RightSider = () => {
  const [assembly, canvas] = useEditStore((state) => [
    state.assembly,
    state.canvas,
  ]);
  const size = assembly.size;
  const [showEdit, setShowEdit] = useState(true);

  //   判断是否是组合组件
  const isGroup =
    size === 1
      ? !!(canvas.content.cmps[Array.from(assembly)[0]].type & isGroupComponent)
      : false;

  return (
    <div className={styles.main}>
      <div className={styles.switch} onClick={() => setShowEdit(!showEdit)}>
        {showEdit ? "隐藏编辑区域" : "显示编辑区域"}
      </div>

      {showEdit &&
        (size === 0 ? (
          <EditCanvas canvas={canvas} />
        ) : size === 1 && !isGroup ? (
          <EditCmp
            selectedCmp={canvas.content.cmps[Array.from(assembly)[0]]}
            formKeys={canvas.content.formKeys as string[]}
          />
        ) : (
          <EditMultiCmp isGroup={isGroup} />
        ))}
    </div>
  );
};

export default RightSider;
