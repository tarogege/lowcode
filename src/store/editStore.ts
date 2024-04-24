import { create } from "zustand";
import {
  ICanvas,
  ICmp,
  Style,
  editStoreAction,
  editStoreStatus,
} from "./editStoreType";
import { immer } from "zustand/middleware/immer";
import { getOnlyKey } from "src/utils";
import Axios from "src/request/axios";
import { getCanvasByIdEnd, saveCanvasEnd } from "src/request/end";
import { resetZoom } from "./zoomStore";

const useEditStore = create<editStoreStatus & editStoreAction>()(
  immer((set) => ({
    canvas: getDefaultCanvas(),
    assembly: new Set(),
  }))
);

export const addCmp = (_cmp: ICmp) => {
  useEditStore.setState((draft) => {
    draft.canvas.cmps.push({ ..._cmp, key: getOnlyKey() });
  });
};

export const clearCanvas = () => {
  useEditStore.setState({
    canvas: getDefaultCanvas(),
    assembly: new Set(),
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
      if (draft.assembly.has(index)) {
        draft.assembly.delete(index);
      } else {
        draft.assembly = new Set([index]);
      }
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
