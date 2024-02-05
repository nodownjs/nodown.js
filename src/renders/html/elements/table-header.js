import { childrenMap } from "../render.js";

export default function createTableHeader(obj) {
  const th = document.createElement("th");
  th.align = obj.align === "default" ? "left" : obj.align;
  th.innerHTML = childrenMap(obj.children);
  return th;
}
