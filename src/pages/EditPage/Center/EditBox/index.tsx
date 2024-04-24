import useEditStore, {
  updateAssemblyCmpsByDistance,
} from "src/store/editStore";
import styles from "./index.module.less";
import StretchDots from "./StrechDots.tsx";
import useZoomStore from "src/store/zoomStore.ts";
import throttle from "lodash";

const EditBox = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const [assembly, cmps] = useEditStore((state) => [
    state.assembly,
    state.canvas.cmps,
  ]);

  const size = assembly.size;
  if (size === 0) {
    return null;
  }

  let top = 9999;
  let left = 9999;
  let bottom = -9999;
  let right = -9999;

  assembly.forEach((index) => {
    const cmp = cmps[index];
    top = Math.min(top, cmp.style.top);
    left = Math.min(left, cmp.style.left);
    bottom = Math.max(bottom, cmp.style.top + cmp.style.height);
    right = Math.max(right, cmp.style.left + cmp.style.width);
  });

  const width = right - left + 8;
  const height = bottom - top + 8;

  top -= 4;
  left -= 4;

  const handleMoveCmp = (e) => {
    let x = e.pageX;
    let y = e.pageY;

    const move = throttle((ev) => {
      const cx = ev.pageX;
      const cy = ev.pageY;

      const disX = cx - x;
      const disY = cy - y;

      updateAssemblyCmpsByDistance({ top: disY, left: disX });

      x = cx;
      y = cy;

      console.log(disX, disY, "moveeee");
    }, 50);

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  return (
    <div
      className={styles.main}
      style={{ top, left, width, height }}
      onMouseDown={handleMoveCmp}
    >
      <StretchDots zoom={zoom} style={{ width, height }} />
    </div>
  );
};

export default EditBox;
