import InputColor from "../../../lib/InputColor";
import Item from "../../../lib/Item";
import { updateCanvasStyle, updateCanvasTitle } from "../../../store/editStore";
import { ICanvas, Style } from "../../../store/editStoreTypes";
import styles from "./edit.module.less";

const EditCanvas = ({ canvas }: { canvas: ICanvas }) => {
  const onCanvasStyleChange = (e, _style: Style) => {
    updateCanvasStyle(_style);
  };

  return (
    <div className={styles.main}>
      <div className={styles.title}>画布属性</div>

      <Item label="标题:">
        <input
          className={styles.itemRight}
          value={canvas.title}
          onChange={(e) => {
            updateCanvasTitle(e.target.value);
          }}
        />
      </Item>

      <Item label="画布宽度(px):">
        <input
          type="number"
          className={styles.itemRight}
          value={canvas.content.style.width}
          onChange={(e) => onCanvasStyleChange(e, { width: +e.target.value })}
        />
      </Item>

      <Item label="画布高度(px):">
        <input
          type="number"
          className={styles.itemRight}
          value={canvas.content.style.height}
          onChange={(e) => onCanvasStyleChange(e, { height: +e.target.value })}
        />
      </Item>

      <Item label="背景颜色:">
        <InputColor
          className={styles.itemRight}
          color={canvas.content.style.backgroundColor}
          onChangeComplete={(e) =>
            onCanvasStyleChange(e, {
              backgroundColor: `rgba(${Object.values(e.rgb).join(",")})`,
            })
          }
        />
      </Item>

      <Item label="背景图片:">
        <input
          className={styles.itemRight}
          value={canvas.content.style.backgroundImage}
          onChange={(e) =>
            onCanvasStyleChange(e, { backgroundImage: e.target.value })
          }
        />
      </Item>
    </div>
  );
};

export default EditCanvas;
