import { ICanvas } from "src/store/editStoreType";
import styles from "./edit.module.less";
import Item from "src/lib/Item";
import InputColor from "src/lib/InputColor";
import { updateCanvasStyle } from "src/store/editStore";

const EditCanvas = ({ canvas }: { canvas: ICanvas }) => {
  const onStyleChange = (
    e,
    { name, value }: { name: string; value: number | string }
  ) => {
    updateCanvasStyle({ [name]: value });
  };
  const updateTitle = () => {};
  return (
    <div className={styles.main}>
      <div className={styles.title}>画布属性</div>
      <Item label="标题">
        <input
          value={canvas.title}
          className={styles.itemRight}
          onChange={updateTitle}
        />
      </Item>
      <Item label="画布宽度（px）">
        <input
          value={canvas.style.width}
          className={styles.itemRight}
          onChange={(e) => {
            onStyleChange(e, {
              name: "width",
              value: +parseInt(e.target.value) || 0,
            });
          }}
        />
      </Item>
      <Item label="画布高度（px）">
        <input
          value={canvas.style.height}
          className={styles.itemRight}
          onChange={(e) =>
            onStyleChange(e, {
              name: "height",
              value: +parseInt(e.target.value) || 0,
            })
          }
        />
      </Item>
      <Item label="背景颜色">
        <InputColor
          color={canvas.style.backgroundColor}
          className={styles.itemRight}
          onChangeComplete={(color: any, e: any) =>
            onStyleChange(e, { name: "backgroundColor", value: color.hex })
          }
        />
      </Item>
      <Item label="背景图片">
        <input
          value={canvas.style.backgroundImage}
          className={styles.itemRight}
          onChange={(e) =>
            onStyleChange(e, { name: "backgroundImage", value: e.target.value })
          }
        />
      </Item>
    </div>
  );
};

export default EditCanvas;
