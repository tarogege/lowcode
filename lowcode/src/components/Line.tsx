import { Style } from "../store/editStoreTypes";

interface ILineProps {
  style?: Style;
  [key: string]: any;
}
const Line = ({ style, ...rest }: ILineProps) => {
  return (
    <div
      {...rest}
      className="alignLine"
      style={{
        display: "none",
        position: "absolute",
        width: 1,
        height: 1,
        backgroundColor: "rgba(0, 87, 255, 0.8)",
        zIndex: 9999,
        ...style,
      }}
    />
  );
};

export default Line;
