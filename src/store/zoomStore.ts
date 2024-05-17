import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IReferenceX {
  key: string;
  top: number | string;
}

export interface IReferenceY {
  key: string;
  left: number | string;
}

export interface IZoomStoreStatus {
  zoom: number;
  referenceLinesX: Array<IReferenceX>;
  referenceLinesY: Array<IReferenceY>;
}

let referenceCount = 0;

const useZoomStore = create<IZoomStoreStatus>()(
  immer((set) => ({
    zoom: 100,
    referenceLinesX: [],
    referenceLinesY: [],
  }))
);

// 参考线相关操作
export const addReferenceLineX = () => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesX.push({
      key: "referenceLine" + referenceCount++,
      top: "50%",
    });
  });
};

export const setReferenceLineX = (idx: number, _top: number) => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesX[idx].top = _top;
  });
};

export const clearReferenceLineX = (_key: string) => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesX = draft.referenceLinesX.filter(
      (item) => item.key !== _key
    );
  });
};

export const addReferenceLineY = () => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesY.push({
      key: "referenceLine" + referenceCount++,
      left: "50%",
    });
  });
};

export const setReferenceLineY = (idx: number, _left: number) => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesY[idx].left = _left;
  });
};

export const clearReferenceLineY = (key: string) => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesY = draft.referenceLinesY.filter(
      (item) => item.key !== key
    );
  });
};

export const clearReferenceLines = () => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesX = [];
    draft.referenceLinesY = [];
  });
};

// zoom相关操作
// 缩小
export const zoomOut = () => {
  useZoomStore.setState((draft) => {
    const zoom = draft.zoom;
    if (zoom > 0) {
      if (zoom <= 25) {
        draft.zoom -= 1;
      } else {
        draft.zoom -= 25;
      }
    }
  });
};

// 扩大
export const zoomIn = () => {
  useZoomStore.setState((draft) => {
    draft.zoom += 25;
  });
};

export const setZoom = (newZoom: number) => {
  useZoomStore.setState((draft) => {
    draft.zoom = newZoom;
  });
};

export const resetZoom = () => {
  useZoomStore.setState((draft) => {
    draft.zoom = 100;
  });
};

export default useZoomStore;
