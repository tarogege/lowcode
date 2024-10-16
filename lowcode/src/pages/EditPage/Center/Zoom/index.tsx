import classNames from "classnames";
import useZoomStore, {
  addReferenceLineX,
  addReferenceLineY,
  clearReferenceLines,
  setZoom,
  zoomIn,
  zoomOut,
} from "../../../../store/zoomStore";
import styles from "./index.module.less";
import { useState } from "react";

const Zoom = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const [showReferenceLine, setShowReferenceLine] = useState(false);
  const changeZoom = (e: any) => {
    setZoom(e.target.value);
  };
  return (
    <div className={styles.main}>
      <ul className={styles.zoom}>
        <li
          className={styles.icon}
          style={{ cursor: "zoom-in" }}
          onClick={zoomIn}
        >
          -
        </li>
        <li className={styles.num}>
          <input type="number" onChange={changeZoom} value={zoom} />%
        </li>
        <li
          className={classNames(styles.icon, styles.iconRight)}
          style={{ cursor: "zoom-out" }}
          onClick={zoomOut}
        >
          +
        </li>
        <li
          className={styles.btn}
          onClick={() => {
            setShowReferenceLine(!showReferenceLine);
          }}
        >
          参考线
        </li>
      </ul>

      {showReferenceLine && (
        <ul
          className={styles.referenceLine}
          onMouseLeave={() => setShowReferenceLine(false)}
        >
          <li onClick={addReferenceLineX}>横向参考线</li>
          <li onClick={addReferenceLineY}>竖向参考线</li>
          <li onClick={clearReferenceLines}>删除参考线</li>
        </ul>
      )}
    </div>
  );
};

export default Zoom;
