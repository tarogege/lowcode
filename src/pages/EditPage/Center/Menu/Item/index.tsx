import { pick } from "lodash";
import { isGraphyCmp, isImgCmp } from "src/pages/EditPage/LeftSide";
import { ICmpWithKey } from "src/store/editStoreType";
import styles from "../index.module.less";
import { setCmpSelected } from "src/store/editStore";
import classNames from "classnames";

interface IItemProps {
  cmp: ICmpWithKey;
  index: number;
}
const Item = ({ cmp, index }: IItemProps) => {
  const { type, value } = cmp;
  let left, right;
  switch (type) {
    case isImgCmp:
      left = <img src={value} className={styles.left}></img>;
      right = "图片";
      break;
    case isGraphyCmp:
      left = (
        <span
          className={styles.left}
          style={pick(cmp.style, [
            "backgroundColor",
            "borderWidth",
            "borderStyle",
            "borderColor",
            "borderRadius",
          ])}
        ></span>
      );
      right = "图形";
      break;
    default:
      left = (
        <span
          className={classNames(styles.left, "iconfont icon-wenben")}
        ></span>
      );
      right = value;
      break;
  }

  const selectNearbyCmp = () => {
    setCmpSelected(index);
  };
  return (
    <li onClick={selectNearbyCmp}>
      {left}
      <span>{right}</span>
    </li>
  );
};

export default Item;
