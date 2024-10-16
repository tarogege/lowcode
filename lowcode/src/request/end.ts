import axios from "./axios";
// export const end = "//www.bubucuo.cn";
export const end = ""; //"//template.josephxia.com";

// 注册 post
export const registerEnd = end + "/api/auth/register";

// 用户信息
export const getUserInfo = end + "/api/auth";
export const loginEnd = end + "/api/auth/login";
export const logoutEnd = end + "/api/logout";

// 画布信息
// 根据id获取画布信息
export const getCanvasByIdEnd = end + "/api/web/content/get?id=";
// 保存画布
export const saveCanvasEnd = end + "/api/web/content/save";
// 删除画布
export const deleteCanvasByIdEnd = end + "/api/web/content/delete";

// 画布列表
export const getCanvasListEnd = end + "/api/web/content/list?pageSize=1000";
export const getTemplateListEnd = end + "/api/web/template/list?pageSize=1000";

// 发布、下架
export const publishEnd = end + "/api/web/content/publish";
export const unpublishEnd = end + "/api/web/content/unpublish ";

export const myAxios = axios;
