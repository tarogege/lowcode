export const isTxtCmp = 0b00000001; // 1
export const isImgCmp = 0b00000010; // 2
export const isGraphyCmp = 0b00000011; // 3
export const isGroupCmp = 0b00001000; // 8
export const isTplCmp = 0b00000100;

// 表单组件
export const isFormCmp_Input = 0b10000000; //128
export const isFormCmp_Button = 0b01000000; // 64
export const isFormCmp = isFormCmp_Input | isFormCmp_Button;

export const defaultComponentStyle_0 = {
  position: "absolute",
  top: 0,
  left: 0,
};

export const defaultComponentStyle = {
  ...defaultComponentStyle_0,
  width: 80,
  height: 80,
  borderRadius: "0%",
  borderStyle: "none",
  borderWidth: "0",
  borderColor: "#ffffff00",
  transform: 0,
  animationName: "",
  // ! 不让用户修改
  boxSizing: "border-box",
};
