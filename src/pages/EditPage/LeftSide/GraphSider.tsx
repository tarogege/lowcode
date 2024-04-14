import { addCmp } from "src/store/editStore";
import leftSideStyles from "./leftSide.module.less";
import { isGraphyCmp, isTxtCmp } from ".";
import { defaultComponentStyle } from "src/utils/const";

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
    value: "",
    style: {
      ...defaultStyle,
      borderWidth: 1,
      borderStyle: "solid",
      backgroundColor: "transparent",
    },
  },
  {
    key: "graph1",
    value: "",
    style: defaultStyle,
  },
];

const GraphSider = () => {
  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {settings.map((item) => {
          return (
            <li
              draggable={true}
              key={item.value}
              className={leftSideStyles.item}
              onClick={() => addCmp({ ...item, type: isGraphyCmp })}
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "drag-cmp",
                  JSON.stringify({ ...item, type: isGraphyCmp })
                );
              }}
              style={{
                width: item.style.width,
                height: item.style.height,
                backgroundColor: item.style.backgroundColor,
                borderStyle: item.style.borderStyle,
                borderColor: item.style.borderColor,
              }}
            ></li>
          );
        })}
      </ul>
    </div>
  );
};

export default GraphSider;
