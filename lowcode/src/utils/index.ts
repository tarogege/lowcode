import { ICmpWithKey } from "../store/editStoreTypes";

export function getOnlyKey() {
  return Math.ceil(Math.random() * 1000000000) + "";
}

export function isCmpInView(cmp: ICmpWithKey) {
  const element = document.getElementById("cmp" + cmp.key) as HTMLElement;

  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}

export const computeBoxStyle = (
  cmps: Array<ICmpWithKey>,
  assembly: Set<number>
) => {
  let top = 999999,
    left = 999999,
    right = -999999,
    bottom = -999999;

  assembly.forEach((selected) => {
    const cmp = cmps[selected];
    top = Math.min(cmp.style.top as number, top);
    left = Math.min(cmp.style.left as number, left);
    right = Math.max(
      (cmp.style.left as number) + (cmp.style.width as number),
      right
    );
    bottom = Math.max(
      (cmp.style.top as number) + (cmp.style.height as number),
      bottom
    );
  });

  const width = right - left;
  const height = bottom - top;

  return { top, left, width, height };
};
