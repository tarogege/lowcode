import { addCmp } from "../../../store/editStore";
import { ICmp } from "../../../store/editStoreTypes";
import { defaultComponentStyle, isTextComponent } from "../../../utils/const";
import leftSideStyles from "./leftSide.module.less";

const defaultStyle = {
  ...defaultComponentStyle,
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
  const onClick = (item: ICmp) => {
    addCmp({ ...item, type: isTextComponent });
  };

  const onDragStart = (e: any, item: ICmp) => {
    e.dataTransfer.setData(
      "drag-component",
      JSON.stringify({ ...item, type: isTextComponent })
    );
  };
  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {settings.map((item) => (
          <li
            key={item.value}
            className={leftSideStyles.item}
            onClick={() => onClick(item as any)}
            draggable={true}
            onDragStart={(e) => onDragStart(e, item as any)}
          >
            {item.value.indexOf("双击编辑") > -1
              ? item.value.slice(4)
              : item.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextSider;
