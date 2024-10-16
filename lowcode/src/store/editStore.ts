import {
  defaultComponentStyle_0,
  isFormComponent,
  isGroupComponent,
} from "./../utils/const";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  EditStoreAction,
  EditStoreState,
  ICanvas,
  ICmp,
  ICmpWithKey,
  IContent,
  IEditStore,
  Style,
} from "./editStoreTypes";
import { computeBoxStyle, getOnlyKey, isCmpInView } from "../utils";
import Axios from "../request/axios";
import { getCanvasByIdEnd, saveCanvasEnd } from "../request/end";
import { resetZoom } from "./zoomStore";
import { recordCanvasHistory } from "./historySlice";
import { cloneDeep } from "lodash";

// 是否显示吸附线
const showDiff = 12;
// 是否自动调整到吸附线
const adjustDiff = 3;

const useEditStore = create(
  immer<EditStoreState & EditStoreAction>(() => ({
    canvas: getDefaultCanvas(),
    hasSavedCanvas: true,
    assembly: new Set(),
    canvasChangeHistory: [
      {
        canvas: getDefaultCanvas(),
        assembly: new Set(),
      },
    ],
    canvasChangeHistoryIndex: 0,
  }))
);

function getStoreFormKey(store: EditStoreState, cmp: any) {
  let { formKey } = cmp;
  if (cmp.type & isFormComponent && !formKey) {
    formKey = getOnlyKey();
    if (!store.canvas.content.formKeys) {
      store.canvas.content.formKeys = [];
    }

    store.canvas.content.formKeys.push(formKey);
  }

  return formKey;
}

function selectedCmpIndexSelector(store: IEditStore): number {
  const selectedCmpIndex = Array.from(store.assembly)[0];
  return selectedCmpIndex === undefined ? -1 : selectedCmpIndex;
}

export const addCmp = (_cmp: ICmp) => {
  useEditStore.setState((draft) => {
    // 1.区分是组合组件
    // 2.在这两种情况里，区分是否是表单组件
    if (_cmp.type & isGroupComponent) {
      addGroup(draft, _cmp);
      return;
    } else {
      draft.canvas.content.cmps.push({
        ..._cmp,
        key: getOnlyKey(),
        formKey: getStoreFormKey(draft, _cmp),
      });
    }

    draft.assembly = new Set([draft.canvas.content.cmps.length - 1]);
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

export function addGroup(store: IEditStore, group: any) {
  // 是group的情况目前只有一种，左侧菜单的form表单，参数结构见formSider
  // 构建父节点和子节点，确认他们之间的关系，push到新数组里
  const newCmps: Array<ICmpWithKey> = [];
  const { type, style, children } = group;
  const parentNode: ICmpWithKey = {
    key: getOnlyKey(),
    type,
    style,
    groupCmpKeys: [],
    formKey: getStoreFormKey(store, group),
  };
  children.forEach((child: ICmpWithKey) => {
    const newChild: ICmpWithKey = {
      ...child,
      style: {
        ...child.style,
        top: child.style.top + group.style.top,
        left: child.style.left + group.style.left,
      },
      key: getOnlyKey(),
      groupKey: parentNode.key,
      formKey: parentNode.formKey,
    };
    parentNode.groupCmpKeys!.push(newChild.key);
    newCmps.push(newChild);
  });
  newCmps.push(parentNode);
  store.canvas.content.cmps = store.canvas.content.cmps.concat(newCmps);
  store.assembly = new Set([store.canvas.content.cmps.length - 1]);
  store.hasSavedCanvas = false;
  recordCanvasHistory(store);
}

export const fetchCanvas = async (_id: number) => {
  const res: any = await Axios.get(getCanvasByIdEnd + _id);
  if (res) {
    useEditStore.setState((draft) => {
      draft.canvas.title = res.title;
      draft.canvas.type = res.type;
      draft.canvas.id = res.id;
      draft.canvas.content = JSON.parse(res.content);
      draft.assembly.clear();
      draft.canvasChangeHistory = [
        { canvas: draft.canvas, assembly: draft.assembly },
      ];
      draft.canvasChangeHistoryIndex = 0;
      draft.hasSavedCanvas = true;
    });

    resetZoom();
  }
};

export const addCanvasByTpl = (canvas: any) => {
  useEditStore.setState((draft) => {
    draft.canvas.title = canvas.title + "副本";
    draft.canvas.type = "content";
    draft.canvas.content = JSON.parse(canvas.content);
    draft.hasSavedCanvas = false;
  });
};

export const clearCanvas = () => {
  useEditStore.setState((draft) => {
    draft.canvas = getDefaultCanvas();
    draft.assembly.clear();
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
    resetZoom();
  });
};

export const saveCanvas = async (successCallback: any) => {
  const canvas = useEditStore.getState().canvas;
  const { id, type, title, content } = canvas;
  const isNew = id == null;
  const res: any = await Axios.post(saveCanvasEnd, {
    id,
    type,
    title,
    content: JSON.stringify(content),
  });
  successCallback?.(res?.id, isNew, res);

  useEditStore.setState((draft) => {
    draft.hasSavedCanvas = true;
    if (isNew) {
      draft.canvas.id = res.id;
    }
  });
};

// !选中组件
// 全选
export const setAllCmpsSelected = () => {
  useEditStore.setState((draft) => {
    // draft.assembly = new Set(Array.from({ length: len }, (a, b) => b));
    const cmps = draft.canvas.content.cmps;
    const len = cmps.length;
    const newAssembly: Set<number> = new Set();
    for (let i = 0; i < len; i++) {
      if (cmps[i].groupKey) {
        continue;
      }
      newAssembly.add(i);
    }
    draft.assembly = newAssembly;
  });
};

// 多选
export const setCmpsSelected = (indexes: Array<number>) => {
  useEditStore.setState((draft) => {
    if (
      draft.assembly.size === 1 &&
      draft.canvas.content.cmps[Array.from(draft.assembly)[0]].groupKey
    ) {
      // 如果原来选择了组合组件中的子组件，则取消选择
      draft.assembly = new Set();
    }
    indexes.forEach((index) => {
      if (draft.assembly.has(index)) {
        draft.assembly.delete(index);
      } else {
        draft.assembly.add(index);
      }
    });
  });
};

// 单选，-1取消选择
export const setCmpSelected = (index: number) => {
  useEditStore.setState((draft) => {
    if (index <= -1) {
      draft.assembly.clear();
    } else {
      draft.assembly = new Set([index]);
    }
  });
};

// !修改组件属性
export const updateAssemblyCmpStyle = (newStyle: Style, isAlign?: boolean) => {
  useEditStore.setState((draft) => {
    const cmps = draft.canvas.content.cmps;
    const map = getCmpsMap(cmps);
    const newAssembly: Set<number> = new Set();
    // 如果是组合组件
    // 1.找到每一个子组件 更新style
    // 2.更新父组件的style
    // 如果是单普通组件，更新对应的style
    draft.assembly.forEach((idx) => {
      const cmp = cmps[idx];
      if (cmp.type && cmp.type & isGroupComponent) {
        cmp.groupCmpKeys!.forEach((key) => {
          const childIdx = map.get(key);
          newAssembly.add(childIdx);
        });
      }
      newAssembly.add(idx);
    });

    newAssembly.forEach((idx) => {
      const selectedCmp = cmps[idx];
      let invalid = false;
      for (const key in newStyle) {
        if (
          (key === "width" || key === "height") &&
          (selectedCmp.style[key] as number) + (newStyle[key] as number) < 2
        ) {
          invalid = true;
          break;
        }

        // @ts-ignore
        selectedCmp.style[key] += newStyle[key];
      }

      // 检查自动调整，对齐
      if (draft.assembly.size === 1 && !selectedCmp.groupKey && isAlign) {
        // 对齐画布或者组件
        // 画布
        alignToCanvas(draft.canvas.content.style, selectedCmp);

        // 对齐单个组件
        // 这个时候画布和组件会相互影响。一般产品会做一个取舍，对齐画布还是组件
        cmps.forEach((cmp, cmpIndex) => {
          const inView = isCmpInView(cmp);

          // 如果选中的是组合组件，那么与它自己的子组件肯定不对齐
          // 如果是组合组件，不要和自己的子组件对齐
          if (
            selectedCmp.type & isGroupComponent &&
            selectedCmp.key === cmp.groupKey
          ) {
          } else if (cmpIndex !== idx && inView) {
            alignToCmp(cmp.style, selectedCmp, draft.canvas.content.style);
          }
        });
      }

      if (!invalid) {
        draft.canvas.content.cmps[idx] = selectedCmp;
      }

      // 移动或者拉伸单个子组件之后，父组件的宽高和位置也会发生变化
      // 重新计算组合组件的位置和宽高
      // 如果group变动，那么其相关子节点的位置也要发生变化
      if (newAssembly.size === 1 && selectedCmp.groupKey) {
        const groupIndex = map.get(selectedCmp.groupKey);
        const group = cmps[groupIndex];
        const _newAssembly: Set<number> = new Set();
        group.groupCmpKeys?.forEach((key: string) => {
          _newAssembly.add(map.get(key));
        });

        Object.assign(group.style, computeBoxStyle(cmps, _newAssembly));
      }
    });

    draft.canvas.content.cmps = cmps;
    draft.hasSavedCanvas = false;
  });
};

// !修改画布属性
export const updateCanvasStyle = (_style: Style) => {
  useEditStore.setState((draft) => {
    draft.canvas.content.style = { ...draft.canvas.content.style, ..._style };
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

export const updateCanvasTitle = (_title: string) => {
  useEditStore.setState((draft) => {
    draft.canvas.title = _title;
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

// !修改组件属性
export const updateSelectedCmpStyle = (
  _style: Style,
  isRecord: boolean = true
) => {
  useEditStore.setState((draft) => {
    Object.assign(
      draft.canvas.content.cmps[selectedCmpIndexSelector(draft)].style,
      _style
    );
    draft.hasSavedCanvas = false;
    if (isRecord) {
      recordCanvasHistory(draft);
    }
  });
};

export const updateSelectedCmpAttr = (name: string, value: string | object) => {
  useEditStore.setState((draft) => {
    const selectedIndex = selectedCmpIndexSelector(draft);
    if (typeof value === "object") {
      // @ts-ignore
      Object.assign(draft.canvas.content.cmps[selectedIndex][name], value);
    } else {
      // @ts-ignore
      draft.canvas.content.cmps[selectedIndex][name] = value;
    }

    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

// !组件与画布对齐
export const editAssemblyStyle = (_style: Style) => {
  useEditStore.setState((draft) => {
    draft.assembly.forEach((idx) => {
      const _s = draft.canvas.content.cmps[idx].style;
      if (_style.right === 0) {
        // @ts-ignore
        _s.left = draft.canvas.content.style.width - _s.width;
      } else if (_style.bottom === 0) {
        // @ts-ignore
        _s.top = draft.canvas.content.style.height - _s.height;
      } else if (_style.left === "center") {
        // @ts-ignore
        _s.left = (draft.canvas.content.style.width - _s.width) / 2;
      } else if (_style.top === "center") {
        // @ts-ignore
        _s.top = (draft.canvas.content.style.height - _s.height) / 2;
      } else {
        Object.assign(_s, _style);
      }

      draft.canvas.content.cmps[idx].style = _s;
      draft.hasSavedCanvas = false;
      recordCanvasHistory(draft);
    });
  });
};

// !右键菜单
// !删除组件
//  删除选中的组件
// 如果选中的是组合组件，则要把相关的子组件全部删除
// 如果选中的是组合子组件，则除了删除这个组件之外，还要更新父组合组件的 groupCmpKeys
export const deleteSelectedCmps = () => {
  useEditStore.setState((draft) => {
    let { cmps } = draft.canvas.content;
    const map = getCmpsMap(cmps);
    // newAssembly 会存储待删除的子组件、父组件、普通组件的下标等
    const newAssembly: Set<number> = new Set();

    draft.assembly.forEach((index) => {
      const cmp = cmps[index];
      if (cmp.type & isGroupComponent) {
        cmp.groupCmpKeys?.forEach((item) => {
          newAssembly.add(map.get(item));
        });
      }
      // 如果是group组件，最后添加
      newAssembly.add(index);
    });

    // ! 当删除单个组合组件的子节点之后，需要调整父组件的位置和宽高
    // 因为在删除单个之后，cmps index会发生变化，为了复用map和cmps，我们在这里先调整父组件的位置和宽高
    if (newAssembly.size === 1) {
      const child: ICmpWithKey = cmps[Array.from(newAssembly)[0]];
      // child是要被删除的组件，
      // 所以接下来要调整矩形，这个矩形的位置和宽高根据除child之外的组合子组件来计算
      if (child.groupKey) {
        const groupIndex = map.get(child.groupKey);
        const group = cmps[groupIndex];
        // 这个节点要删除，因此要寻找的是其它相关子组件的index
        const _newAssembly: Set<number> = new Set();
        group.groupCmpKeys?.forEach((key) => {
          if (key !== child.key) {
            _newAssembly.add(map.get(key));
          }
        });

        Object.assign(group.style, computeBoxStyle(cmps, _newAssembly));
      }
    }

    let hasFormDelete = false;
    // 删除节点
    cmps = cmps.filter((cmp, index) => {
      // 这个组件要被删除
      const del = newAssembly.has(index);
      if (del) {
        // 如果这个组件是组合子组件
        const groupKey = cmp.groupKey;

        if (groupKey) {
          const groupIndex = map.get(cmp.groupKey);
          // 如果父组件也要被删除，这里就不用管了，不然要更新下父组件的 groupCmpKeys
          if (!newAssembly.has(groupIndex)) {
            const group = cmps[groupIndex];
            const s = new Set(group.groupCmpKeys);
            s.delete(cmp.key);
            group.groupCmpKeys = Array.from(s);
          }
        }
      }

      if (cmp.type & isGroupComponent) {
        const { groupCmpKeys } = cmp;
        const len = groupCmpKeys!.length;
        if (len < 2) {
          // 如果只有一个子组件了，那么没必要再是组合组件了
          if (groupCmpKeys?.length === 1) {
            const singleCmpIndex = map.get(groupCmpKeys[0]);
            cmps[singleCmpIndex].groupKey = undefined;
          }
          return false;
        }
      }

      if (cmp.type & isFormComponent) {
        hasFormDelete = true;
      }

      return !del;
    });

    const newFormKeys: Set<string> = new Set();
    if (hasFormDelete) {
      cmps.forEach((cmp) => {
        if (cmp.formKey) {
          newFormKeys.add(cmp.formKey);
        }
      });
    }
    if (newFormKeys.size !== draft.canvas.content.formKeys?.length) {
      draft.canvas.content.formKeys = Array.from(newFormKeys);
    }

    draft.canvas.content.cmps = cmps;
    draft.hasSavedCanvas = false;
    draft.assembly.clear();
    recordCanvasHistory(draft);
  });
};

const _copyCmp = (cmp: ICmpWithKey): ICmpWithKey => {
  const newItem = cloneDeep(cmp);
  newItem.key = getOnlyKey();
  // @ts-ignore
  newItem.style.left += 40;
  // @ts-ignore
  newItem.style.top += 40;

  return newItem;
};

// 根据组合子组件index，返回父组件index
export const getCmpGroupIndex = (childIndex: number): undefined | number => {
  const store = useEditStore.getState();
  const cmps = store.canvas.content.cmps;
  const map = getCmpsMap(cmps);
  const groupIndex = map.get(cmps[childIndex].groupKey);
  return groupIndex;
};

// !复制组件
export const addAssemblyCmps = () => {
  useEditStore.setState((draft) => {
    const newCmps: Array<ICmpWithKey> = [];
    const cmps = draft.canvas.content.cmps;
    const map = getCmpsMap(cmps);
    const newAssembly: Set<number> = new Set();
    let i = cmps.length;

    draft.assembly.forEach((index) => {
      const cmp = cmps[index];
      const newCmp = _copyCmp(cmp);
      // 组合组件
      if (newCmp.type & isGroupComponent) {
        newCmp.groupCmpKeys = [];
        cmp.groupCmpKeys?.forEach((key) => {
          const childIndex = map.get(key);
          const child = cmps[childIndex];
          const newChild = _copyCmp(child);
          newChild.groupKey = newCmp.key;
          newCmp.groupCmpKeys?.push(newChild.key);
          newCmps.push(newChild);
          i++;
        });
      }

      newCmps.push(newCmp);
      newAssembly.add(i++);
    });

    draft.canvas.content.cmps = draft.canvas.content.cmps.concat(newCmps);
    draft.hasSavedCanvas = false;
    draft.assembly = newAssembly;
  });
};

// !移动组件层级
export const topZIndex = () => {
  useEditStore.setState((draft) => {
    const selectedIdx = selectedCmpIndexSelector(draft);
    const cmps = draft.canvas.content.cmps;
    const cmp = cmps[selectedIdx];

    if (cmp.type & isGroupComponent) {
      const cmps2 = [...cmps];
      const len = cmps.length;
      let m = 0,
        n = len - 1 - cmp.groupCmpKeys!.length;
      for (let i = len - 1; i >= 0; i--) {
        const innerCmp = cmps2[i];
        if (innerCmp.key === cmp.key) {
          // 父组件
          cmps[len - 1] = innerCmp;
        } else {
          if (innerCmp.groupKey === cmp.key) {
            cmps[n++] = innerCmp;
          } else {
            cmps[m++] = innerCmp;
          }
        }
      }
      draft.canvas.content.cmps = cmps;
    } else {
      if (selectedIdx === draft.canvas.content.cmps.length - 1) {
        return;
      }
      draft.canvas.content.cmps = draft.canvas.content.cmps
        .slice(0, selectedIdx)
        .concat(draft.canvas.content.cmps.slice(selectedIdx + 1))
        .concat([cmp]);
    }
    draft.assembly = new Set([draft.canvas.content.cmps.length - 1]);
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

export const bottomZIndex = () => {
  useEditStore.setState((draft) => {
    const selectedIdx = selectedCmpIndexSelector(draft);
    const cmps = draft.canvas.content.cmps;
    const cmp = cmps[selectedIdx];

    if (cmp.type & isGroupComponent) {
      const len = cmps.length;
      const cmps2 = [...cmps];
      let m = 0,
        n = cmp.groupCmpKeys!.length + 1;
      for (let i = 0; i < len; i++) {
        const innerCmp = cmps2[i];
        if (innerCmp.key === cmp.key) {
          cmps[cmp.groupCmpKeys!.length] = innerCmp;
        } else {
          // 不能直接通过groupKey是否存在来判断，因为可能会有多个组合组件
          if (innerCmp.groupKey === cmp.key) {
            cmps[m++] = innerCmp;
          } else {
            cmps[n++] = innerCmp;
          }
        }
      }
      draft.canvas.content.cmps = cmps;
      draft.assembly = new Set([cmp.groupCmpKeys!.length]);
    } else {
      if (selectedIdx === 0) {
        return;
      }
      draft.canvas.content.cmps = [cmp]
        .concat(draft.canvas.content.cmps.slice(0, selectedIdx))
        .concat(draft.canvas.content.cmps.slice(selectedIdx + 1));
      draft.assembly = new Set([0]);
    }
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

export const addZIndex = () => {
  useEditStore.setState((draft) => {
    const selectedIdx = selectedCmpIndexSelector(draft);
    if (selectedIdx === draft.canvas.content.cmps.length - 1) {
      return;
    }

    [
      draft.canvas.content.cmps[selectedIdx],
      draft.canvas.content.cmps[selectedIdx + 1],
    ] = [
      draft.canvas.content.cmps[selectedIdx + 1],
      draft.canvas.content.cmps[selectedIdx],
    ];

    draft.assembly = new Set([selectedIdx + 1]);
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

export const subZIndex = () => {
  useEditStore.setState((draft) => {
    const selectedIdx = selectedCmpIndexSelector(draft);
    if (selectedIdx === 0) {
      return;
    }

    [
      draft.canvas.content.cmps[selectedIdx],
      draft.canvas.content.cmps[selectedIdx - 1],
    ] = [
      draft.canvas.content.cmps[selectedIdx - 1],
      draft.canvas.content.cmps[selectedIdx],
    ];

    draft.assembly = new Set([selectedIdx - 1]);
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

// !吸附线
// !对齐画布
export const alignToCanvas = (canvasStyle: Style, selectedCmp: ICmpWithKey) => {
  // 对齐x中轴
  autoAlign(
    (selectedCmp.style.top as number) +
      (selectedCmp.style.height as number) / 2 -
      (canvasStyle.height as number) / 2,
    "centerXLine",
    () => {
      selectedCmp.style.top = Math.abs(
        ((selectedCmp.style.height as number) -
          (canvasStyle.height as number)) /
          2
      );
    }
  );
  // 对齐y中轴
  autoAlign(
    (selectedCmp.style.left as number) +
      (selectedCmp.style.width as number) / 2 -
      (canvasStyle.width as number) / 2,
    "centerYLine",
    () => {
      selectedCmp.style.left = Math.abs(
        ((selectedCmp.style.width as number) - (canvasStyle.width as number)) /
          2
      );
    }
  );
  // 对齐top
  autoAlign(selectedCmp.style.top as number, "canvasLineTop", () => {
    selectedCmp.style.top = 0;
  });
  // 对齐bottom
  autoAlign(
    (canvasStyle.height as number) -
      (selectedCmp.style.top as number) -
      (selectedCmp.style.height as number),
    "canvasLineBottom",
    () => {
      selectedCmp.style.top =
        (canvasStyle.height as number) - (selectedCmp.style.height as number);
    }
  );
  // 对齐right
  autoAlign(
    (selectedCmp.style.left as number) +
      (selectedCmp.style.width as number) -
      (canvasStyle.width as number),
    "canvasLineRight",
    () => {
      selectedCmp.style.left =
        (canvasStyle.width as number) - (selectedCmp.style.width as number);
    }
  );
  // 对齐left
  autoAlign(selectedCmp.style.left as number, "canvasLineLeft", () => {
    selectedCmp.style.left = 0;
  });
};

// !组件与附近组件对齐
export const alignToCmp = (
  targetCmpStyle: Style,
  selectedCmp: ICmpWithKey,
  canvasStyle: Style
) => {
  // 被选中组件 / 目标组件
  // bottom top
  autoAlign(
    (targetCmpStyle.top as number) -
      (selectedCmp.style.top as number) -
      (selectedCmp.style.height as number),
    "lineTop",
    () => {
      selectedCmp.style.top =
        (targetCmpStyle.top as number) - (selectedCmp.style.height as number);
    },
    (domLine) => {
      domLine!.style.top = targetCmpStyle.top + "px";
      domLine!.style.left = 0 + "px";
      domLine!.style.width = canvasStyle.width + "px";
    }
  );
  // top top
  autoAlign(
    (selectedCmp.style.top as number) - (targetCmpStyle.top as number),
    "lineTop",
    () => {
      selectedCmp.style.top = targetCmpStyle.top;
    },
    (domLine) => {
      domLine!.style.top = targetCmpStyle.top + "px";
      domLine!.style.left = 0 + "px";
      domLine!.style.width = canvasStyle.width + "px";
    }
  );
  // bottom bottom
  autoAlign(
    (targetCmpStyle.top as number) +
      (targetCmpStyle.height as number) -
      (selectedCmp.style.top as number) -
      (selectedCmp.style.height as number),
    "lineBottom",
    () => {
      selectedCmp.style.top =
        (targetCmpStyle.top as number) +
        (targetCmpStyle.height as number) -
        (selectedCmp.style.height as number);
    },
    (domLine) => {
      domLine!.style.top =
        (targetCmpStyle.top as number) +
        (targetCmpStyle.height as number) +
        "px";
      domLine!.style.left = 0 + "px";
      domLine!.style.width = canvasStyle.width + "px";
    }
  );
  // top bottom
  autoAlign(
    (selectedCmp.style.top as number) -
      (targetCmpStyle.top as number) -
      (targetCmpStyle.height as number),
    "lineBottom",
    () => {
      selectedCmp.style.top =
        (targetCmpStyle.top as number) + (targetCmpStyle.height as number);
    },
    (domLine) => {
      domLine!.style.top =
        (targetCmpStyle.top as number) +
        (targetCmpStyle.height as number) +
        "px";
      domLine!.style.left = 0 + "px";
      domLine!.style.width = canvasStyle.width + "px";
    }
  );
  // right left
  autoAlign(
    (targetCmpStyle.left as number) -
      (selectedCmp.style.left as number) -
      (selectedCmp.style.width as number),
    "lineLeft",
    () => {
      selectedCmp.style.left =
        (targetCmpStyle.left as number) - (selectedCmp.style.width as number);
    },
    (domLine) => {
      domLine!.style.top = 0 + "px";
      domLine!.style.left = targetCmpStyle.left + "px";
      domLine!.style.height = canvasStyle.height + "px";
    }
  );
  // left left
  autoAlign(
    (selectedCmp.style.left as number) - (targetCmpStyle.left as number),
    "lineLeft",
    () => {
      selectedCmp.style.left = targetCmpStyle.left;
    },
    (domLine) => {
      domLine!.style.top = 0 + "px";
      domLine!.style.left = targetCmpStyle.left + "px";
      domLine!.style.height = canvasStyle.height + "px";
    }
  );
  // right right
  autoAlign(
    (targetCmpStyle.left as number) +
      (targetCmpStyle.width as number) -
      (selectedCmp.style.left as number) -
      (selectedCmp.style.width as number),
    "lineRight",
    () => {
      selectedCmp.style.left =
        (targetCmpStyle.left as number) +
        (targetCmpStyle.width as number) -
        (selectedCmp.style.width as number);
    },
    (domLine) => {
      domLine!.style.top = 0 + "px";
      domLine!.style.left =
        (targetCmpStyle.left as number) +
        (targetCmpStyle.width as number) +
        "px";
      domLine!.style.height = canvasStyle.height + "px";
    }
  );
  // left right
  autoAlign(
    (selectedCmp.style.left as number) -
      (targetCmpStyle.left as number) -
      (targetCmpStyle.width as number),
    "lineRight",
    () => {
      selectedCmp.style.left =
        (targetCmpStyle.left as number) + (targetCmpStyle.width as number);
    },
    (domLine) => {
      domLine!.style.top = 0 + "px";
      domLine!.style.left =
        (targetCmpStyle.left as number) +
        (targetCmpStyle.width as number) +
        "px";
      domLine!.style.height = canvasStyle.height + "px";
    }
  );
  // bottom xcenter
  autoAlign(
    (targetCmpStyle.top as number) +
      (targetCmpStyle.height as number) / 2 -
      (selectedCmp.style.top as number) -
      (selectedCmp.style.height as number),
    "lineX",
    () => {
      selectedCmp.style.top =
        (targetCmpStyle.top as number) +
        (targetCmpStyle.height as number) / 2 -
        (selectedCmp.style.height as number);
    },
    (domLine) => {
      domLine!.style.top =
        (targetCmpStyle.top as number) +
        (targetCmpStyle.height as number) / 2 +
        "px";
      domLine!.style.left = 0 + "px";
      domLine!.style.width = canvasStyle.width + "px";
    }
  );
  // top xcenter
  autoAlign(
    (selectedCmp.style.top as number) -
      (targetCmpStyle.top as number) -
      (targetCmpStyle.height as number) / 2,
    "lineX",
    () => {
      selectedCmp.style.top =
        (targetCmpStyle.top as number) + (targetCmpStyle.height as number) / 2;
    },
    (domLine) => {
      domLine!.style.top =
        (targetCmpStyle.top as number) +
        (targetCmpStyle.height as number) / 2 +
        "px";
      domLine!.style.left = 0 + "px";
      domLine!.style.width = canvasStyle.width + "px";
    }
  );
  // right ycenter
  autoAlign(
    (targetCmpStyle.left as number) +
      (targetCmpStyle.width as number) / 2 -
      (selectedCmp.style.left as number) -
      (selectedCmp.style.width as number),
    "lineY",
    () => {
      selectedCmp.style.left =
        (targetCmpStyle.left as number) +
        (targetCmpStyle.width as number) / 2 -
        (selectedCmp.style.width as number);
    },
    (domLine) => {
      domLine!.style.top = 0 + "px";
      domLine!.style.left =
        (targetCmpStyle.left as number) +
        (targetCmpStyle.width as number) / 2 +
        "px";
      domLine!.style.height = canvasStyle.height + "px";
    }
  );
  // left ycenter
  autoAlign(
    (selectedCmp.style.left as number) -
      (targetCmpStyle.left as number) -
      (targetCmpStyle.width as number) / 2,
    "lineY",
    () => {
      selectedCmp.style.left =
        (targetCmpStyle.left as number) + (targetCmpStyle.width as number) / 2;
    },
    (domLine) => {
      domLine!.style.top = 0 + "px";
      domLine!.style.left =
        (targetCmpStyle.left as number) +
        (targetCmpStyle.width as number) / 2 +
        "px";
      domLine!.style.height = canvasStyle.height + "px";
    }
  );
};

export const autoAlign = (
  distance: number,
  domLineId: string,
  align: () => void,
  adjustDomLine?: (domLine: HTMLElement | null) => void
) => {
  const _distance = Math.abs(distance);
  const domLine = document.getElementById(domLineId);
  if (_distance < showDiff) {
    domLine!.style.display = "block";
    adjustDomLine?.(domLine);
  }
  if (_distance < adjustDiff) {
    align();
  }
};

export const initCanvas = () => {
  useEditStore.setState((draft) => {
    draft.canvas = getDefaultCanvas();
    draft.assembly = new Set();
    draft.hasSavedCanvas = true;
    draft.canvasChangeHistory = [
      { canvas: draft.canvas, assembly: draft.assembly },
    ];
    draft.canvasChangeHistoryIndex = 0;
    resetZoom();
  });
};

// !组件组合
export const groupCmps = () => {
  useEditStore.setState((draft) => {
    let cmps = draft.canvas.content.cmps;
    const assembly = draft.assembly;
    const map = getCmpsMap(cmps);
    const { top, left, width, height } = computeBoxStyle(cmps, assembly);
    // 创建父组件
    const parent: ICmpWithKey = {
      key: getOnlyKey(),
      type: isGroupComponent,
      // @ts-ignore
      style: {
        ...defaultComponentStyle_0,
        top,
        left,
        width,
        height,
      },
      groupCmpKeys: [],
    };
    // 为所有的子组件加上父组件的key
    assembly.forEach((idx) => {
      const child = cmps[idx];
      // 如果已经是组合组件了
      if (child.type & isGroupComponent) {
        child.groupCmpKeys!.forEach((childKey) => {
          const childIdx = map.get(childKey);
          const innerChild = cmps[childIdx];
          innerChild.groupKey = parent.key;
          parent.groupCmpKeys!.push(innerChild.key);
          map.delete(innerChild.key);
        });
      } else {
        child.groupKey = parent.key;
        parent.groupCmpKeys!.push(child.key);
      }
    });

    // 删除老的组合组件
    cmps = cmps.filter(
      (cmp, idx) => !(cmp.type & isGroupComponent && assembly.has(idx))
    );
    // 选中父组件
    cmps.push(parent);
    draft.canvas.content.cmps = cmps;
    draft.assembly = new Set([cmps.length - 1]);
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

export const cancelGroupCmps = () => {
  useEditStore.setState((draft) => {
    // 取消子组件的groupKey
    // 删除父组件
    // 选中所有的子组件
    const cmps = draft.canvas.content.cmps;
    const map = getCmpsMap(cmps);
    const selectedCmpIndex = selectedCmpIndexSelector(draft);
    const selectedCmp = cmps[selectedCmpIndex];
    const newAssembly: Set<number> = new Set();
    selectedCmp.groupCmpKeys!.forEach((key) => {
      const idx = map.get(key);
      newAssembly.add(idx);
      const child = cmps[idx];
      child.groupKey = "";
    });

    draft.canvas.content.cmps = cmps
      .slice(0, selectedCmpIndex)
      .concat(cmps.slice(selectedCmpIndex + 1));
    draft.assembly = newAssembly;
    draft.hasSavedCanvas = false;
    recordCanvasHistory(draft);
  });
};

export const selectedSingleCmpSelector = (store: IEditStore) => {
  const selectedIdx = selectedCmpIndexSelector(store);
  const cmps = store.canvas.content.cmps;
  return selectedIdx > 0 ? cmps[selectedIdx] : null;
};

function getCmpsMap(cmps: Array<ICmpWithKey>) {
  const result = new Map();
  cmps.forEach((cmp, idx) => {
    result.set(cmp.key, idx);
  });
  return result;
}

function getDefaultCanvas(): ICanvas {
  return {
    id: null,
    title: "未命名",
    type: "content",
    content: getDefaultCanvasContent(),
  };
}

function getDefaultCanvasContent(): IContent {
  return {
    // 页面样式
    style: {
      width: 320,
      height: 568,
      backgroundColor: "#ffffff",
      backgroundImage: "",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    // 组件
    cmps: [],
  };
}

export default useEditStore;
