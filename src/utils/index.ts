import { ICmpWithKey } from "src/store/editStoreType";

export function getOnlyKey() {
  return Math.ceil(Math.random() * 1000000000) + "";
}

export const inView = (cmp: ICmpWithKey) => {
  return true;
};
