import { addCmp } from "../../../store/editStore";
import { ICmp } from "../../../store/editStoreTypes";
import { defaultComponentStyle, isTextComponent } from "../../../utils/const";
import leftSideStyles from "./leftSide.module.less";

const defaultStyle = {
  ...defaultComponentStyle,
  width: 120,
  height: 120,
  borderColor: "blue",
  backgroundColor: "blue",
};

const settings = [
  {
    key: "graph0",
    style: {
      ...defaultStyle,
      borderWidth: 1,
      borderStyle: "solid",
      backgroundColor: "transparent",
    },
  },
  {
    key: "graph1",
    style: defaultStyle,
  },
];

const GraphSider = () => {
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
            key={item.key}
            className={leftSideStyles.item}
            onClick={() => onClick(item as any)}
            draggable={true}
            onDragStart={(e) => onDragStart(e, item as any)}
            style={{
              width: item.style.width,
              height: item.style.height,
              backgroundColor: item.style.backgroundColor,
              borderStyle: item.style.borderStyle,
              borderColor: item.style.borderColor,
            }}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default GraphSider;
