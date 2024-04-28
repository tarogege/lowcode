import useEditStore, { setAllCmpsSelected } from "src/store/editStore";
import Canvas from "./Canvas";
import styles from "./index.module.less";
import { useEffect } from "react";
import Zoom from "./Zoom";
import useZoomStore, { zoomIn, zoomOut } from "src/store/zoomStore";

const Center = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const canvas = useEditStore((state) => state.canvas);
  const selectAllCmps = (e) => {
    if (e.target.nodeName === "TEXTAREA") {
      return;
    }
    if (e.metaKey) {
      if (e.code === "KeyA") {
        setAllCmpsSelected();
      } else if (e.code === "Equal") {
        zoomIn();
      } else if (e.code === "Minus") {
        zoomOut();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", selectAllCmps);
    return () => {
      document.removeEventListener("keydown", selectAllCmps);
    };
  }, []);
  return (
    <div
      id="center"
      className={styles.main}
      style={{ minHeight: canvas.style.height * (zoom / 100) + 100 }}
    >
      <Canvas />
      <Zoom />
    </div>
  );
};

export default Center;
