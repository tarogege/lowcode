import { Style } from "src/store/editStoreType";
import styles from "./index.module.less";
import {
  addSelectCmp,
  bottomZIndex,
  deleteAssembly,
  downZIndex,
  topZIndex,
  upZIndex,
} from "src/store/editStore";

interface IMenuProps {
  size: number;
  style: Style;
}

const Menu = ({ size, style }: IMenuProps) => {
  const onDelete = () => {
    deleteAssembly();
  };
  const onCopy = () => {
    addSelectCmp();
  };
  return (
    <div style={style} className={styles.main}>
      <ul className={styles.menu}>
        <li onClick={onCopy}>复制组件</li>
        <li onClick={onDelete}>删除组件</li>
        {size === 1 && (
          <>
            <li onClick={upZIndex}>上移一层</li>
            <li onClick={downZIndex}>下移一层</li>
            <li onClick={topZIndex}>置顶</li>
            <li onClick={bottomZIndex}>置底</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Menu;
