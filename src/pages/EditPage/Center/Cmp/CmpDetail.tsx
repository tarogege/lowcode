import { ICmpWithKey } from "src/store/editStoreType";

export const Text = (cmp: ICmpWithKey) => {
  return <>{cmp.value}</>;
};

export const Img = (cmp: ICmpWithKey) => {
  return <img src={cmp.value} alt="" />;
};
