import { useEffect, useState } from "react";
import leftSideStyles from "./leftSide.module.less";
import Axios from "../../../request/axios";
import { getTemplateListEnd } from "../../../request/end";
import { addCanvasByTpl } from "../../../store/editStore";
import { Spin } from "antd";

const TplSider = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false)

  const fresh = async () => {
    setLoading(true)
    const res: any = await Axios.get(getTemplateListEnd, {
      headers: {globalLoading: false}
    });
    let data = res?.data || [];
    console.log(res, 'ressss')
    setList(data);
    setLoading(false)
  };
  useEffect(() => {
    fresh();
  }, []);

  if(loading) {
    return <div className={leftSideStyles.main}><div className={leftSideStyles.box}><Spin /></div></div>
  }

  console.log("TplSider render"); //sy-log
  return (
    <div className={leftSideStyles.main}>
      <ul className={leftSideStyles.box}>
        {list.length ? list.map((item: any) => (
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
        )) : <li>暂无模版..</li>}
      </ul>
    </div>
  );
};

export default TplSider;
