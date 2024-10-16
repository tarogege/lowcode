import classNames from "classnames";
import {
  addAssemblyCmps,
  addZIndex,
  bottomZIndex,
  deleteSelectedCmps,
  setCmpSelected,
  subZIndex,
  topZIndex,
} from "../../../../store/editStore";
import { ICmpWithKey, Style } from "../../../../store/editStoreTypes";
import styles from "./index.module.less";
import { pick } from "lodash";
import {
  isGraphComponent,
  isGroupComponent,
  isImgComponent,
} from "../../../../utils/const";

interface IMenuProps {
  style: Style;
  assemblySize: number;
  cmps: Array<ICmpWithKey>;
  selectedIndex: number;
}
const Menu = ({ style, assemblySize, cmps, selectedIndex }: IMenuProps) => {
  const selectedCmp = cmps[selectedIndex];

  // 判断选中组件与其他组件是否有重叠
  const overlap = (cmp: ICmpWithKey): boolean => {
    const selectedCmpStyle = {
      top: selectedCmp.style.top,
      right:
        (selectedCmp.style.left as number) +
        (selectedCmp.style.width as number),
      bottom:
        (selectedCmp.style.top as number) +
        (selectedCmp.style.height as number),
      left: selectedCmp.style.left,
    };
    const cmpStyle = {
      left: cmp.style.left,
      right: (cmp.style.left as number) + (cmp.style.width as number),
      bottom: (cmp.style.top as number) + (cmp.style.height as number),
      top: cmp.style.top,
    };

    return !(
      cmpStyle.right < (selectedCmpStyle.left as number) ||
      (cmpStyle.top as number) > (selectedCmpStyle.bottom as number) ||
      (cmpStyle.left as number) > (selectedCmpStyle.right as number) ||
      cmpStyle.bottom < (selectedCmpStyle.top as number)
    );
  };

  return (
    <div className={styles.main} style={style}>
      <ul className={styles.menu}>
        <li onClick={addAssemblyCmps}>复制组件</li>
        <li onClick={deleteSelectedCmps}>删除组件</li>
        {assemblySize === 1 && (
          <>
            {selectedCmp.type & isGroupComponent && (
              <>
                <li onClick={addZIndex}>上移一层</li>
                <li onClick={subZIndex}>下移一层</li>
              </>
            )}
            <li onClick={topZIndex}>置顶</li>
            <li onClick={bottomZIndex}>置底</li>
            <li>附近组件</li>
          </>
        )}
      </ul>
      {assemblySize === 1 && (
        <ul className={styles.nearByCmps}>
          {cmps.map((cmp, idx) =>
            idx !== selectedIndex && overlap(cmp) ? (
              <Item key={cmp.key} cmp={cmp} index={idx} />
            ) : null
          )}
        </ul>
      )}
    </div>
  );
};

interface IItemProps {
  cmp: ICmpWithKey;
  index: number;
}

function Item({ cmp, index }: IItemProps) {
  const { type, value } = cmp;
  let left, right;

  switch (type) {
    case isImgComponent:
      left = <img className={styles.left} src={value} alt="" />;
      right = "图片";
      break;

    case isGraphComponent:
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

    case isGroupComponent:
      left = (
        <span className={classNames(styles.left, "iconfont icon-zuhe")}></span>
      );
      right = "组合组件";
      break;

    // case isTextComponent:
    default:
      left = (
        <span
          className={classNames(styles.left, "iconfont icon-wenben")}
        ></span>
      );
      right = value;
      break;
  }

  return (
    <li onClick={() => setCmpSelected(index)}>
      {left}
      <span className={styles.txt}>{right}</span>
    </li>
  );
}

export default Menu;
