import { useEffect, useState } from "react";
import leftSideStyles from "./leftSide.module.less";
import { ICanvas } from "src/store/editStoreType";
import { getTemplateListEnd } from "src/request/end";
import Axios from "src/request/axios";
import { addCanvasByTpl } from "src/store/editStore";
import { Image } from "antd";

const TplSider = () => {
  const [list, setList] = useState([]);

  const fresh = async () => {
    const res: any = await Axios.get(getTemplateListEnd);
    const data = res?.content || [];
    setList(data);
  };

  useEffect(() => {
    fresh();
  }, []);

  const onUseTpl = (item: any) => {
    addCanvasByTpl(item);
  };

  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {list.map((item: any) => {
          return (
            <li
              className={leftSideStyles.item}
              onClick={() => onUseTpl(item)}
              key={item.id}
            >
              <div className={leftSideStyles.desc}>{item.title}</div>
              <Image
                preview={false}
                src={
                  // item.thumbnail?.header ||
                  item.thumbnail?.full
                }
                fallback="https://www.bubucuo.cn/react-head.png"
                alt={item.title}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TplSider;
