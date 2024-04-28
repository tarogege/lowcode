import useEditStore, {
  updateAssemblyCmpsByDistance,
  updateSelectedCmpStyle,
  updateSelectedCmpValue,
} from "src/store/editStore";
import styles from "./index.module.less";
import StretchDots from "./StrechDots.tsx";
import useZoomStore from "src/store/zoomStore.ts";
import { throttle } from "lodash";
import { isTxtCmp } from "../../LeftSide/index.tsx";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useState } from "react";

const EditBox = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const [assembly, cmps] = useEditStore((state) => [
    state.assembly,
    state.canvas.cmps,
  ]);
  const [textAreaFocused, setTextAreaFocused] = useState(false);

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
      style={{ top, left, width, height, zIndex: 99999 }}
      onMouseDown={handleMoveCmp}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onDoubleClick={(e) => {
        setTextAreaFocused(true);
      }}
    >
      {size === 1 &&
        cmps[Array.from(assembly)[0]].type === isTxtCmp &&
        textAreaFocused && (
          <ReactTextareaAutosize
            value={cmps[Array.from(assembly)[0]].value}
            onChange={(e) => {
              console.log(e.target.value, "changeeee");
              updateSelectedCmpValue(e.target.value);
            }}
            style={{
              ...cmps[Array.from(assembly)[0]].style,
              top: 2,
              left: 2,
            }}
            onHeightChange={(height) => {
              updateSelectedCmpStyle({ height });
            }}
          />
        )}
      <StretchDots zoom={zoom} style={{ width, height }} />
    </div>
  );
};

export default EditBox;
