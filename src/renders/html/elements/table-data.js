import { childrenMap } from "../render.js";

export default function createTableData(obj) {
  const td = document.createElement("td");
  td.align = obj.align === "default" ? "left" : obj.align;
  td.innerHTML = childrenMap(obj.children);
  return td;
}
