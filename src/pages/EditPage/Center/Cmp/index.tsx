import { ICmpWithKey } from "src/store/editStoreType";
import { isImgCmp, isTxtCmp } from "../../LeftSide";
import { Img, Text } from "./CmpDetail";
import styles from "./index.module.less";

interface ICmpProps {
  cmp: ICmpWithKey;
  index: number;
}
const Cmp = (props: ICmpProps) => {
  const { cmp, index } = props;

  return (
    <div className={styles.main} style={{ ...cmp.style, zIndex: index }}>
      {cmp.type === isTxtCmp && <Text {...cmp} />}
      {cmp.type === isImgCmp && <Img {...cmp} />}
    </div>
  );
};

export default Cmp;
