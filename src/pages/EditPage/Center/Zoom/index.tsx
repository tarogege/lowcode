import useZoomStore, { setZoom, zoomIn, zoomOut } from "src/store/zoomStore";
import styles from "./index.module.less";

const Zoom = () => {
  const zoom = useZoomStore((state) => state.zoom);

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
    </ul>
  );
};

export default Zoom;
