import { useEffect } from "react";
import useEditStore, {
  addCmp,
  fetchCanvas,
  initCanvas,
} from "../../../../store/editStore";
import { ICmpWithKey } from "../../../../store/editStoreTypes";
import { useCanvasId } from "../../../../store/hooks";
import Cmp from "../Cmp";
import styles from "./index.module.less";
import EditBox from "../EditBox";
import { useShallow } from "zustand/react/shallow";
import useZoomStore from "../../../../store/zoomStore";
import ReferenceLine from "../ReferenceLine";

const Canvas = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const [canvas, assembly] = useEditStore(
    useShallow((state) => [state.canvas.content, state.assembly])
  ) as any;
  const { cmps, style } = canvas;
  const id = useCanvasId();

  useEffect(() => {
    if (id) {
      fetchCanvas(id);
    }
    return () => {
      initCanvas();
    };
  }, []);

  console.log("canvas render", canvas.cmps);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    let _cmp: any = e.dataTransfer.getData("drag-component");
    if (!_cmp) {
      return;
    }
    _cmp = JSON.parse(_cmp) as ICmpWithKey;
    console.log(_cmp, "ccc");

    const endX = e.pageX;
    const endY = e.pageY;

    const canvasDom = {
      top: 114,
      left: document.body.clientWidth / 2 - ((style.width / 2) * zoom) / 100,
    };

    const posX = endX - canvasDom.left;
    const posY = endY - canvasDom.top;

    _cmp.style.left = ((posX - _cmp.style.width / 2) * 100) / zoom;
    _cmp.style.top = ((posY - _cmp.style.height / 2) * 100) / zoom;

    addCmp(_cmp);
  };

  const allowDraop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      id="canvas"
      className={styles.main}
      style={{ ...style, transform: `scale(${zoom / 100})` }}
      onDrop={onDrop}
      onDragOver={allowDraop}
    >
      <EditBox />
      {cmps.map((cmp: ICmpWithKey, index: number) => {
        return (
          <Cmp
            key={cmp.key}
            index={index}
            cmp={cmp}
            isSelected={assembly.has(index)}
          />
        );
      })}

      <ReferenceLine canvasStyle={style} zoom={zoom} />
    </div>
  );
};

export default Canvas;
