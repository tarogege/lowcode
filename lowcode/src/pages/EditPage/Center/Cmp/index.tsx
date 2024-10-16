import { memo } from "react";
import {
  getCmpGroupIndex,
  setCmpSelected,
  setCmpsSelected,
} from "../../../../store/editStore";
import { ICmpWithKey } from "../../../../store/editStoreTypes";
import { Button, Img, Input, Text } from "./CmpDetail";
import styles from "./index.module.less";
import classNames from "classnames";
import {
  isFormComponent_Button,
  isFormComponent_Input,
  isImgComponent,
  isTextComponent,
} from "../../../../utils/const";

interface ICmpProps {
  index: number;
  cmp: ICmpWithKey;
  isSelected: boolean;
}
const Cmp = ({ index, cmp, isSelected }: ICmpProps) => {
  const { style } = cmp;

  const { position, left, top, width, height, ...innerStyle } = style;

  const setSelected = (e: any) => {
    e.stopPropagation();
    if (e.metaKey) {
      setCmpsSelected([index]);
    } else {
      const groupIndex = getCmpGroupIndex(index);
      setCmpSelected(groupIndex !== undefined ? groupIndex : index);
    }
  };

  console.log("cmp render");
  const transform = `rotate(${style.transform}deg)`;

  return (
    <div
      className={classNames(styles.main, isSelected && "selectedBorder")}
      style={{
        position,
        left,
        top,
        width,
        height,
        transform,
        zIndex: index,
      }}
      onClick={setSelected}
      id={"cmp" + cmp.key}
    >
      <div className={styles.inner} style={{ ...innerStyle, width, height }}>
        {cmp.type === isTextComponent && <Text value={cmp.value} />}
        {cmp.type === isImgComponent && <Img value={cmp.value} />}
        {cmp.type === isFormComponent_Input && <Input {...cmp} />}
        {cmp.type === isFormComponent_Button && <Button value={cmp.value} />}
      </div>
    </div>
  );
};

export default memo(Cmp);
