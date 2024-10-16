import { memo } from "react";
import { Style } from "../../../../store/editStoreTypes";
import useZoomStore, {
  clearReferenceLineX,
  clearReferenceLineY,
  setReferenceLineX,
  setReferenceLineY,
} from "../../../../store/zoomStore";
import styles from "./index.module.less";
import classNames from "classnames";

interface IReferenceLineProps {
  canvasStyle: Style;
  zoom: number;
}

const ReferenceLine = memo(({ canvasStyle, zoom }: IReferenceLineProps) => {
  const [referenceLinesX, referenceLinesY] = useZoomStore((state) => [
    state.referenceLinesX,
    state.referenceLinesY,
  ]);

  const canvasDomPos = {
    top: 114 + 1,
    left:
      document.body.clientWidth / 2 -
      (((canvasStyle.width as number) + 2) / 2) * (zoom / 100),
  };

  const onMouseDown = (e: any) => {
    const { key, index, direction } = e.target.dataset;

    const move = (innerE: any) => {
      // 区分方向，区分是set还是clear
      const cX = innerE.pageX;
      const cY = innerE.pageY;
      const disX = (cX - canvasDomPos.left) * (100 / zoom),
        disY = (cY - canvasDomPos.top) * (100 / zoom);

      if (direction === "x") {
        if (disY < 0 || disY > (canvasStyle.height as number)) {
          clearReferenceLineX(parseInt(index), key);
        } else {
          setReferenceLineX(index, disY);
        }
      } else {
        if (disX < 0 || disX > (canvasStyle.width as number)) {
          clearReferenceLineY(parseInt(index), key);
        } else {
          setReferenceLineY(index, disX);
        }
      }
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return (
    <>
      {referenceLinesX.map((x, index) => {
        return (
          <div
            key={x.key}
            style={{ top: x.top }}
            className={classNames(styles.referenceLine, styles.referenceLinesX)}
            onMouseDown={onMouseDown}
            data-index={index}
            data-key={x.key}
            data-direction={"x"}
          ></div>
        );
      })}
      {referenceLinesY.map((y, index) => {
        return (
          <div
            key={y.key}
            style={{ left: y.left }}
            className={classNames(styles.referenceLine, styles.referenceLinesY)}
            onMouseDown={onMouseDown}
            data-index={index}
            data-key={y.key}
            data-direction={"y"}
          />
        );
      })}
    </>
  );
});

export default ReferenceLine;
