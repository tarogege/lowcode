import { addCmp } from "src/store/editStore";
import leftSideStyles from "./leftSide.module.less";
import { defaultComponentStyle, isTxtCmp } from "src/utils/const";

const defaultStyle = {
  ...defaultComponentStyle,
  transform: 0,
  width: 170,
  height: 30,
  lineHeight: "30px",
  fontSize: 12,
  fontWeight: "normal",
  textDecoration: "none",
  color: "#000",
  backgroundColor: "#ffffff00",
  textAlign: "left",
  wordSpacing: "10px",
};

const settings = [
  {
    value: "双击编辑标题",
    style: {
      ...defaultStyle,
      fontSize: 28,
      height: 50,
      lineHeight: "50px",
    },
  },
  {
    value: "双击编辑正文",
    style: defaultStyle,
  },
];

const TextSider = () => {
  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {settings.map((item) => {
          return (
            <li
              draggable={true}
              key={item.value}
              className={leftSideStyles.item}
              onClick={() => addCmp({ ...item, type: isTxtCmp })}
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "drag-cmp",
                  JSON.stringify({ ...item, type: isTxtCmp })
                );
              }}
            >
              {item.value.indexOf("双击编辑") > -1
                ? item.value.slice(4)
                : item.value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TextSider;
