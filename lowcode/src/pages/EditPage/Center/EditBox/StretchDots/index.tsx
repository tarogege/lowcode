import { throttle } from "lodash";
import { updateAssemblyCmpStyle } from "../../../../../store/editStore";
import { Style } from "../../../../../store/editStoreTypes";
import styles from "./index.module.less";
import { recordCanvasHistory_2 } from "../../../../../store/historySlice";

interface IStretchDotsProps {
  style: Style;
  zoom: number;
}

const StretchDots = (props: IStretchDotsProps) => {
  const { zoom, style } = props;
  const { width, height, transform } = style;

  const onScale = (e) => {
    const direction = e.target.dataset.direction;
    if (!direction) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    let startX = e.pageX,
      startY = e.pageY;

    const scale = throttle((scaleE) => {
      const nowX = scaleE.pageX,
        nowY = scaleE.pageY;

      let disX = (nowX - startX) * (100 / zoom),
        disY = (nowY - startY) * (100 / zoom);

      let newStyle: any = {};
      if (direction.includes("top")) {
        newStyle.top = disY;
        disY = -disY;
      }
      if (direction.includes("left")) {
        newStyle.left = disX;
        disX = -disX;
      }
      newStyle = { ...newStyle, width: disX, height: disY };

      updateAssemblyCmpStyle(newStyle);

      startX = nowX;
      startY = nowY;
    }, 50);
    const up = () => {
      recordCanvasHistory_2();
      document.removeEventListener("mousemove", scale);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", scale);
    document.addEventListener("mouseup", up);
  };

  return (
    <>
      <div
        className={styles.stretchDot}
        data-direction="top left"
        // 因为要算上edit-box 边框的宽度，边框宽2px
        style={{ left: -9, top: -9, transform, cursor: "nwse-resize" }}
        onMouseDown={onScale}
      ></div>
      <div
        className={styles.stretchDot}
        data-direction="top"
        style={{
          left: width / 2 - 9,
          top: -9,
          transform,
          cursor: "row-resize",
        }}
        onMouseDown={onScale}
      ></div>
      <div
        className={styles.stretchDot}
        data-direction="top right"
        style={{
          left: width - 11,
          top: -9,
          transform,
          cursor: "nesw-resize",
        }}
        onMouseDown={onScale}
      ></div>

      <div
        className={styles.stretchDot}
        data-direction="right"
        style={{
          left: width - 11,
          top: height / 2 - 11,
          transform,
          cursor: "col-resize",
        }}
        onMouseDown={onScale}
      ></div>
      <div
        className={styles.stretchDot}
        data-direction="right bottom"
        style={{
          left: width - 11,
          top: height - 11,
          transform,
          cursor: "nwse-resize",
        }}
        onMouseDown={onScale}
      ></div>

      <div
        className={styles.stretchDot}
        data-direction="bottom"
        style={{
          left: width / 2 - 11,
          top: height - 11,
          transform,
          cursor: "row-resize",
        }}
        onMouseDown={onScale}
      ></div>
      <div
        className={styles.stretchDot}
        data-direction="bottom left"
        style={{
          left: -9,
          top: height - 11,
          transform,
          cursor: "nesw-resize",
        }}
        onMouseDown={onScale}
      ></div>

      <div
        className={styles.stretchDot}
        data-direction="left"
        style={{
          left: -9,
          top: height / 2 - 11,
          transform,
          cursor: "col-resize",
        }}
        onMouseDown={onScale}
      ></div>
    </>
  );
};

export default StretchDots;
