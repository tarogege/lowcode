import { create } from "zustand";
import Axios from "../request/axios";
import { getUserInfo, loginEnd, logoutEnd } from "../request/end";
import docCookies from "../utils/cookies";

interface UserStoreState {
  isLogin: boolean;
  name: string;
}

const initialUserStore = { isLogin: false, name: "" };

const useUserStore = create<UserStoreState>(() => ({
  ...initialUserStore,
}));

export const login = async (values: any) => {
  let user = { ...initialUserStore };
  const res: any = await Axios.post(loginEnd, values);
  if (res) {
    user = { isLogin: true, name: res.name };
    docCookies.setItem("sessionId", res.sessionId);
  }
  console.log(res, user, " uuu");
  useUserStore.setState(() => user);
};

export const logout = async () => {
  const user = { ...initialUserStore };
  await Axios.post(logoutEnd);
  docCookies.removeItem("sessionId");
  useUserStore.setState(user);
};

export const fetchUserInfo = async () => {
  let user = { ...initialUserStore };

  const res: any = await Axios.get(getUserInfo);
  if (res) {
    user = { isLogin: true, name: res.name };
  }

  useUserStore.setState(() => user);
};

export default useUserStore;
