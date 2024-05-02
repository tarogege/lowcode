import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.less";
import classNames from "classnames";
import { clearCanvas, saveCanvas } from "src/store/editStore";
import { useCanvasId } from "src/store/hooks";
import { message } from "antd";
import {
  goNextCanvasHistory,
  goPrevCanvasHistory,
} from "src/store/historySlice";
import { useEffect } from "react";

const Header = () => {
  let id = useCanvasId();
  const navigate = useNavigate();

  useEffect(() => {
    const saveSuccess = (_id: number, isNew: boolean) => {
      if (isNew) {
        navigate(`?id=${_id}`);
      }
    };
    const keyDown = (e) => {
      if (e.target.nodeName === "TEXTAREA") {
        return;
      }
      if (e.metaKey) {
        if (e.code === "KeyZ") {
          if (e.shiftKey) {
            goNextCanvasHistory();
          } else {
            goPrevCanvasHistory();
          }
        } else if (e.code === "KeyS") {
          saveCanvas(saveSuccess);
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("keydown", keyDown);
    };
  }, []);

  // save
  const handleSave = async () => {
    const onSuccess = (_id: number, isNew: boolean) => {
      message.success("保存成功");
      if (isNew) {
        navigate(`?id=${_id}`);
      }
    };
    await saveCanvas(onSuccess);
  };
  // save and preview
  const handleSaveAndPreview = async () => {
    const onSuccess = (_id: number, isNew: boolean) => {
      message.success("保存成功");

      if (isNew) {
        // 新增
        navigate(`?id=${_id}`);
      }

      // 跳转生成器项目页
      window.open("http://builder.codebus.tech?id=" + (id === null ? _id : id));
    };
    await saveCanvas(onSuccess);
  };

  const goPrev = () => {
    goPrevCanvasHistory();
  };

  const goNext = () => {
    goNextCanvasHistory();
  };

  const clear = () => {
    clearCanvas();
  };
  return (
    <div className={styles.main}>
      <div className={styles.item}>
        <Link to="/">查看列表</Link>
      </div>
      <div className={styles.item} onClick={handleSave}>
        <span
          className={classNames("iconfont icon-baocun", styles.icon)}
        ></span>
        <span className={styles.txt}>保存</span>
      </div>
      <div className={styles.item} onClick={handleSaveAndPreview}>
        <span
          className={classNames("iconfont icon-baocun", styles.icon)}
        ></span>
        <span className={styles.txt}>保存并预览</span>
      </div>
      <div className={styles.item} onClick={goPrev}>
        <span
          className={classNames(
            "iconfont icon-chexiaofanhuichehuishangyibu",
            styles.icon
          )}
        ></span>
        <span className={styles.txt}>上一步</span>
        <span className={styles.shortKey}>CMD+Z</span>
      </div>
      <div className={styles.item} onClick={goNext}>
        <span
          className={classNames(
            "iconfont icon-chexiaofanhuichehuishangyibu",
            styles.icon
          )}
          style={{ transform: `rotateY(180deg)` }}
          onClick={goNext}
        ></span>
        <span className={styles.txt}>下一步</span>
        <span className={styles.shortKey}>CMD+Shift+Z</span>
      </div>
      <div className={styles.item} onClick={clear}>
        <span
          className={classNames("iconfont icon-qingkong", styles.icon)}
        ></span>
        <span className={styles.txt}>清空</span>
      </div>
    </div>
  );
};

export default Header;
