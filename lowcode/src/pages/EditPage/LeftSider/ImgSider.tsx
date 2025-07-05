import { addCmp } from "../../../store/editStore";
import { ICmp } from "../../../store/editStoreTypes";
import { defaultComponentStyle, isImgComponent } from "../../../utils/const";
import leftSideStyles from "./leftSide.module.less";
import { imgs } from "../../../consts/index";

const defaultStyle = {
  ...defaultComponentStyle,
};

const settings: any = [
  {
    value: imgs[0],
    style: defaultStyle,
  },
  {
    value: imgs[1],
    style: defaultStyle,
  },
  {
    value: imgs[2],
    style: defaultStyle,
  },
  {
    value: imgs[4],
    style: defaultStyle,
  },
  {
    value: imgs[5],
    style: defaultStyle,
  },
];

const ImgSider = () => {
  const onClick = (item: ICmp) => {
    addCmp({ ...item, type: isImgComponent });
  };

  const onDragStart = (e: any, item: ICmp) => {
    e.dataTransfer.setData(
      "drag-component",
      JSON.stringify({ ...item, type: isImgComponent })
    );
  };

  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {settings.map((item: any) => (
          <li
            key={item.value}
            className={leftSideStyles.item}
            onClick={() => onClick(item)}
            draggable={true}
            onDragStart={(e) => onDragStart(e, item)}
          >
            <img draggable={false} src={item.value} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImgSider;
