import Cmp, { isGroupComponent } from "../Cmp";
import styles from "./index.module.css";

const Canvas = ({ canvas }: any) => {
  const { style, cmps } = canvas;
  console.log(canvas, "canvas");
  const width = style?.width;
  let transform;

  if (width < 1000) {
    // 如果设置的是移动端，但是是在PC显示的，控制下最大宽度
    let maxWidth = window.screen.width;
    if (maxWidth > 1000) {
      maxWidth = width;
    }
    transform = `scale(${maxWidth / width})`;
  }

  return (
    <div className={styles.main}>
      <div
        className={styles.canvas}
        style={{
          ...style,
          transform,
          transformOrigin: "0 0",
          overflow: "hidden",
          backgroundImage: `url(${(style as any).backgroundImage})`,
        }}
      >
        {cmps.map((cmp: any, index: number) =>
          (cmp.type & isGroupComponent) === 0 ? (
            <Cmp cmp={cmp} index={index} key={cmp.key} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Canvas;
