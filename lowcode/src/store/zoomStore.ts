import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

let referenceCount = 0;
interface referenceLineX {
  key: string;
  top: number | string;
}

interface referenceLineY {
  key: string;
  left: number | string;
}

interface IZoomStore {
  zoom: number;
  referenceLinesX: Array<referenceLineX>;
  referenceLinesY: Array<referenceLineY>;
}

const useZoomStore = create(
  immer<IZoomStore>(() => ({
    zoom: 100,
    referenceLinesX: [],
    referenceLinesY: [],
  }))
);

export const zoomOut = () => {
  useZoomStore.setState((draft) => {
    draft.zoom += 25;
  });
};

export const zoomIn = () => {
  useZoomStore.setState((draft) => {
    if (draft.zoom > 0) {
      if (draft.zoom - 25 < 1) {
        draft.zoom -= 1;
      } else {
        draft.zoom -= 25;
      }
    }
  });
};

export const setZoom = (_zoom: number) => {
  useZoomStore.setState((draft) => {
    if (_zoom >= 1) {
      draft.zoom = _zoom;
    }
  });
};

export const resetZoom = () => {
  useZoomStore.setState((draft) => {
    draft.zoom = 100;
  });
};

export const addReferenceLineX = () => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesX.push({
      key: "referenceLine" + referenceCount++,
      top: "50%",
    });
  });
};
export const setReferenceLineX = (index: number, value: number) => {
  useZoomStore.setState((draft) => {
    const len = draft.referenceLinesX.length;
    if (len <= 0) {
      return;
    }
    draft.referenceLinesX[index].top = value;
  });
};
export const clearReferenceLineX = (index: number, key: string) => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesX = draft.referenceLinesX.filter((item, idx) => {
      return !(idx === index && item.key === key);
    });
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
export const setReferenceLineY = (index: number, value: number) => {
  useZoomStore.setState((draft) => {
    const len = draft.referenceLinesY.length;
    if (len <= 0) {
      return;
    }
    draft.referenceLinesY[index].left = value;
  });
};
export const clearReferenceLineY = (index: number, key: string) => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesY = draft.referenceLinesY.filter(
      (item, idx) => !(idx === index && item.key === key)
    );
  });
};

export const clearReferenceLines = () => {
  useZoomStore.setState((draft) => {
    draft.referenceLinesX = [];
    draft.referenceLinesY = [];
  });
};

export default useZoomStore;
