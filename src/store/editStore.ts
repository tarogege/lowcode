import { create } from "zustand";
import {
  ICanvas,
  ICmp,
  editStoreAction,
  editStoreStatus,
} from "./editStoreType";
import { immer } from "zustand/middleware/immer";
import { getOnlyKey } from "src/utils";

const useEditStore = create<editStoreStatus & editStoreAction>()(
  immer((set) => ({
    canvas: getDefaultCanvas(),
  }))
);

export const addCmp = (_cmp: ICmp) => {
  useEditStore.setState((draft) => {
    draft.canvas.cmps.push({ ..._cmp, key: getOnlyKey() });
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
