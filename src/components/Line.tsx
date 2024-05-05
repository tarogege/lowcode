import { Style } from "src/store/editStoreType";

interface ILineProps {
  id?: string;
  style?: Style;
}
const Line = ({ style, ...rest }: ILineProps) => {
  return (
    <div
      {...rest}
      className="alignLine"
      style={{
        display: "none",
        zIndex: 9999,
        width: "1px",
        height: "1px",
        backgroundColor: "rgba(0, 87, 255, 0.8)",
        position: "absolute",
        ...style,
      }}
    ></div>
  );
};

export default Line;
