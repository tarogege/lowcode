import classNames from "classnames";
import { ICmpWithKey } from "../../../../../store/editStoreTypes";
import styles from "./index.module.less";
import { updateSelectedCmpStyle } from "../../../../../store/editStore";
import { throttle } from "lodash";
import { recordCanvasHistory_2 } from "../../../../../store/historySlice";

interface IRotateProps {
  selectedCmp: ICmpWithKey;
  zoom: number;
}

const Rotate = ({ selectedCmp, zoom }: IRotateProps) => {
  const { height, transform } = selectedCmp.style;
  const onRotate = (e: any) => {
    e.stopPropagation();
    const pX = e.pageX,
      pY = e.pageY;

    //   起始点从水平转化为垂直，so + 90
    const angle = (((transform as any) + 90) * Math.PI) / 180;

    const radius = (height as number) / 2;
    const [offsetX, offsetY] = [
      -Math.cos(angle) * radius,
      -Math.sin(angle) * radius,
    ];

    const startX = pX + offsetX,
      startY = pY + offsetY;
    const rotate = throttle((innerE) => {
      const cX = innerE.pageX;
      const cY = innerE.pageY;
      const disX = ((cX - startX) * 100) / zoom,
        disY = ((cY - startY) * 100) / zoom;

      const deg = Math.ceil((180 / Math.PI) * Math.atan2(disY, disX) - 90);

      // @ts-ignore
      updateSelectedCmpStyle({ transform: deg }, false);
    }, 50);
    const up = () => {
      recordCanvasHistory_2();
      document.removeEventListener("mousemove", rotate);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", rotate);
    document.addEventListener("mouseup", up);
  };

  return (
    <div
      className={classNames("iconfont icon-xuanzhuan", styles.rotateIcon)}
      onMouseDown={onRotate}
    ></div>
  );
};

export default Rotate;
