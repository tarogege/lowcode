import { ICmpWithKey } from "src/store/editStoreType";
import { Img, Text } from "./CmpDetail";
import styles from "./index.module.less";
import { setCmpSelected, setCmpsSelected } from "src/store/editStore";
import classNames from "classnames";
import { isImgCmp, isTxtCmp } from "src/utils/const";
interface ICmpProps {
  cmp: ICmpWithKey;
  index: number;
  isSelected: boolean;
}
const Cmp = (props: ICmpProps) => {
  const { cmp, index, isSelected } = props;

  const { position, top, left, width, height, ...innerStyle } = cmp.style;
  const outStyle = { position, top, left, width, height };

  const selectCmp = (e) => {
    if (e.metaKey) {
      setCmpsSelected([index]);
    } else {
      setCmpSelected(index);
    }
  };

  const transform = `rotate(${cmp.style.transform}deg)`;

  return (
    <div
      className={classNames(styles.main, isSelected && "selectedBorder")}
      style={{ ...outStyle, transform, zIndex: index }}
      onClick={selectCmp}
      contentEditable={false}
    >
      <div className={styles.inner} style={{ ...innerStyle, zIndex: index }}>
        {cmp.type === isTxtCmp && <Text {...cmp} />}
        {cmp.type === isImgCmp && <Img {...cmp} />}
      </div>
    </div>
  );
};

export default Cmp;
