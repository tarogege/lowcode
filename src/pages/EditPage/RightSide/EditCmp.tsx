import Item from "src/lib/Item";
import styles from "./edit.module.less";
import { ICmpWithKey, Style } from "src/store/editStoreType";
import {
  editAssembleCmpAlign,
  updateSelectedCmpAttr,
} from "src/store/editStore";

import EditCmpStyle from "./EditCmpStyle";

const EditCmp = ({ cmp }: { cmp: ICmpWithKey }) => {
  const { value, style, type, onClick } = cmp;
  // const updateStyle = (e, _pair: Pair | Array<Pair>) => {
  //   const pair: Array<Pair> = Array.isArray(_pair) ? _pair : [_pair];
  //   const newStyle: any = {};
  //   pair.forEach((_item) => {
  //     newStyle[_item.name] = _item.value;
  //   });
  //   updateSelectedCmpStyle(newStyle);
  // };
  // const handleAnimationStyleChange = (e, { value }: Pair) => {
  //   console.log("1231231");
  //   const newStyle: Style = {
  //     animationName: value as string,
  //     animationDuration: style.animationDuration || "1s",
  //     animationDelay: style.animationDelay || "0",
  //     animationPlayState: "running",
  //     animationIterationCount: style.animationIterationCount || "infinite",
  //   };
  //   updateSelectedCmpStyle(newStyle);
  // };

  const handleAttributesChange = (obj) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      updateSelectedCmpAttr(key, value);
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.title}>组件属性</div>
      <Item label="对齐页面">
        <select
          className={styles.itemRight}
          onChange={(e) => {
            const align = e.target.value;
            let newStyle: Style = {};
            switch (align) {
              case "left":
                newStyle.left = 0;
                break;
              case "right":
                newStyle.right = 0;
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
              case "x-center":
                newStyle.left = "center";
            }
            editAssembleCmpAlign(newStyle);
          }}
        >
          <option>请选择对齐页面--</option>
          <option value="left">左对齐</option>
          <option value="right">右对齐</option>
          <option value="y-center">垂直居中</option>
          <option value="top">上对齐</option>
          <option value="bottom">下对齐</option>
          <option value="x-center">水平居中</option>
        </select>
      </Item>
      <EditCmpStyle
        value={value}
        styleName="style"
        styleValue={style}
        onClick={onClick}
        handleAttributesChange={handleAttributesChange}
      />
    </div>
  );
};

export default EditCmp;
