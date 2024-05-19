import Item from "src/lib/Item";
import styles from "./edit.module.less";
import InputColor from "src/lib/InputColor";
import { ICmpWithKey, Style } from "src/store/editStoreType";
import {
  editAssembleCmpAlign,
  updateSelectedCmpStyle,
  updateSelectedCmpValue,
} from "src/store/editStore";
import { isImgCmp, isTxtCmp } from "../LeftSide";
import { Button, Space } from "antd";

type Pair = { name: string; value: number | string };
const EditCmp = ({ cmp }: { cmp: ICmpWithKey }) => {
  const { value, style, type } = cmp;
  const updateStyle = (e, _pair: Pair | Array<Pair>) => {
    const pair: Array<Pair> = Array.isArray(_pair) ? _pair : [_pair];
    const newStyle: any = {};
    pair.forEach((_item) => {
      newStyle[_item.name] = _item.value;
    });
    updateSelectedCmpStyle(newStyle);
  };
  const handleAnimationStyleChange = (e, { value }: Pair) => {
    console.log("1231231");
    const newStyle: Style = {
      animationName: value as string,
      animationDuration: style.animationDuration || "1s",
      animationDelay: style.animationDelay || "0",
      animationPlayState: "running",
      animationIterationCount: style.animationIterationCount || "infinite",
    };
    updateSelectedCmpStyle(newStyle);
  };

  return (
    <div className={styles.main}>
      <div className={styles.title}>组件属性</div>
      {type === isImgCmp && (
        <Item label="描述">
          <input
            className={styles.itemRight}
            value={value}
            onChange={(e) => {
              updateSelectedCmpValue(e.target.value);
            }}
          />
        </Item>
      )}
      {style.fontSize !== undefined && (
        <Item label="字体大小">
          <input
            value={style.fontSize}
            className={styles.itemRight}
            onChange={(e) => {
              const value = +e.target.value || 0;
              updateStyle(e, {
                name: "fontSize",
                value,
              });
            }}
          />
        </Item>
      )}
      {style.fontWeight !== undefined && (
        <Item label="字体粗细">
          <select
            value={style.fontWeight}
            className={styles.itemRight}
            onChange={(e) => {
              updateStyle(e, { name: "fontWeight", value: e.target.value });
            }}
          >
            <option value="normal">normal</option>
            <option value="bold">bold</option>
            <option value="lighter">lighter</option>
          </select>
        </Item>
      )}
      {style.lineHeight !== undefined && (
        <Item label="行高">
          <input
            value={style.lineHeight}
            className={styles.itemRight}
            onChange={(e) => {
              const value = +e.target.value || 0;
              updateStyle(e, {
                name: "lineHeight",
                value: value,
              });
            }}
          />
        </Item>
      )}
      {cmp.type === isTxtCmp && (
        <Item
          label="装饰线: "
          tips="如果设置完还是看不到装饰线，调整下行高试试~"
        >
          <select
            className={styles.itemRight}
            value={style.textDecoration || "none"}
            onChange={(e) => {
              updateStyle(e, {
                name: "textDecoration",
                value: e.target.value,
              });
            }}
          >
            <option value="none">无</option>
            <option value="underline">下划线</option>
            <option value="overline">上划线</option>
            <option value="line-through">删除线</option>
          </select>
        </Item>
      )}
      {style.textAlign !== undefined && (
        <Item label="对齐: ">
          <select
            className={styles.itemRight}
            value={style.textAlign}
            onChange={(e) => {
              updateStyle(e, {
                name: "textAlign",
                value: e.target.value,
              });
            }}
          >
            <option value="left">居左</option>
            <option value="center">居中</option>
            <option value="right">居右</option>
          </select>
        </Item>
      )}
      <Item label="对齐页面">
        <select
          className={styles.itemRight}
          onChange={(e) => {
            const align = e.target.value;
            let newStyle: Style = {};
            switch (align) {
              case "left":
                newStyle.left = 0;
                break;
              case "right":
                newStyle.right = 0;
                break;
              case "top":
                newStyle.top = 0;
                break;
              case "bottom":
                newStyle.bottom = 0;
                break;
              case "y-center":
                newStyle.top = "center";
                break;
              case "x-center":
                newStyle.left = "center";
            }
            editAssembleCmpAlign(newStyle);
          }}
        >
          <option>请选择对齐页面--</option>
          <option value="left">左对齐</option>
          <option value="right">右对齐</option>
          <option value="y-center">垂直居中</option>
          <option value="top">上对齐</option>
          <option value="bottom">下对齐</option>
          <option value="x-center">水平居中</option>
        </select>
      </Item>
      {cmp.style.transform && (
        <Item label="旋转">
          <input
            className={styles.itemRight}
            type="number"
            value={cmp.style.transform}
            onChange={(e) => {
              updateStyle(e, {
                name: "transform",
                value: e.target.value,
              });
            }}
          />
        </Item>
      )}
      {style.borderRadius !== undefined && (
        <Item label="圆角">
          <input
            className={styles.itemRight}
            value={style.borderRadius}
            onChange={(e) => {
              updateStyle(e, {
                name: "borderRadius",
                value: e.target.value,
              });
            }}
          />
        </Item>
      )}

      <Item label="边框样式">
        <select
          className={styles.itemRight}
          value={style.borderStyle}
          onChange={(e) => {
            updateStyle(e, {
              name: "borderStyle",
              value: e.target.value,
            });
          }}
        >
          <option value="none">none</option>
          <option value="dashed">dashed</option>
          <option value="dotted">dotted</option>
          <option value="double">double</option>
          <option value="groove">groove</option>
          <option value="hidden">hidden</option>
          <option value="solid">solid</option>
        </select>
      </Item>
      <Item label="边框宽度">
        <input
          className={styles.itemRight}
          value={cmp.style.borderWidth}
          type="number"
          onChange={(e) => {
            updateStyle(e, {
              name: "borderWidth",
              value: parseInt(e.target.value),
            });
          }}
        />
      </Item>
      <Item label="边框颜色">
        <InputColor
          className={styles.itemRight}
          color={cmp.style.borderColor || "#ffffff00"}
          onChangeComplete={(color: any, e: any) => {
            updateStyle(e, { name: "borderColor", value: color.hex });
          }}
        />
      </Item>
      {style.color !== undefined && (
        <Item label="字体颜色">
          <InputColor
            color={style.color}
            className={styles.itemRight}
            onChangeComplete={(color: any, e: any) => {
              updateStyle(e, { name: "color", value: color.hex });
            }}
          />
        </Item>
      )}
      {style.backgrounColor !== undefined && (
        <Item label="背景颜色">
          <InputColor
            color={style.backgrounColor}
            className={styles.itemRight}
            onChangeComplete={(color: any, e: any) => {
              updateStyle(e, { name: "backgrounColor", value: color.hex });
            }}
          />
        </Item>
      )}
      <Item label="点击跳转">
        <input className={styles.itemRight} />
      </Item>
      <Item label="动画名称">
        <select
          className={styles.itemRight}
          value={style.animationName || ""}
          onChange={(e) => {
            handleAnimationStyleChange(e, {
              name: "animationName",
              value: e.target.value,
            });
          }}
        >
          <option value="">无动画</option>
          <option value="jello">jello</option>
          <option value="toggle">toggle</option>
          <option value="shake">shake</option>
          <option value="wobble">wobble</option>
        </select>
      </Item>
      {style.animationName && (
        <>
          <Item label="动画持续时间(s)">
            <input
              className={styles.itemRight}
              type="number"
              value={parseInt(style.animationDuration)}
              onChange={(e) => {
                e.stopPropagation();
                updateStyle(e, {
                  name: "animationDuration",
                  value: parseInt(e.target.value) + "s",
                });
              }}
            />
          </Item>
          <Item label="动画持续次数" tips="999表示无数次">
            <input
              className={styles.itemRight}
              type="number"
              value={
                style.animationIterationCount === "infinite"
                  ? 999
                  : style.animationIterationCount
              }
              onChange={(e) => {
                updateStyle(e, {
                  name: "animationIterationCount",
                  value:
                    parseInt(e.target.value || 0) === 999 ? "infinite" : _value,
                });
              }}
            />
          </Item>
          <Item label="动画延迟时间(s)">
            <input
              className={styles.itemRight}
              type="number"
              value={parseInt(style.animationDelay)}
              onChange={(e) => {
                updateStyle(e, {
                  name: "animationDelay",
                  value: e.target.value + "s",
                });
              }}
            />
          </Item>
          <Item>
            <Space>
              <Button
                onClick={(e) => {
                  const _value = style.animationName as string;
                  updateStyle(e, { name: "animationName", value: "" });
                  setTimeout(() => {
                    updateStyle(e, [
                      { name: "animationName", value: _value },
                      { name: "animationPlayState", value: "running" },
                    ]);
                  }, 0);
                }}
              >
                重新演示动画
              </Button>
              <Button
                onClick={(e) => {
                  updateStyle(e, {
                    name: "animationPlayState",
                    value: "paused",
                  });
                }}
              >
                暂停动画
              </Button>
            </Space>
          </Item>
        </>
      )}
    </div>
  );
};

export default EditCmp;
