import axios from "axios";
import { hideLoading, showLoading } from "../store/globalStore";
import docCookies from "../utils/cookies";
import { message } from "antd";

const Axios = axios.create({
  timeout: 20000,
});

Axios.interceptors.request.use(
  (config) => {
    if (config.headers.globalLoading != false) {
      showLoading();
    }
    config.headers.Authorization = docCookies.getItem("sessionId") || "";
    return config;
  },
  (err) => {
    if (err.config.headers.globalLoading != false) {
      hideLoading();
    }
    Promise.reject(err);
  }
);

Axios.interceptors.response.use(
  (res) => {
    if (res.config.headers.globalLoading !== false) {
      hideLoading();
    }
    if (res.status === 200 || res.status === 201) {
      let code = res.data.code;
      if (code === 200) {
        return res.data.result;
      } else if (code === 401) {
        message.info("请先登录！");
      } else {
        message.warning(res.data.msg || "信息有误，失败！");
      }
    } else {
      message.warning(res.data.msg || "信息有误，失败！");
    }
  },
  (err) => {
    if (err.config.headers.globalLoading !== false) {
      hideLoading();
    }
    return Promise.reject(err);
  }
);

export default Axios;
