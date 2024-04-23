import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IZoomStoreStatus {
  zoom: number;
}

const useZoomStore = create<IZoomStoreStatus>()(
  immer((set) => ({
    zoom: 100,
  }))
);

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
