import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.less";
import classNames from "classnames";
import {
  clearCanvas,
  saveCanvas,
} from "../../../store/editStore";
import { message } from "antd";
import {
  goNextCanvasHistory,
  goPrevCanvasHistory,
} from "../../../store/historySlice";
import { useEffect } from "react";

const Header = () => {
  // const hasSavedCanvas = useEditStore((state) => state.hasSavedCanvas);
  const navigate = useNavigate();

  // unstable_usePrompt({
  //   when: !hasSavedCanvas,
  //   message: "内容尚未保存，是否确定离开此页面",
  // });

  const save = () => {
    saveCanvas((_id: number, isNew: boolean) => {
      message.success("保存成功");
      if (isNew) {
        navigate(`?id=${_id}`);
      }
    });
  };

  const saveAndPreview = () => {
    saveCanvas((_id: number, isNew: boolean) => {
      message.success("保存成功");
      if (isNew) {
        navigate(`?id=${_id}`);
      }

      // FIXME:（改成自己的地址）跳转生成器项目页
      window.open("http://builder.codebus.tech?id=" + _id + "&preview");
    });
  };

  const emptyCanvase = () => {
    clearCanvas();
  };

  const keyDown = (e: any) => {
    if ((e.target as Element).nodeName === "TEXTAREA") {
      return;
    }

    if (e.metaKey) {
      switch (e.code) {
        case "KeyZ":
          if (e.shiftKey) {
            goNextCanvasHistory();
          } else {
            goPrevCanvasHistory();
          }
          break;
        case "KeyS":
          e.preventDefault();
          save();
          break;
      }
      return;
    }
  };

  const saveAndDownload = () => {
    saveCanvas((_id: number, isNew: boolean, res: any) => {
      message.success("保存成功");
      if (isNew) {
        navigate(`?id=${_id}`);
      }

      //   下载图片
      const el = document.createElement("a");
      el.href = res.thumbnail.full.replace("http://template.codebus.tech", "");
      el.download = res.title + ".png";
      el.style.display = "none";
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    });
  };
  useEffect(() => {
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("keydown", keyDown);
    };
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.item}>
        <Link to="/list">查看列表</Link>
      </div>

      <div className={styles.item} onClick={save}>
        <span
          className={classNames("iconfont icon-baocun", styles.icon)}
        ></span>
        <span className={styles.txt}>保存</span>
      </div>

      <div className={styles.item} onClick={saveAndPreview}>
        <span
          className={classNames("iconfont icon-baocun", styles.icon)}
        ></span>
        <span className={styles.txt}>保存并预览</span>
      </div>

      <div
        className={classNames(styles.item)}
        onClick={() => {
          goPrevCanvasHistory();
        }}
      >
        <span
          className={classNames(
            "iconfont icon-chexiaofanhuichehuishangyibu",
            styles.icon
          )}
        ></span>
        <span className={styles.txt}>上一步</span>
        <span className={styles.shortKey}>CMD+Z</span>
      </div>

      <div className={classNames(styles.item)} onClick={goNextCanvasHistory}>
        <span
          className={classNames(
            "iconfont icon-chexiaofanhuichehuishangyibu",
            styles.icon
          )}
          style={{ transform: `rotateY{180}deg` }}
        ></span>
        <span className={styles.txt}>下一步 </span>
        <span className={styles.shortKey}>CMD+Shift+Z</span>
      </div>

      <div className={classNames(styles.item)} onClick={emptyCanvase}>
        <span
          className={classNames("iconfont icon-qingkong", styles.icon)}
        ></span>
        <span className={styles.txt}>清空</span>
      </div>

      <div className={classNames(styles.item)} onClick={saveAndDownload}>
        <span
          className={classNames("iconfont icon-cloud-download", styles.icon)}
        ></span>
        <span className={styles.txt}>保存并下载图片</span>
      </div>
    </div>
  );
};

export default Header;
