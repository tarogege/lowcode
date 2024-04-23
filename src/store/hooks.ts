import { useSearchParams } from "react-router-dom";

export const useUrlParams = (name: string) => {
  const [params] = useSearchParams();
  if (!name) return "";
  const value = params.get(name);
  return value;
};

export function useCanvasId(): number | null {
  const [params] = useSearchParams();
  let id: any = params.get("id");

  if (typeof id === "string") {
    id = parseInt(id);
  }

  return id;
}

// 页面 或者 模板，如果为空，则认为是模板
export function useCanvasType() {
  const [params] = useSearchParams();
  let type = params.get("type");

  return type || "content";
}
