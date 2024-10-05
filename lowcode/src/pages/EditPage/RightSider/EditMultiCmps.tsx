import { Button } from "antd";
import Item from "../../../lib/Item";
import {
  cancelGroupCmps,
  editAssemblyStyle,
  groupCmps,
} from "../../../store/editStore";
import styles from "./edit.module.less";

interface IEditMultiCmpProps {
  isGroup: boolean;
}

const EditMultiCmp = ({ isGroup }: IEditMultiCmpProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const align = e.target.value;
    let newStyle: Style = {};
    switch (align) {
      case "left":
        newStyle.left = 0;
        break;
      case "right":
        newStyle.right = 0;
        break;

      case "x-center":
        newStyle.left = "center";
        break;
      case "top":
        newStyle.top = 0;
        break;
      case "bottom":
        newStyle.bottom = 0;
        break;

      case "y-center":
        newStyle.top = "center";
        break;
    }
    editAssemblyStyle(newStyle);
  };

  const toggleSelect = () => {
    if (isGroup) {
      cancelGroupCmps();
    } else {
      groupCmps();
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.title}>批量修改多个组件属性</div>

      <Item label="对齐页面: ">
        <select className={styles.itemRight} onChange={handleChange}>
          <option>选择对齐页面方式--</option>
          <option value="left">左对齐</option>
          <option value="right">右对齐</option>
          <option value="x-center">水平居中</option>
          <option value="top">上对齐</option>
          <option value="bottom">下对齐</option>
          <option value="y-center">垂直居中</option>
        </select>
      </Item>

      <Button
        type="primary"
        style={{ width: "250px", marginLeft: "78px", marginTop: "10px" }}
        onClick={toggleSelect}
      >
        {isGroup ? "取消组合" : "组合"}
      </Button>
    </div>
  );
};

export default EditMultiCmp;
