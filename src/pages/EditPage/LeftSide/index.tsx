import classNames from "classnames";
import styles from "./index.module.less";
import { useEffect, useState } from "react";
import TextSider from "./TextSider";
import ImgSider from "./ImgSider";
import GraphSider from "./GraphSider";

export const isTxtCmp = 1;
export const isImgCmp = 2;
export const isGraphyCmp = 3;

const LeftSide = () => {
  const [showSide, setShowSide] = useState(0);

  const _setShowSide = (which: number | undefined) => {
    if (showSide === which) {
      setShowSide(0);
    } else {
      setShowSide(which || 0);
    }
  };

  useEffect(() => {
    const cancelShow = () => {
      console.log("123");
      setShowSide(0);
    };
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
          className={classNames(
            styles.cmp,
            showSide === isTxtCmp ? styles.selected : ""
          )}
          onClick={() => _setShowSide(isTxtCmp)}
        >
          <i
            className={classNames(
              "icon",
              "iconfont",
              "icon-wenben",
              styles.cmpIcon
            )}
          ></i>
          <span className={styles.cmpText}>文本</span>
        </li>
        <li
          className={classNames(
            styles.cmp,
            showSide === isImgCmp ? styles.selected : ""
          )}
          onClick={() => _setShowSide(isImgCmp)}
        >
          <i
            className={classNames(
              "icon",
              "iconfont",
              "icon-tupian",
              styles.cmpIcon
            )}
          ></i>
          <span className={styles.cmpText}>图片</span>
        </li>
        <li
          className={classNames(
            styles.cmp,
            showSide === isGraphyCmp ? styles.selected : ""
          )}
          onClick={() => _setShowSide(isGraphyCmp)}
        >
          <i
            className={classNames(
              "icon",
              "iconfont",
              "icon-graphical",
              styles.cmpIcon
            )}
          ></i>
          <span className={styles.cmpText}>图形</span>
        </li>
      </ul>
      {showSide === isTxtCmp && <TextSider />}
      {showSide === isImgCmp && <ImgSider />}
      {showSide === isGraphyCmp && <GraphSider />}
    </div>
  );
};

export default LeftSide;
