import { useEffect, useState } from "react";
import leftSideStyles from "./leftSide.module.less";
import { settings } from "./tpl";
import Axios from "../../../request/axios";
import { getTemplateListEnd } from "../../../request/end";
import { addCanvasByTpl } from "../../../store/editStore";

const TplSider = () => {
  const [list, setList] = useState([]);

  const fresh = async () => {
    const res: any = await Axios.get(getTemplateListEnd);
    let data = res?.content || [];
    setList(data);
  };
  useEffect(() => {
    fresh();
  }, []);

  console.log("TplSider render"); //sy-log
  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {list.map((item: any) => (
          <li
            className={leftSideStyles.item}
            key={item.id}
            onClick={() => {
              addCanvasByTpl(item);
            }}
          >
            <div className={leftSideStyles.desc}>{item.title}</div>
            <img
              src={
                item.thumbnail?.header ||
                "https://i2.imgs.ovh/d/BQACAgEAAx0EUvSR8wACKuxmwuSZaMJgrTZ7AAEveyZTg1bSNVoAAg0FAAL0lBlGEfwZZlDElq01BA"
              }
              alt={item.title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TplSider;
