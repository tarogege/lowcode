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
