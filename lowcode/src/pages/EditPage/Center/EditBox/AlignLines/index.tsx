import Line from "../../../../../components/Line";
import { Style } from "../../../../../store/editStoreTypes";

interface IAlignLinesProps {
  canvasStyle: Style;
}

const AlignLines = ({ canvasStyle }: IAlignLinesProps) => {
  const { width, height } = canvasStyle;
  return (
    <>
      {/* 上 */}
      <Line
        style={{ width, left: 0, top: 0, backgroundColor: "red" }}
        id="canvasLineTop"
      />
      {/* 下 */}
      <Line
        style={{ width, left: 0, top: height, backgroundColor: "red" }}
        id="canvasLineBottom"
      />
      {/* 左 */}
      <Line
        style={{ height, left: 0, top: 0, backgroundColor: "red" }}
        id="canvasLineLeft"
      />
      {/* 右*/}
      <Line
        style={{ height, left: width, top: 0, backgroundColor: "red" }}
        id="canvasLineRight"
      />
      {/* x中轴 */}
      <Line
        style={{ width, left: 0, top: height / 2, backgroundColor: "red" }}
        id="centerXLine"
      />
      {/* y中轴 */}
      <Line
        style={{ height, left: width / 2, top: 0, backgroundColor: "red" }}
        id="centerYLine"
      />

      {/* 与组件对齐的吸附线 */}
      {/* FIXME: 如果多个组件用到了同一条吸附线的时候逻辑就会有问题，会显示最上层的组件影响的那条吸附线 */}
      <Line id="lineTop" />
      <Line id="lineRight" />
      <Line id="lineBottom" />
      <Line id="lineLeft" />
      <Line id="lineX" />
      <Line id="lineY" />
    </>
  );
};

export default AlignLines;
