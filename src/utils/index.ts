import { ICmpWithKey } from "src/store/editStoreType";

export function getOnlyKey() {
  return Math.random();
}

export const inView = (cmp: ICmpWithKey) => {
  return true;
};
