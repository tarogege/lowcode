import useEditStore, {
  addCmp,
  fetchCanvas,
  initCanvas,
  setCmpSelected,
} from "src/store/editStore";
import styles from "./index.module.less";
import Cmp from "../Cmp";
import { useEffect } from "react";
import { useCanvasId } from "src/store/hooks";
import EditBox from "../EditBox";
import useZoomStore from "src/store/zoomStore";
import { ICmpWithKey } from "src/store/editStoreType";
import ReferenceLines from "../ReferenceLines";

const Canvas = () => {
  const { canvas, assembly } = useEditStore();
  const { cmps, style } = canvas.content;
  const id = useCanvasId();
  const zoom = useZoomStore((state) => state.zoom);

  useEffect(() => {
    if (id) {
      fetchCanvas(id);
    }
    return () => {
      initCanvas();
    };
  }, []);
  const onDrop = (e) => {
    // 获取拖拽项的数据
    let dragCmp = e.dataTransfer.getData("drag-cmp");
    if (!dragCmp) {
      return;
    }
    dragCmp = JSON.parse(dragCmp) as ICmpWithKey;

    // 获取拖拽项的位置
    // 鼠标相对于页面的位置
    const endX = e.pageX;
    const endY = e.pageY;
    const canvasDomPos = {
      top: 114,
      left: (document.body.clientWidth - style.width * (zoom / 100)) / 2,
    };

    let disX = endX - canvasDomPos.left;
    let disY = endY - canvasDomPos.top;

    disX *= 100 / zoom;
    disY *= 100 / zoom;

    dragCmp.style.top = disY - dragCmp.style.height / 2;
    dragCmp.style.left = disX - dragCmp.style.width / 2;

    addCmp(dragCmp);
  };

  const allowDraop = (e) => {
    e.preventDefault();
  };

  const clearSelect = (e) => {
    if (e.target?.id === "canvas") {
      setCmpSelected(-1);
    }
  };

  return (
    <div
      id="canvas"
      className={styles.main}
      style={{ ...canvas.content.style, transform: `scale(${zoom / 100})` }}
      onDrop={onDrop}
      onDragOver={allowDraop}
      onClick={clearSelect}
    >
      <EditBox />
      {cmps.map((_cmp, index) => (
        <Cmp cmp={_cmp} index={index} isSelected={assembly.has(index)} />
      ))}
      <ReferenceLines canvasStyle={style} />
    </div>
  );
};

export default Canvas;
