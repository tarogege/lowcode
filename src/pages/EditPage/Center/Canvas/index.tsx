import useEditStore, { addCmp } from "src/store/editStore";
import styles from "./index.module.less";

const Canvas = () => {
  const { canvas } = useEditStore();
  const { cmps, style } = canvas;
  const onDrop = (e) => {
    console.log(e, "eee");
    // 获取拖拽项的数据
    let dragCmp = e.dataTransfer.getData("drag-cmp");
    if (!dragCmp) {
      return;
    }
    dragCmp = JSON.parse(dragCmp);

    // 获取拖拽项的位置
    // 鼠标相对于页面的位置
    const endX = e.pageX;
    const endY = e.pageY;
    const canvasDomPos = {
      top: 114,
      left: (document.body.clientWidth - style.width) / 2,
    };

    const disX = endX - canvasDomPos.left;
    const disY = endY - canvasDomPos.top;

    dragCmp.style.top = disY - dragCmp.style.height / 2;
    dragCmp.style.left = disX - dragCmp.style.width / 2;

    console.log(dragCmp, "cccc");

    addCmp(dragCmp);
  };

  const allowDraop = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className={styles.main}
      style={canvas.style}
      onDrop={onDrop}
      onDragOver={allowDraop}
    >
      {cmps.map((_cmp) => (
        <div key={_cmp.key} style={_cmp.style}>
          {_cmp.value}
        </div>
      ))}
    </div>
  );
};

export default Canvas;
