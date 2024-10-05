import React from "react";

export type Style = React.CSSProperties;

export interface IContent {
  style: Style;
  cmps: Array<ICmpWithKey>;
  formKeys?: Array<string>;
}
export interface ICanvas {
  id: number | null;
  title: string;
  type: "content" | "template";
  content: IContent;
}

export type ISubmit = {
  url: string;
  afterSuccess: "pop" | "url";
  popMsg: string;
  link: string;
};

export interface ICmp {
  type: number;
  style: Style;
  value?: string;
  onClick?: string | ISubmit;

  // 父组件的key
  groupKey?: string;
  // 子组件的key 数组
  groupCmpKeys?: Array<string>;

  // 表单组件
  // form item
  formItemName?: string;
  formKey?: string; // 标记form的key
  desc?: string;
  // input
  inputType?: string;
  placeholder?: string;
}

export interface ICmpWithKey extends ICmp {
  key: string;
}

export type EditStoreState = {
  canvas: ICanvas;
  assembly: Set<number>;
  canvasChangeHistory: Array<{ canvas: ICanvas; assembly: Set<number> }>;
  canvasChangeHistoryIndex: number;
  hasSavedCanvas: boolean;
};

export type AddCmpFC = (_cmp: ICmp) => void;

export type EditStoreAction = {
  //   addCmp: AddCmpFC;
};

export interface IEditStore extends EditStoreState, EditStoreAction {}
