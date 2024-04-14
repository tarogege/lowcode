import { create } from "zustand";

interface IGlobalStore {
  loading: boolean;
}
const useGlobalStore = create<IGlobalStore>()(() => ({
  loading: false,
}));

export const showLoading = () => {
  useGlobalStore.setState({ loading: true });
};

export const hideLoading = () => {
  useGlobalStore.setState({ loading: false });
};

export default useGlobalStore;
