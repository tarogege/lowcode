import { addCmp } from "../../../store/editStore";
import { ICmp } from "../../../store/editStoreTypes";
import { defaultComponentStyle, isImgComponent } from "../../../utils/const";
import leftSideStyles from "./leftSide.module.less";

const defaultStyle = {
  ...defaultComponentStyle,
};

const settings: any = [
  {
    value:
      "https://i2.imgs.ovh/d/BQACAgEAAx0EUvSR8wACKuxmwuSZaMJgrTZ7AAEveyZTg1bSNVoAAg0FAAL0lBlGEfwZZlDElq01BA",
    style: defaultStyle,
  },
  {
    value:
      "https://i2.imgs.ovh/d/BQACAgEAAx0EUvSR8wACKu5mwuSa2S-AvPcXZ17E3U3m5He2HQACDwUAAvSUGUZ7sLf4xRFTkzUE",
    style: defaultStyle,
  },
  {
    value:
      "https://i2.imgs.ovh/d/BQACAgEAAx0EUvSR8wACKu1mwuSZjtBNVBZFgFDEBvx9mPqruwACDgUAAvSUGUbSoPWRkCqAiDUE",
    style: defaultStyle,
  },
  {
    value:
      "https://i2.imgs.ovh/d/BQACAgEAAx0EUvSR8wACKu9mwuSaQEunj5PffrV1gN7-tb0KqAACEAUAAvSUGUbcktuEsqH2rjUE",
    style: defaultStyle,
  },
  {
    value:
      "https://i2.imgs.ovh/d/BQACAgEAAx0EUvSR8wACKvBmwuScqpOb2Uh09Q9GHy5SykqKVAACEQUAAvSUGUbATNeOVwe9aTUE",
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
        {settings.map((item) => (
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
