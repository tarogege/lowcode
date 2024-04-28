import useEditStore from "./editStore";
import { ICanvas, editStoreStatus } from "./editStoreType";

const maxCanvasHistory = 100;
export const recordCanvasChangeHistory = (draft: editStoreStatus) => {
  draft.canvasChangeHistory = draft.canvasChangeHistory.slice(
    0,
    draft.canvasChangeHistoryIndex + 1
  );

  draft.canvasChangeHistory.push({
    canvas: draft.canvas,
    assembly: draft.assembly,
  });
  draft.canvasChangeHistoryIndex += 1;

  if (draft.canvasChangeHistory.length > maxCanvasHistory) {
    draft.canvasChangeHistory.shift();
    draft.canvasChangeHistoryIndex -= 1;
  }
};

export const goPrevCanvasHistory = () => {
  useEditStore.setState((draft) => {
    console.log(draft.canvasChangeHistoryIndex, "iiii");
    if (draft.canvasChangeHistoryIndex <= 0) {
      return;
    }
    const newIndex = draft.canvasChangeHistoryIndex - 1;

    const snapshoot = draft.canvasChangeHistory[newIndex];
    draft.canvas = snapshoot.canvas;
    draft.assembly = snapshoot.assembly;
    draft.canvasChangeHistoryIndex = newIndex;
  });
};

export const goNextCanvasHistory = () => {
  useEditStore.setState((draft) => {
    if (
      draft.canvasChangeHistoryIndex >=
      draft.canvasChangeHistory.length - 1
    ) {
      return;
    }
    draft.canvasChangeHistoryIndex += 1;
    const snapshoot = draft.canvasChangeHistory[draft.canvasChangeHistoryIndex];
    draft.canvas = snapshoot.canvas;
    draft.assembly = snapshoot.assembly;
  });
};

export const recordCanvasChangeHistory_2 = () => {
  const store = useEditStore.getState();
  if (
    store.canvas ===
    store.canvasChangeHistory[store.canvasChangeHistoryIndex].canvas
  ) {
    return;
  }

  useEditStore.setState((draft) => {
    recordCanvasChangeHistory(draft);
  });
};
