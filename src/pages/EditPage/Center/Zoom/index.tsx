import useZoomStore, {
  addReferenceLineX,
  addReferenceLineY,
  clearReferenceLines,
  setZoom,
  zoomIn,
  zoomOut,
} from "src/store/zoomStore";
import styles from "./index.module.less";
import { useState } from "react";

const Zoom = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const [showReference, setShowReference] = useState(false);

  const zoomChange = (e) => {
    setZoom(e.target.value);
  };

  const minus = () => {
    zoomOut();
  };

  const add = () => {
    zoomIn();
  };
  return (
    <div className={styles.main}>
      <ul className={styles.zoom}>
        <li
          className={styles.icon}
          style={{ cursor: "zoom-out" }}
          onClick={minus}
        >
          -
        </li>
        <li className={styles.num}>
          <input type={"num"} value={zoom} onChange={zoomChange} />%
        </li>
        <li className={styles.icon} style={{ cursor: "zoom-in" }} onClick={add}>
          +
        </li>
        <li
          onClick={() => {
            setShowReference(!showReference);
          }}
        >
          参考线
        </li>
      </ul>
      {showReference && (
        <ul className={styles.referenceLines}>
          <li
            onClick={() => {
              addReferenceLineX();
              setShowReference(!showReference);
            }}
          >
            横向参考线
          </li>
          <li
            onClick={() => {
              addReferenceLineY();
              setShowReference(!showReference);
            }}
          >
            竖向参考线
          </li>
          <li
            onClick={() => {
              clearReferenceLines();
              setShowReference(!showReference);
            }}
          >
            删除参考线
          </li>
        </ul>
      )}
    </div>
  );
};

export default Zoom;
