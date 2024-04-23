import useEditStore, { setAllCmpsSelected } from "src/store/editStore";
import Canvas from "./Canvas";
import styles from "./index.module.less";
import { useEffect } from "react";
import Zoom from "./Zoom";
import useZoomStore from "src/store/zoomStore";

const Center = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const canvas = useEditStore((state) => state.canvas);
  const selectAllCmps = (e) => {
    if (e.metaKey) {
      if (e.code === "KeyA") {
        setAllCmpsSelected();
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
