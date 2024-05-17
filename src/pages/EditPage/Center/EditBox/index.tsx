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
import { useEffect, useState } from "react";
import { recordCanvasChangeHistory_2 } from "src/store/historySlice.ts";
import Menu from "../Menu/index.tsx";
import AlignLines from "./AlignLines/index.tsx";
import Rotate from "./Rotate/index.tsx";

const EditBox = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const [assembly, cmps, canvasStyle] = useEditStore((state) => [
    state.assembly,
    state.canvas.content.cmps,
    state.canvas.content.style,
  ]);
  const [textAreaFocused, setTextAreaFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const size = assembly.size;

  useEffect(() => {
    if (size === 0) {
      setShowMenu(false);
    }
  }, [size]);

  useEffect(() => {
    setTextAreaFocused(false);
  }, [assembly]);

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

  const width = right - left + 4;
  const height = bottom - top + 4;

  top -= 2;
  left -= 2;

  // console.log(right, height, top, left, "edit box position");

  const handleMoveCmp = (e) => {
    let x = e.pageX;
    let y = e.pageY;

    const move = throttle((ev) => {
      const cx = ev.pageX;
      const cy = ev.pageY;

      const disX = (cx - x) * (100 / zoom);
      const disY = (cy - y) * (100 / zoom);

      updateAssemblyCmpsByDistance({ top: disY, left: disX }, true);

      x = cx;
      y = cy;
    }, 50);

    const up = () => {
      Array.from(document.getElementsByClassName("alignLine")).forEach((el) => {
        if (el) {
          (el as HTMLElement).style.display = "none";
        }
      });
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      recordCanvasChangeHistory_2();
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const transform = `rotate(${
    size === 1 ? cmps[Array.from(assembly)[0]].style.transform : 0
  }deg)`;

  return (
    <>
      {size === 1 && <AlignLines canvasStyle={canvasStyle} />}
      <div
        className={styles.main}
        style={{ top, left, width, height, zIndex: 99999, transform }}
        onMouseDown={handleMoveCmp}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(false);
        }}
        onDoubleClick={(e) => {
          setTextAreaFocused(true);
        }}
        onContextMenu={(e) => {
          setShowMenu(true);
        }}
      >
        {showMenu && <Menu style={{ left: width }} size={size} />}
        {size === 1 &&
          cmps[Array.from(assembly)[0]].type === isTxtCmp &&
          textAreaFocused && (
            <ReactTextareaAutosize
              value={cmps[Array.from(assembly)[0]].value}
              onChange={(e) => {
                updateSelectedCmpValue(e.target.value);
              }}
              style={{
                ...cmps[Array.from(assembly)[0]].style,
                top: 0,
                left: 0,
              }}
              onHeightChange={(height) => {
                updateSelectedCmpStyle({ height });
              }}
            />
          )}
        <StretchDots zoom={zoom} style={{ width, height }} />
        {size === 1 && (
          <Rotate zoom={zoom} selectedCmp={cmps[Array.from(assembly)[0]]} />
        )}
      </div>
    </>
  );
};

export default EditBox;
