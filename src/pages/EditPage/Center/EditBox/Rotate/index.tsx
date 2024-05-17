import { ICmpWithKey } from "src/store/editStoreType";
import styles from "./index.module.less";
import classNames from "classnames";
import { updateSelectedCmpStyle } from "src/store/editStore";
import { recordCanvasChangeHistory_2 } from "src/store/historySlice";

interface IRotateProps {
  zoom: number;
  selectedCmp: ICmpWithKey;
}

const Rotate = ({ zoom, selectedCmp }: IRotateProps) => {
  const onRotate = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const { style } = selectedCmp;
    const { height, transform } = style;
    console.log(transform, selectedCmp, "transfrommm");
    const angle = ((transform + 90) * Math.PI) / 180;

    const radius = height / 2;
    const [offsetX, offsetY] = [
      -Math.cos(angle) * radius,
      -Math.sin(angle) * radius,
    ];

    const startX = e.pageX + offsetX;
    const startY = e.pageY + offsetY;

    const rotate = (ev: any) => {
      const curX = ev.pageX;
      const curY = ev.pageY;

      const disX = (curX - startX) * (100 / zoom);
      const disY = (curY - startY) * (100 / zoom);

      // atan 返回弧度
      // 弧度* 180 / pi  = 角度
      const deg = Math.ceil((Math.atan2(disY, disX) * 180) / Math.PI - 90);
      updateSelectedCmpStyle({ transform: deg }, false);
      recordCanvasChangeHistory_2();
    };
    const up = () => {
      document.removeEventListener("mousemove", rotate);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", rotate);
    document.addEventListener("mouseup", up);
  };

  return (
    <div
      className={classNames(styles.rotate, "iconfont icon-xuanzhuan")}
      onMouseDown={onRotate}
    ></div>
  );
};

export default Rotate;
