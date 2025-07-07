import { memo } from "react";
import { Button, Img, Input, Text } from "./CmpDetail";
import styles from "./index.module.css";
import axios from "axios";

// 组件类型
export const isTextComponent = 0b00000001; // 1
export const isImgComponent = 0b00000010; // 2
export const isGraphComponent = 0b00000011; // 3
export const isGroupComponent = 0b00001000; // 8

// 表单组件
export const isFormComponent_Input = 0b10000000; //128
export const isFormComponent_Button = 0b01000000; // 64
export const isFormComponent = isFormComponent_Input | isFormComponent_Button;

export type Style = any;
export interface ICmp {
  type: number;
  style: Style;
  value: string;
  onClick?: string;
}

export interface ICmpWithKey extends ICmp {
  key: number;
  // 表单组件
  formKey: string;
}

const fetch = async ({ url, afterSuccess, popMsg, link }: any, params: any) => {
  const res: any = await axios.post(url, params);
  if (res?.data?.code === 200) {
    // 成功
    if (afterSuccess === "pop") {
      // 弹窗提示
      alert(popMsg || res.data.msg);
    } else {
      // 跳转
      window.location.href = link;
    }
  } else {
    alert(res?.data?.msg || "error");
  }
};

const Cmp = memo(({ cmp, index }: { cmp: ICmpWithKey; index: number }) => {
  const { type, style, value, onClick, formKey } = cmp;

  const transform = `rotate(${style.transform}deg)`;

  const submit = () => {
    if (typeof onClick === "string") {
      window.location.href = onClick;
    } else if (typeof onClick === "object") {
      // form submit
      const params: any = {};

      const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
        `.input${formKey}`
      );

      inputs.forEach((input) => {
        const inputName = input.name;
        params[inputName] = input.value;
      });

      // 表单请求
      fetch(onClick, params);
    }
  };

  return (
    <div
      className={styles.main}
      style={{
        ...style,
        zIndex: index,
        transform,
        animationPlayState: "running",
      }}
      onClick={submit}
    >
      {type & isTextComponent && <Text value={value} />}
      {type & isImgComponent && <Img value={value} />}
      {/* 表单组件 */}
      {type & isFormComponent_Input && <Input {...cmp} />}
      {type & isFormComponent_Button && <Button {...cmp} />}
    </div>
  );
});

Cmp.displayName = "Cmp";

export default Cmp;
