import { OSS_PIC } from "../../../consts/const";
import { addCmp } from "../../../store/editStore";
import { ICmp } from "../../../store/editStoreTypes";
import { defaultComponentStyle, isImgComponent } from "../../../utils/const";
import leftSideStyles from "./leftSide.module.less";
import { Skeleton } from "antd";
import { useState, useEffect } from "react";

const defaultStyle = {
  ...defaultComponentStyle,
};

const settings: any = [
  {
    value: OSS_PIC + '1.jpeg',
    style: defaultStyle,
  },
  {
    value: OSS_PIC + '2.jpeg',
    style: defaultStyle,
  },
  {
    value: OSS_PIC + '3.jpeg',
    style: defaultStyle,
  },
  {
    value: OSS_PIC + 'bg1.jpg',
    style: defaultStyle,
  },
  {
    value: OSS_PIC + 'bg2.jpg',
    style: defaultStyle,
  },
  {
    value: OSS_PIC + 'bg3.jpg',
    style: defaultStyle,
  },
];

const ImgSider = () => {
  // 用于记录每个图片的加载状态
  const [loadingArr, setLoadingArr] = useState<boolean[]>(() => settings.map(() => true));
  // 用于强制刷新图片，避免缓存导致 onLoad 不触发
  const [imgKeyArr, setImgKeyArr] = useState<number[]>(() => settings.map(() => Date.now() + Math.random()));

  // 组件挂载时，重置 loadingArr，防止热更新时状态错乱
  useEffect(() => {
    setLoadingArr(settings.map(() => true));
    setImgKeyArr(settings.map(() => Date.now() + Math.random()));
  }, []);

  const onImgLoad = (idx: number) => {
    setLoadingArr((arr) => {
      const newArr = [...arr];
      newArr[idx] = false;
      return newArr;
    });
  };

  const onImgError = (idx: number) => {
    // 失败时也隐藏骨架屏，可以自定义错误占位
    setLoadingArr((arr) => {
      const newArr = [...arr];
      newArr[idx] = false;
      return newArr;
    });
  };

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
        {settings.map((item: any, idx: number) => (
          <li
            key={item.value}
            className={leftSideStyles.item}
            onClick={() => onClick(item)}
            draggable={true}
            onDragStart={(e) => onDragStart(e, item)}
          >
            {loadingArr[idx] && (
              <Skeleton.Image style={{ width: 80, height: 80, marginBottom: 8 }} active />
            )}
            <img
              key={imgKeyArr[idx]}
              onLoad={() => onImgLoad(idx)}
              onError={() => onImgError(idx)}
              draggable={false}
              src={item.value}
              style={{
                width: 80,
                height: 80,
                display: loadingArr[idx] ? "none" : "inline-block",
                objectFit: "cover",
                borderRadius: 4,
              }}
              alt=""
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImgSider;
