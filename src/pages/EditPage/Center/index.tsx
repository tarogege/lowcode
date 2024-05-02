import useEditStore, {
  deleteAssembly,
  downZIndex,
  setAllCmpsSelected,
  upZIndex,
  updateAssemblyCmpsByDistance,
} from "src/store/editStore";
import Canvas from "./Canvas";
import styles from "./index.module.less";
import { useEffect } from "react";
import Zoom from "./Zoom";
import useZoomStore, { zoomIn, zoomOut } from "src/store/zoomStore";
import {
  goNextCanvasHistory,
  goPrevCanvasHistory,
} from "src/store/historySlice";

const Center = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const canvas = useEditStore((state) => state.canvas);
  const selectAllCmps = (e) => {
    console.log(e.code, "快捷方式");
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
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        upZIndex();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        downZIndex();
      }
      return;
    }

    if (e.code === "Backspace") {
      deleteAssembly();
      return;
    } else if (e.code === "ArrowUp") {
      updateAssemblyCmpsByDistance({ top: -1 });
      e.preventDefault();
      return;
    } else if (e.code === "ArrowDown") {
      updateAssemblyCmpsByDistance({ top: 1 });
      e.preventDefault();
      return;
    } else if (e.code === "ArrowLeft") {
      updateAssemblyCmpsByDistance({ left: -1 });
      e.preventDefault();
      return;
    } else if (e.code === "ArrowRight") {
      updateAssemblyCmpsByDistance({ left: 1 });
      e.preventDefault();
      return;
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
      style={{ minHeight: canvas.content.style.height * (zoom / 100) + 100 }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <Canvas />
      <Zoom />
    </div>
  );
};

export default Center;
