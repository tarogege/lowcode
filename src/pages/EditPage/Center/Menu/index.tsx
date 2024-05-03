import { ICmpWithKey, Style } from "src/store/editStoreType";
import styles from "./index.module.less";
import useEditStore, {
  addSelectCmp,
  bottomZIndex,
  deleteAssembly,
  downZIndex,
  topZIndex,
  upZIndex,
} from "src/store/editStore";
import Item from "./Item";

interface IMenuProps {
  size: number;
  style: Style;
}

const Menu = ({ size, style }: IMenuProps) => {
  const [cmps, assembly] = useEditStore((state) => [
    state.canvas.content.cmps,
    state.assembly,
  ]);
  const selectedIdx = Array.from(assembly)[0];
  const onDelete = () => {
    deleteAssembly();
  };
  const onCopy = () => {
    addSelectCmp();
  };
  const overlap = (cmp: ICmpWithKey) => {
    const selectedCmp = cmps[selectedIdx];
    const selectedCmpStyle = {
      top: selectedCmp.style.top,
      left: selectedCmp.style.left,
      right: selectedCmp.style.left + selectedCmp.style.width,
      bottom: selectedCmp.style.top + selectedCmp.style.height,
    };

    const outerCmpStyle = {
      top: cmp.style.top,
      left: cmp.style.left,
      right: cmp.style.left + cmp.style.width,
      bottom: cmp.style.top + cmp.style.height,
    };

    if (
      outerCmpStyle.bottom < selectedCmpStyle.top ||
      outerCmpStyle.right < selectedCmpStyle.left ||
      outerCmpStyle.top > selectedCmpStyle.bottom ||
      outerCmpStyle.left > selectedCmpStyle.right
    ) {
      return false;
    } else {
      return true;
    }
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
            <li>附近组件</li>
          </>
        )}
      </ul>
      {size === 1 && (
        <ul className={styles.nearByCmps}>
          {cmps.map((cmp, idx) => {
            if (idx !== selectedIdx && overlap(cmp)) {
              return <Item cmp={cmp} index={idx} />;
            }
          })}
        </ul>
      )}
    </div>
  );
};

export default Menu;
