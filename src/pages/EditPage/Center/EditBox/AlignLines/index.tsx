import Line from "src/components/Line";
import { Style } from "src/store/editStoreType";

interface IAlignLinesPorps {
  canvasStyle: Style;
}

const AlignLines = ({ canvasStyle }: IAlignLinesPorps) => {
  return (
    <>
      <Line
        id="canvasLineTop"
        style={{
          left: 0,
          top: 0,
          width: canvasStyle.width,
          backgroundColor: "red",
        }}
      />
      <Line
        id="canvasLineRight"
        style={{
          top: 0,
          left: canvasStyle.width,
          height: canvasStyle.height,
          backgroundColor: "red",
        }}
      />
      <Line
        id="canvasLineBottom"
        style={{
          top: canvasStyle.height,
          left: 0,
          width: canvasStyle.width,
          backgroundColor: "red",
        }}
      />
      <Line
        id="canvasLineLeft"
        style={{
          top: 0,
          left: 0,
          height: canvasStyle.height,
          backgroundColor: "red",
        }}
      />
      <Line
        id="centerXLine"
        style={{
          top: canvasStyle.height / 2,
          left: 0,
          width: canvasStyle.width,
          backgroundColor: "red",
        }}
      />
      <Line
        id="centerYLine"
        style={{
          top: 0,
          left: canvasStyle.width / 2,
          height: canvasStyle.height,
          backgroundColor: "red",
        }}
      />
    </>
  );
};

export default AlignLines;
