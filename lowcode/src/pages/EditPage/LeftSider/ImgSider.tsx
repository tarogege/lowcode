import { addCmp } from "../../../store/editStore";
import { ICmp } from "../../../store/editStoreTypes";
import { defaultComponentStyle, isImgComponent } from "../../../utils/const";
import leftSideStyles from "./leftSide.module.less";
import img1 from "../../../assets/1.jpeg";
import img2 from "../../../assets/2.jpeg";
import img3 from "../../../assets/3.jpeg";
import img4 from "../../../assets/bg1.jpg";
import img5 from "../../../assets/bg2.jpg";
import img6 from "../../../assets/bg3.jpg";

const defaultStyle = {
  ...defaultComponentStyle,
};

const settings: any = [
  {
    value: img1,
    style: defaultStyle,
  },
  {
    value: img2,
    style: defaultStyle,
  },
  {
    value: img3,
    style: defaultStyle,
  },
  {
    value: img4,
    style: defaultStyle,
  },
  {
    value: img5,
    style: defaultStyle,
  },
  {
    value: img6,
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
