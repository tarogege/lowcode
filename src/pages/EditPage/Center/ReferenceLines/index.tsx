import classNames from "classnames";
import useZoomStore, {
  IReferenceX,
  IReferenceY,
  clearReferenceLineX,
  clearReferenceLineY,
  setReferenceLineX,
  setReferenceLineY,
} from "src/store/zoomStore";
import styles from "./index.module.less";
import { throttle } from "lodash";
import { Style } from "src/store/editStoreType";

interface IReferenceLinesProps {
  canvasStyle: Style;
}
const ReferenceLines = ({ canvasStyle }: IReferenceLinesProps) => {
  const [referenceLinesX, referenceLinesY, zoom] = useZoomStore((state) => [
    state.referenceLinesX,
    state.referenceLinesY,
    state.zoom,
  ]);

  const canvasDomPos = {
    top: 114 + 1,
    left:
      document.body.clientWidth / 2 -
      ((canvasStyle.width + 2) / 2) * (zoom / 100),
  };

  const onDownMove = (
    type: "x" | "y",
    index: number,
    line: IReferenceX | IReferenceY
  ) => {
    const move = throttle((moveEvent) => {
      const currentX = moveEvent.pageX;
      const currentY = moveEvent.pageY;

      const disX = (currentX - canvasDomPos.left) * (100 / zoom);
      const disY = (currentY - canvasDomPos.top) * (100 / zoom);

      if (type === "x") {
        if (disY < 0 || disY > canvasStyle.height) {
          clearReferenceLineX(line.key);
        } else {
          setReferenceLineX(index, disY);
        }
      } else {
        if (disX < 0 || disX > canvasStyle.width) {
          clearReferenceLineY(line.key);
        } else {
          setReferenceLineY(index, disX);
        }
      }
    }, 50);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return (
    <>
      {referenceLinesX.map((lineX, idx) => {
        return (
          <div
            className={classNames(styles.referenceLine, styles.referenceLineX)}
            style={{ top: lineX.top }}
            onMouseDown={() => onDownMove("x", idx, lineX)}
          ></div>
        );
      })}
      {referenceLinesY.map((lineY, idx) => {
        return (
          <div
            className={classNames(styles.referenceLine, styles.referenceLineY)}
            style={{ left: lineY.left }}
            onMouseDown={() => onDownMove("y", idx, lineY)}
          ></div>
        );
      })}
    </>
  );
};

export default ReferenceLines;
