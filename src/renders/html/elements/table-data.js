import { childrenMap } from "../render.js";

export default function createTableData(obj) {
  const content = childrenMap(obj.children);
  const align = obj.align === "default" ? "left" : obj.align;
  const td = `<td align="${align}">${content}</td>`;
  return td;
}
