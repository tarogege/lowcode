import { useSearchParams } from "react-router-dom";

export const useCanvasId = () => {
  const [params] = useSearchParams();
  let id: any = params.get("id");

  if (typeof id === "string") {
    id = +id;
  }

  return id;
};

export const useCanvasType = () => {
  const [params] = useSearchParams();
  const type: any = params.get("type");
  return type || "content";
};
