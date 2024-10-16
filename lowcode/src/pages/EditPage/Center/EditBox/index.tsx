import React, { useEffect, useState } from "react";
import useEditStore, {
  setCmpSelected,
  updateAssemblyCmpStyle,
  updateSelectedCmpAttr,
  updateSelectedCmpStyle,
} from "../../../../store/editStore";
import useZoomStore from "../../../../store/zoomStore";
import StretchDots from "./StretchDots";
import styles from "./index.module.less";
import { throttle } from "lodash";
import TextareaAutosize from "react-textarea-autosize";
import { recordCanvasHistory_2 } from "../../../../store/historySlice";
import Menu from "../Menu";
import AlignLines from "./AlignLines";
import Rotate from "./Rotate";
import { isGroupComponent, isTextComponent } from "../../../../utils/const";
import EditBoxOfMultiCmps from "./EditBoxOfMultiCmps";

const EditBox = () => {
  const zoom = useZoomStore((state) => state.zoom);
  const [cmps, canvasStyle, assembly] = useEditStore((state) => [
    state.canvas.content.cmps,
    state.canvas.content.style,
    state.assembly,
  ]);
  const [textareaFocus, setTextareaFocus] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const size = assembly.size;
  const selectedIndex = Array.from(assembly)[0];

  useEffect(() => {
    setShowMenu(false);
  }, [selectedIndex]);

  if (size === 0) {
    return null;
  }

  //   !only for select single component
  const selectedCmp = cmps[selectedIndex];

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (textareaFocus) {
      return;
    }
    let startX = e.pageX,
      startY = e.pageY;

    const move = throttle((moveE) => {
      const nowX = moveE.pageX,
        nowY = moveE.pageY;

      const disX = ((nowX - startX) * 100) / zoom,
        disY = ((nowY - startY) * 100) / zoom;
      updateAssemblyCmpStyle({ left: disX, top: disY }, true);

      startX = nowX;
      startY = nowY;
    }, 50);
    const up = () => {
      recordCanvasHistory_2();
      //   鼠标抬起时，隐藏所有吸附线
      document.querySelectorAll(".alignLine").forEach((item) => {
        (item as any).style.display = "none";
      });
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const onDoubleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedCmp.type & isGroupComponent) {
      const canvasDomPos = {
        top: 114 + 1,
        left:
          document.body.clientWidth / 2 -
          (((canvasStyle.width as number) + 2) / 2) * (zoom / 100),
      };
      const relativePosition = {
        top: e.pageY - canvasDomPos.top,
        left: e.pageX - canvasDomPos.left,
      };
      const len = cmps.length;
      for (let i = len - 1; i >= 0; i--) {
        const cmp = cmps[i];
        if (cmp.groupKey !== selectedCmp.key) {
          continue;
        }
        const { top, left, width, height } = cmps[i].style;

        const right = (left as number) + (width as number),
          bottom = (top as number) + (height as number);
        if (
          relativePosition.top >= (top as number) &&
          relativePosition.top <= (bottom as number) &&
          relativePosition.left >= (left as number) &&
          relativePosition.left <= (right as number)
        ) {
          // 选中子节点
          setCmpSelected(i);
          return;
        }
      }
    } else if (selectedCmp.type & isTextComponent) {
      setTextareaFocus(true);
    }
  };

  let { top, left, width, height } = selectedCmp.style;
  // 边框加在外层
  // @ts-ignore
  width += 4;
  // @ts-ignore
  height += 4;
  // @ts-ignore
  top -= 2;
  // @ts-ignore
  left -= 2;

  const transform = `rotate(${
    size === 1 ? selectedCmp.style.transform : 0
  }deg)`;

  if (size > 1) {
    return (
      <EditBoxOfMultiCmps
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onMouseDownOfCmp={onMouseDown}
      />
    );
  }

  return (
    <>
      <AlignLines canvasStyle={canvasStyle} />
      <div
        className={styles.main}
        style={{ top, left, width, height, zIndex: 99999, transform }}
        onMouseDown={onMouseDown}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={onDoubleClick}
        onContextMenu={() => setShowMenu(true)}
        onMouseLeave={() => {
          setTextareaFocus(false);
          setShowMenu(false);
        }}
      >
        {showMenu && (
          <Menu
            style={{
              left: (width as number) - 2,
              transform: `rotate(${
                size === 1 ? -(selectedCmp.style.transform as any) : 0
              } deg)`,
              transformOrigin: "0% 0%",
            }}
            assemblySize={size}
            cmps={cmps}
            selectedIndex={selectedIndex}
          />
        )}
        {selectedCmp.type === isTextComponent && textareaFocus && (
          <TextareaAutosize
            value={selectedCmp.value}
            // @ts-ignore
            style={{ ...selectedCmp.style, top: 0, left: 0 }}
            onChange={(e) => {
              const newValue = e.target.value;
              updateSelectedCmpAttr("value", newValue);
            }}
            onBlur={() => {
              setTextareaFocus(false);
            }}
            onHeightChange={(height) => {
              updateSelectedCmpStyle({ height });
            }}
          />
        )}
        <StretchDots zoom={zoom} style={{ width, height }} />
        {selectedCmp.type !== isGroupComponent && (
          <Rotate selectedCmp={selectedCmp} zoom={zoom} />
        )}
      </div>
    </>
  );
};

export default EditBox;
