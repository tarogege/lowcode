import { create } from "zustand";
import {
  ICanvas,
  ICmp,
  ICmpWithKey,
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
    draft.canvas.cmps.push({ ..._cmp, key: getOnlyKey() });
    draft.assembly = new Set([draft.canvas.cmps.length - 1]);
    recordCanvasChangeHistory(draft);
  });
};

export const deleteAssembly = () => {
  useEditStore.setState((draft) => {
    draft.canvas.cmps = draft.canvas.cmps.filter(
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
    let len = draft.canvas.cmps.length;

    draft.assembly.forEach((idx) => {
      const cmp = cloneDeep(draft.canvas.cmps[idx]);
      cmp.key = getOnlyKey();
      cmp.style.left += 40;
      cmp.style.top += 40;
      newCmps.push(cmp);
      newAssembly.add(len++);
    });
    draft.assembly = newAssembly;
    draft.canvas.cmps = draft.canvas.cmps.concat(newCmps);
    recordCanvasChangeHistory(draft);
  });
};

export const clearCanvas = () => {
  useEditStore.setState((draft) => {
    (draft.canvas = getDefaultCanvas()),
      (draft.assembly = new Set()),
      recordCanvasChangeHistory(draft);
  });
  resetZoom();
};

export const saveCanvas = async (
  id: number | null,
  type: string,
  successCallback: (id: number) => void
) => {
  const canvas = useEditStore.getState().canvas;
  const res: any = await Axios.post(saveCanvasEnd, {
    id,
    type,
    title: canvas.title,
    content: JSON.stringify(canvas),
  });
  successCallback(res?.id);
};

export const fetchCanvas = async (id: number) => {
  const res: any = await Axios.get(getCanvasByIdEnd + id);
  if (res) {
    useEditStore.setState((draft) => {
      draft.canvas = JSON.parse(res.content);
      draft.canvas.title = res.title;
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
      Array.from({ length: draft.canvas.cmps.length }, (a, b) => b)
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
    Object.assign(draft.canvas.style, newStyle);
    recordCanvasChangeHistory(draft);
  });
};

// 移动选中组件
export const updateAssemblyCmpsByDistance = (newStyle: Style) => {
  useEditStore.setState((draft) => {
    draft.assembly.forEach((index) => {
      const cmp = { ...draft.canvas.cmps[index] };
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

      if (!invalid) {
        draft.canvas.cmps[index] = cmp;
      }
    });
  });
};

export const updateSelectedCmpStyle = (_style: any) => {
  useEditStore.setState((draft) => {
    Object.assign(
      draft.canvas.cmps[Array.from(draft.assembly)[0]].style,
      _style
    );
    recordCanvasChangeHistory(draft);
  });
};

export const editAssembleCmpAlign = (_style: Style) => {
  useEditStore.setState((draft) => {
    const canvasStyle = draft.canvas.style;
    draft.assembly.forEach((idx) => {
      const _s = { ...draft.canvas.cmps[idx].style };
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

      draft.canvas.cmps[idx].style = _s;
    });
    recordCanvasChangeHistory(draft);
  });
};

export const updateSelectedCmpValue = (_value: string) => {
  useEditStore.setState((draft) => {
    draft.canvas.cmps[Array.from(draft.assembly)[0]].value = _value;
    recordCanvasChangeHistory(draft);
  });
};

export function getDefaultCanvas(): ICanvas {
  return {
    title: "未命名",
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

export default useEditStore;
