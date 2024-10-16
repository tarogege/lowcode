import {
  isFormComponent,
  isFormComponent_Button,
  isFormComponent_Input,
  isGroupComponent,
  isTextComponent,
} from "../../../utils/const";
import leftSideStyles from "./leftSide.module.less";
import {
  defaultComponentStyle_0,
  defaultComponentStyle,
} from "../../../utils/const";
import { loginEnd } from "../../../request/end";
import useEditStore, {
  addCmp,
  selectedSingleCmpSelector,
} from "../../../store/editStore";
import { useEffect, useState } from "react";
import Item from "../../../lib/Item";

const settings: any = [
  {
    // 既是表单组件也是组合组件
    type: isGroupComponent | isFormComponent,
    desc: "姓名",
    style: {
      ...defaultComponentStyle_0,
      width: 170,
      height: 30,
    },
    children: [
      {
        type: isTextComponent,
        key: "",
        value: "姓名",
        style: {
          ...defaultComponentStyle_0,
          width: 30,
          height: 30,
          borderRadius: "0%",
          borderStyle: "none",
          borderWidth: "0",
          borderColor: "#ffffff00",
          transform: 0,
          animationName: "",
          boxSizing: "border-box",
          lineHeight: "30px",
          fontSize: 12,
          fontWeight: "normal",
          textDecoration: "none",
          color: "#000",
          backgroundColor: "#ffffff00",
          textAlign: "left",
          wordSpacing: "10px",
        },
      },
      {
        // input
        type: isFormComponent_Input,
        formItemName: "name", // form item key
        inputType: "text",
        value: "",
        placeholder: "请输入",
        style: {
          ...defaultComponentStyle_0,
          left: 30,
          width: 140,
          height: 30,
          lineHeight: "30px",
          fontSize: 12,
          fontWeight: "normal",
          textDecoration: "none",
          color: "#000",
          backgroundColor: "#ffffff00",
          textAlign: "left",
          wordSpacing: "10px",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#000",
          boxSizing: "border-box",
        },
      },
    ],
  },
  {
    type: isGroupComponent | isFormComponent,
    desc: "密码",
    style: {
      ...defaultComponentStyle_0,
      width: 170,
      height: 30,
    },
    children: [
      {
        type: isTextComponent,
        key: "",
        value: "密码",
        style: {
          ...defaultComponentStyle_0,
          width: 30,
          height: 30,
          borderRadius: "0%",
          borderStyle: "none",
          borderWidth: "0",
          borderColor: "#ffffff00",
          transform: 0,
          animationName: "",
          boxSizing: "border-box",
          lineHeight: "30px",
          fontSize: 12,
          fontWeight: "normal",
          textDecoration: "none",
          color: "#000",
          backgroundColor: "#ffffff00",
          textAlign: "left",
          wordSpacing: "10px",
        },
      },
      {
        // input
        type: isFormComponent_Input,
        formItemName: "password", // form item key
        inputType: "password",
        value: "",
        placeholder: "请输入",
        style: {
          ...defaultComponentStyle_0,
          left: 30,
          width: 140,
          height: 30,
          lineHeight: "30px",
          fontSize: 12,
          fontWeight: "normal",
          textDecoration: "none",
          color: "#000",
          backgroundColor: "#ffffff00",
          textAlign: "left",
          wordSpacing: "10px",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#000",
          boxSizing: "border-box",
        },
      },
    ],
  },
  // 提交按钮
  {
    //  button
    type: isFormComponent_Button,
    formItemName: "submit",
    value: "提交",
    desc: "提交按钮",
    style: {
      ...defaultComponentStyle,
      width: 150,
      height: 60,
      lineHeight: "60px",
      textAlign: "center",
      backgroundColor: "blue",
      borderStyle: "none",
      borderWidth: "0",
      borderColor: "#ffffff00",
      borderRadius: 36,
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
    },
    onClick: {
      // post
      url: "http://template.codebus.tech" + loginEnd,
      afterSuccess: "pop", //url
      popMsg: "弹出提示语",
      link: "",
    },
  },
];

const FormSider = () => {
  const store = useEditStore();
  const { canvas } = store;
  const { formKeys } = canvas.content;
  const selectedCmp = selectedSingleCmpSelector(store);
  const [selectedFormKey, setSelectedFormKey] = useState(selectedCmp?.formKey);

  useEffect(() => {
    setSelectedFormKey(selectedCmp?.formKey);
  }, [selectedCmp?.formKey]);

  return (
    <div className={leftSideStyles.main}>
      <Item label="请选择表单:" labelStyle={{ color: "red", width: 90 }}>
        <select
          value={selectedFormKey}
          style={{ width: 180 }}
          onChange={(e) => {
            setSelectedFormKey(e.target.value);
          }}
        >
          <option value="">新建表单</option>
          {formKeys?.map((formKey: string) => (
            <option key={formKey} value={formKey}>
              {`form${formKey}`}
            </option>
          ))}
        </select>
      </Item>
      <ul className={leftSideStyles.box}>
        {settings.map((item: any) => (
          <li
            key={item.key}
            className={leftSideStyles.item}
            style={{
              height: 60,
              lineHeight: "60px",
            }}
            draggable={true}
            onClick={() => {
              addCmp({ ...item, formKey: selectedFormKey });
            }}
            onDragStart={(e) => {
              e.dataTransfer.setData(
                "drag-component",
                JSON.stringify({ ...item, formKey: selectedFormKey })
              );
            }}
          >
            {item.desc}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormSider;
