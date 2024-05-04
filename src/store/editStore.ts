import { create } from "zustand";
import {
  ICanvas,
  ICmp,
  ICmpWithKey,
  IContent,
  Style,
  editStoreAction,
  editStoreStatus,
} from "./editStoreType";
import { immer } from "zustand/middleware/immer";
import { getOnlyKey } from "src/utils";
import Axios from "src/request/axios";
import { getCanvasByIdEnd, saveCanvasEnd } from "src/request/end";
import { resetZoom } from "./zoomStore";
import { recordCanvasChangeHistory } from "./historySlice";
import { cloneDeep } from "lodash";

const showDiff = 12;
const adjustDiff = 3;

const useEditStore = create<editStoreStatus & editStoreAction>()(
  immer((set) => ({
    canvas: getDefaultCanvas(),
    assembly: new Set(),
    canvasChangeHistory: [
      {
        canvas: getDefaultCanvas(),
        assembly: new Set(),
      },
    ],
    canvasChangeHistoryIndex: 0,
  }))
);

export const addCmp = (_cmp: ICmp) => {
  useEditStore.setState((draft) => {
    draft.canvas.content.cmps.push({ ..._cmp, key: getOnlyKey() });
    draft.assembly = new Set([draft.canvas.content.cmps.length - 1]);
    recordCanvasChangeHistory(draft);
  });
};

export const deleteAssembly = () => {
  useEditStore.setState((draft) => {
    draft.canvas.content.cmps = draft.canvas.content.cmps.filter(
      (cmp, idx) => !draft.assembly.has(idx)
    );
    draft.assembly.clear();
    recordCanvasChangeHistory(draft);
  });
};

export const addSelectCmp = () => {
  useEditStore.setState((draft) => {
    const newCmps: Array<ICmpWithKey> = [];
    const newAssembly: Set<number> = new Set();
    let len = draft.canvas.content.cmps.length;

    draft.assembly.forEach((idx) => {
      const cmp = cloneDeep(draft.canvas.content.cmps[idx]);
      cmp.key = getOnlyKey();
      cmp.style.left += 40;
      cmp.style.top += 40;
      newCmps.push(cmp);
      newAssembly.add(len++);
    });
    draft.assembly = newAssembly;
    draft.canvas.content.cmps = draft.canvas.content.cmps.concat(newCmps);
    recordCanvasChangeHistory(draft);
  });
};

export const clearCanvas = () => {
  useEditStore.setState((draft) => {
    draft.canvas.content = getDefaultCanvasContent();
    draft.assembly = new Set();
    recordCanvasChangeHistory(draft);
  });
  resetZoom();
};

export const saveCanvas = async (
  successCallback: (id: number, isNew: boolean) => void
) => {
  const canvas = useEditStore.getState().canvas;
  const isNew = !canvas.id;
  const res: any = await Axios.post(saveCanvasEnd, {
    id: canvas.id,
    type: canvas.type,
    title: canvas.title,
    content: JSON.stringify(canvas.content),
  });
  successCallback(res?.id, isNew);
  if (isNew) {
    useEditStore.setState((draft) => {
      draft.canvas.id = res.id;
    });
  }
};

export const fetchCanvas = async (id: number) => {
  const res: any = await Axios.get(getCanvasByIdEnd + id);
  if (res) {
    useEditStore.setState((draft) => {
      draft.canvas.content = JSON.parse(res.content);
      draft.canvas.title = res.title;
      draft.canvas.id = res.id;
      draft.canvas.type = res.type;
      draft.assembly.clear();
      draft.canvasChangeHistory = [
        {
          canvas: draft.canvas,
          assembly: draft.assembly,
        },
      ];
      draft.canvasChangeHistoryIndex = 0;
    });
  }
};

// !组件的选中与取消
// 选中所有组件
export const setAllCmpsSelected = () => {
  useEditStore.setState((draft) => {
    draft.assembly = new Set(
      Array.from({ length: draft.canvas.content.cmps.length }, (a, b) => b)
    );
  });
};

// 选中单个组件
export const setCmpSelected = (index: number) => {
  if (index === -1) {
    useEditStore.setState((draft) => {
      if (draft.assembly.size > 0) {
        draft.assembly.clear();
      }
    });
  } else {
    useEditStore.setState((draft) => {
      draft.assembly = new Set([index]);
    });
  }
};

// 选中多个组件
export const setCmpsSelected = (indexes: number[]) => {
  useEditStore.setState((draft) => {
    if (indexes) {
      indexes.forEach((index) => {
        if (draft.assembly.has(index)) {
          draft.assembly.delete(index);
        } else {
          draft.assembly.add(index);
        }
        // setCmpSelected(index);
      });
    }
  });
};

export const updateCanvasStyle = (newStyle: React.CSSProperties) => {
  useEditStore.setState((draft) => {
    Object.assign(draft.canvas.content.style, newStyle);
    recordCanvasChangeHistory(draft);
  });
};

// 移动选中组件
export const updateAssemblyCmpsByDistance = (
  newStyle: Style,
  autoAdjustment?: boolean
) => {
  useEditStore.setState((draft) => {
    draft.assembly.forEach((index) => {
      const cmp = { ...draft.canvas.content.cmps[index] };
      let invalid = false;
      for (let key in newStyle) {
        if (
          (key === "width" || key === "height") &&
          cmp.style[key] + newStyle[key] < 2
        ) {
          invalid = true;
          break;
        }
        cmp.style[key] += newStyle[key];
      }

      if (draft.assembly.size === 1 && autoAdjustment) {
        autoAlignToCanvas(draft.canvas.content.style, cmp);
      }

      if (!invalid) {
        draft.canvas.content.cmps[index] = cmp;
      }
    });
  });
};

// 对齐画布
// ?考虑放大缩小
function autoAlignToCanvas(targetStyle: Style, selectedCmp: ICmpWithKey) {
  // !对齐上 选中元素的定位已经是根据canvas的定位了
  autoAlign(selectedCmp.style.top, "canvasLineTop", () => {
    selectedCmp.style.top = 0;
  });
  // !对齐下
  autoAlign(
    targetStyle.height - (selectedCmp.style.top + selectedCmp.style.height),
    "canvasLineBottom",
    () => {
      selectedCmp.style.top = targetStyle.height - selectedCmp.style.height;
    }
  );
  // !对齐左
  autoAlign(selectedCmp.style.left, "canvasLineLeft", () => {
    selectedCmp.style.left = 0;
  });
  // !对齐右
  autoAlign(
    targetStyle.width - (selectedCmp.style.left + selectedCmp.style.width),
    "canvasLineRight",
    () => {
      selectedCmp.style.left = targetStyle.width - selectedCmp.style.width;
    }
  );
  // !对齐x中轴
  autoAlign(
    targetStyle.height / 2 -
      (selectedCmp.style.top + selectedCmp.style.height / 2),
    "centerXLine",
    () => {
      selectedCmp.style.top =
        (targetStyle.height - selectedCmp.style.height) / 2;
    }
  );
  // !对齐y中轴
  autoAlign(
    targetStyle.width / 2 -
      (selectedCmp.style.left + selectedCmp.style.width / 2),
    "centerYLine",
    () => {
      selectedCmp.style.left =
        (targetStyle.width - selectedCmp.style.width) / 2;
    }
  );
}

function autoAlign(_distance: number, lineId: string, align: () => void) {
  // show
  const distance = Math.abs(_distance);
  if (distance < showDiff) {
    const el = document.getElementById(lineId);
    console.log(lineId, el, "eeeeee");
    if (el) {
      el.style.display = "block";
    }
  }
  if (distance < adjustDiff) {
    align();
  }
}

export const updateSelectedCmpStyle = (_style: any) => {
  useEditStore.setState((draft) => {
    Object.assign(
      draft.canvas.content.cmps[Array.from(draft.assembly)[0]].style,
      _style
    );
    recordCanvasChangeHistory(draft);
  });
};

export const editAssembleCmpAlign = (_style: Style) => {
  useEditStore.setState((draft) => {
    const canvasStyle = draft.canvas.content.style;
    draft.assembly.forEach((idx) => {
      const _s = { ...draft.canvas.content.cmps[idx].style };
      if (_style.right === 0) {
        _s.left = canvasStyle.width - _s.width;
      } else if (_style.bottom === 0) {
        _s.top = canvasStyle.height - _s.height;
      } else if (_style.left === "center") {
        _s.left = (canvasStyle.width - _s.width) / 2;
      } else if (_style.top === "center") {
        _s.top = (canvasStyle.height - _s.height) / 2;
      } else {
        Object.assign(_s, _style);
      }

      draft.canvas.content.cmps[idx].style = _s;
    });
    recordCanvasChangeHistory(draft);
  });
};

export const updateSelectedCmpValue = (_value: string) => {
  useEditStore.setState((draft) => {
    draft.canvas.content.cmps[Array.from(draft.assembly)[0]].value = _value;
    recordCanvasChangeHistory(draft);
  });
};

// !修改组件层级
export const topZIndex = () => {
  useEditStore.setState((draft) => {
    const len = draft.canvas.content.cmps.length;
    const selectedIdx = Array.from(draft.assembly)[0];
    if (selectedIdx >= len - 1) {
      return;
    }
    const cmps = draft.canvas.content.cmps;
    draft.canvas.content.cmps = cmps
      .slice(0, selectedIdx)
      .concat(cmps.slice(selectedIdx + 1))
      .concat(cmps[selectedIdx]);
    draft.assembly = new Set([len - 1]);

    recordCanvasChangeHistory(draft);
  });
};

export const bottomZIndex = () => {
  useEditStore.setState((draft) => {
    const selectedIdx = Array.from(draft.assembly)[0];
    if (selectedIdx <= 0) {
      return;
    }
    const cmps = draft.canvas.content.cmps;
    draft.canvas.content.cmps = [cmps[selectedIdx]]
      .concat(cmps.slice(0, selectedIdx))
      .concat(cmps.slice(selectedIdx + 1));
    draft.assembly = new Set([0]);
    recordCanvasChangeHistory(draft);
  });
};

export const upZIndex = () => {
  useEditStore.setState((draft) => {
    const len = draft.canvas.content.cmps.length;
    const selectedIdx = Array.from(draft.assembly)[0];
    if (selectedIdx >= len - 1) {
      return;
    }
    [
      draft.canvas.content.cmps[selectedIdx],
      draft.canvas.content.cmps[selectedIdx + 1],
    ] = [
      draft.canvas.content.cmps[selectedIdx + 1],
      draft.canvas.content.cmps[selectedIdx],
    ];
    draft.assembly = new Set([selectedIdx + 1]);
    recordCanvasChangeHistory(draft);
  });
};

export const downZIndex = () => {
  useEditStore.setState((draft) => {
    const selectedIdx = Array.from(draft.assembly)[0];
    if (selectedIdx <= 0) {
      return;
    }
    [
      draft.canvas.content.cmps[selectedIdx - 1],
      draft.canvas.content.cmps[selectedIdx],
    ] = [
      draft.canvas.content.cmps[selectedIdx],
      draft.canvas.content.cmps[selectedIdx - 1],
    ];
    draft.assembly = new Set([selectedIdx - 1]);
    recordCanvasChangeHistory(draft);
  });
};

export function getDefaultCanvasContent(): IContent {
  return {
    style: {
      width: 320,
      height: 568,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    cmps: [],
  };
}

export function getDefaultCanvas(): ICanvas {
  return {
    id: null,
    title: "未命名",
    content: getDefaultCanvasContent(),
    type: "content",
  };
}

export default useEditStore;
