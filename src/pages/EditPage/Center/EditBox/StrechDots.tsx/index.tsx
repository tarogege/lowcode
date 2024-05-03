import { updateAssemblyCmpsByDistance } from "src/store/editStore";
import styles from "./index.module.less";
import { throttle } from "lodash";
import { recordCanvasChangeHistory_2 } from "src/store/historySlice";

interface IStretchDotsProps {
  zoom: number;
  style: React.CSSProperties;
}
const StretchDots = (props: IStretchDotsProps) => {
  const { zoom, style } = props;
  const { transform, width, height } = style;

  const onSclae = (e) => {
    const directon = e.target?.dataset?.direction;
    if (!directon) {
      return;
    }
    let startX = e.pageX;
    let startY = e.pageY;

    const move = throttle((e) => {
      const cx = e.pageX;
      const cy = e.pageY;

      let disX = cx - startX;
      let disY = cy - startY;

      disX = disX * (100 / zoom);
      disY = disY * (100 / zoom);

      const newStyle: any = {};
      if (directon.includes("top")) {
        disY = -disY;
        newStyle.top = -disY;
      }
      if (directon.includes("left")) {
        disX = -disX;
        newStyle.left = -disX;
      }

      Object.assign(newStyle, {
        width: disX,
        height: disY,
      });

      startX = cx;
      startY = cy;

      updateAssemblyCmpsByDistance(newStyle);
    }, 50);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      recordCanvasChangeHistory_2();
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      <div
        className={styles.stretchDot}
        style={{
          left: -9,
          top: -9,
          transform,
          cursor: "nwse-resize",
        }}
        data-direction="top, left"
        onMouseDown={onSclae}
      ></div>
      <div
        className={styles.stretchDot}
        style={{
          left: width / 2 - 9,
          top: -9,
          transform,
          cursor: "row-resize",
        }}
        data-direction="top"
        onMouseDown={onSclae}
      ></div>
      <div
        className={styles.stretchDot}
        style={{
          left: width - 11,
          top: -9,
          transform,
          cursor: "nesw-resize",
        }}
        data-direction="top, right"
        onMouseDown={onSclae}
      ></div>
      <div
        className={styles.stretchDot}
        style={{
          left: width - 11,
          top: height / 2 - 9,
          transform,
          cursor: "column-resize",
        }}
        data-direction="right"
        onMouseDown={onSclae}
      ></div>
      <div
        className={styles.stretchDot}
        style={{
          left: width - 11,
          top: height - 11,
          transform,
          cursor: "nwse-resize",
        }}
        data-direction="right, bottom"
        onMouseDown={onSclae}
      ></div>
      <div
        className={styles.stretchDot}
        style={{
          left: width / 2 - 9,
          top: height - 11,
          transform,
          cursor: "row-resize",
        }}
        data-direction="bottom"
        onMouseDown={onSclae}
      ></div>
      <div
        className={styles.stretchDot}
        style={{
          left: -9,
          top: height - 11,
          transform,
          cursor: "nesw-resize",
        }}
        data-direction="bottom, left"
        onMouseDown={onSclae}
      ></div>
      <div
        className={styles.stretchDot}
        style={{
          left: -9,
          top: height / 2 - 9,
          transform,
          cursor: "column-resize",
        }}
        data-direction="left"
        onMouseDown={onSclae}
      ></div>
    </>
  );
};

export default StretchDots;
