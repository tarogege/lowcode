import React from "react";

export type Style = React.CSSProperties;

export interface ICanvas {
  title: string;
  style: Style;
  cmps: Array<ICmpWithKey>;
}

export interface ICmp {
  style: Style;
  type: number;
  value: string;
  onClick?: string;
}

export interface ICmpWithKey extends ICmp {
  key: number;
}

export type editStoreStatus = {
  canvas: ICanvas;
};

export type addCmpFC = (cmp: ICmp) => void;
export type editStoreAction = {
  //   addCmp: addCmpFC;
};

export interface IEditStore extends editStoreStatus, editStoreAction {}
