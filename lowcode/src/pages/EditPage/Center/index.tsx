import useEditStore, {
  addZIndex,
  bottomZIndex,
  deleteSelectedCmps,
  setAllCmpsSelected,
  setCmpSelected,
  subZIndex,
  topZIndex,
  updateAssemblyCmpStyle,
} from "../../../store/editStore";
import useZoomStore, { zoomIn, zoomOut } from "../../../store/zoomStore";
import Canvas from "./Canvas";
import Zoom from "./Zoom";
import styles from "./index.module.less";
const Center = () => {
  const canvas = useEditStore((state) => state.canvas);
  const zoom = useZoomStore((state) => state.zoom);

  const cancelSelect = (e: any) => {
    if (e.target.id.indexOf("cmp") === -1) {
      setCmpSelected(-1);
    }
  };

  const onkeydown = (e: any) => {
    if ((e.target as Element).nodeName === "TEXTAREA") {
      return;
    }
    if (e.metaKey) {
      switch (e.code) {
        case "KeyA":
          setAllCmpsSelected();
          break;
        case "Equal":
          zoomOut();
          e.preventDefault();
          break;
        case "Minus":
          zoomIn();
          e.preventDefault();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (e.shiftKey) {
            topZIndex();
          } else {
            addZIndex();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (e.shiftKey) {
            bottomZIndex();
          } else {
            subZIndex();
          }
          break;
      }
      return;
    }

    switch (e.code) {
      case "Backspace":
        deleteSelectedCmps();
        break;
      case "ArrowUp":
        e.preventDefault();
        updateAssemblyCmpStyle({ top: -1 });
        break;
      case "ArrowRight":
        updateAssemblyCmpStyle({ left: 1 });
        break;
      case "ArrowDown":
        e.preventDefault();
        updateAssemblyCmpStyle({ top: 1 });
        break;
      case "ArrowLeft":
        updateAssemblyCmpStyle({ left: -1 });
        break;
    }
  };
  return (
    <div
      id="center"
      tabIndex={0}
      className={styles.main}
      style={{
        minHeight: ((canvas.content.style.height as number) * zoom) / 100 + 100,
      }}
      onClick={cancelSelect}
      onKeyDown={onkeydown}
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
