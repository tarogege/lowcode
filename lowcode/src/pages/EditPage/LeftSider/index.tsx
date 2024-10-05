import { useEffect, useState } from "react";
import styles from "./index.module.less";
import classNames from "classnames";
import TextSider from "./TextSider";
import ImgSider from "./ImgSider";
import GraphSider from "./GraphSider";
import TplSider from "./TplSider";
import {
  isFormComponent,
  isGraphComponent,
  isImgComponent,
  isTextComponent,
} from "../../../utils/const";
import FormSider from "./FormSider";

export const isTplComponent = 0b00000000;

const LeftSider = () => {
  const [showSide, setShowSide] = useState(-1);

  const _setShowSide = (which: number | undefined) => {
    if (showSide === which) {
      setShowSide(-1);
    } else {
      setShowSide(which || 0);
    }
  };

  useEffect(() => {
    const cancelShow = () => setShowSide(-1);
    document.getElementById("center")?.addEventListener("click", cancelShow);
    return () => {
      document
        .getElementById("center")
        ?.removeEventListener("click", cancelShow);
    };
  }, []);

  return (
    <div className={styles.main}>
      <ul className={styles.cmps}>
        <li
          className={classNames(styles.cmp, {
            [styles.selected]: showSide === isTplComponent,
          })}
          onClick={() => {
            _setShowSide(isTplComponent);
          }}
        >
          <i
            className={classNames(
              "iconfont icon-mobankuangjia-xianxing",
              styles.cmpIcon
            )}
          ></i>
          <span className={styles.cmpText}>模版</span>
        </li>
        <li
          className={classNames(styles.cmp, {
            [styles.selected]: showSide === isTextComponent,
          })}
          onClick={() => {
            _setShowSide(isTextComponent);
          }}
        >
          <i className={classNames("iconfont icon-wenben", styles.cmpIcon)}></i>
          <span className={styles.cmpText}>文本</span>
        </li>
        <li
          className={classNames(styles.cmp, {
            [styles.selected]: showSide === isImgComponent,
          })}
          onClick={() => {
            _setShowSide(isImgComponent);
          }}
        >
          <i className={classNames("iconfont icon-tupian", styles.cmpIcon)}></i>
          <span className={styles.cmpText}>图片</span>
        </li>
        <li
          className={classNames(styles.cmp, {
            [styles.selected]: showSide === isGraphComponent,
          })}
          onClick={() => {
            _setShowSide(isGraphComponent);
          }}
        >
          <i
            className={classNames("iconfont icon-graphical", styles.cmpIcon)}
          ></i>
          <span className={styles.cmpText}>图形</span>
        </li>

        <li
          className={classNames(styles.cmp, {
            [styles.selected]: showSide === isFormComponent,
          })}
          onClick={() => {
            _setShowSide(isFormComponent);
          }}
        >
          <i className={classNames("iconfont icon-form", styles.cmpIcon)}></i>
          <span className={styles.cmpText}>表单</span>
        </li>
      </ul>

      {showSide === isTplComponent && <TplSider />}
      {showSide === isTextComponent && <TextSider />}
      {showSide === isImgComponent && <ImgSider />}
      {showSide === isGraphComponent && <GraphSider />}
      {showSide === isFormComponent && <FormSider />}
    </div>
  );
};

export default LeftSider;
