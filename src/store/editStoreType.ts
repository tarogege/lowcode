import React from "react";

export type Style = React.CSSProperties;

export interface ICanvas {
  title: string;
  id: number | null;
  content: IContent;
  type: "content" | "template";
}

export interface IContent {
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
  key: string;
}

export type editStoreStatus = {
  canvas: ICanvas;
  assembly: Set<number>;
  haveSavedCanvas: boolean;
  canvasChangeHistory: Array<{ canvas: ICanvas; assembly: Set<number> }>;
  canvasChangeHistoryIndex: number;
};

export type addCmpFC = (cmp: ICmp) => void;
export type editStoreAction = {
  //   addCmp: addCmpFC;
};

export interface IEditStore extends editStoreStatus, editStoreAction {}
