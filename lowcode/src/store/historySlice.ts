import useEditStore from "./editStore";
import { EditStoreState } from "./editStoreTypes";

const maxCanvasHistorySetp = 100;

export const recordCanvasHistory = (draft: EditStoreState) => {
  draft.canvasChangeHistory = draft.canvasChangeHistory.slice(
    0,
    draft.canvasChangeHistoryIndex + 1
  );

  draft.canvasChangeHistory.push({
    canvas: draft.canvas,
    assembly: draft.assembly,
  });
  draft.canvasChangeHistoryIndex++;

  if (draft.canvasChangeHistoryIndex > maxCanvasHistorySetp) {
    draft.canvasChangeHistory.shift();
    draft.canvasChangeHistoryIndex--;
  }
};

export const goPrevCanvasHistory = () => {
  useEditStore.setState((draft) => {
    let newIdx = Math.max(draft.canvasChangeHistoryIndex - 1, 0);

    if (newIdx === draft.canvasChangeHistoryIndex) {
      return;
    }
    draft.canvas = draft.canvasChangeHistory[newIdx].canvas;
    draft.assembly = draft.canvasChangeHistory[newIdx].assembly;
    draft.canvasChangeHistoryIndex = newIdx;
  });
};

export const goNextCanvasHistory = () => {
  useEditStore.setState((draft) => {
    let newIdx = Math.min(
      draft.canvasChangeHistoryIndex + 1,
      draft.canvasChangeHistory.length - 1
    );

    if (newIdx === draft.canvasChangeHistoryIndex) {
      return;
    }
    draft.canvas = draft.canvasChangeHistory[newIdx].canvas;
    draft.assembly = draft.canvasChangeHistory[newIdx].assembly;
    draft.canvasChangeHistoryIndex = newIdx;
  });
};

export const recordCanvasHistory_2 = () => {
  useEditStore.setState((draft) => {
    if (
      draft.canvas ===
      draft.canvasChangeHistory[draft.canvasChangeHistoryIndex].canvas
    ) {
      return;
    }
    recordCanvasHistory(draft);
  });
};
