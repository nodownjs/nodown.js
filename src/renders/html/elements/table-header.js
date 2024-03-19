import { childrenMap } from "../render.js";

export default function createTableHeader(obj) {
  const content = childrenMap(obj.children);
  const align = obj.align === "default" ? "left" : obj.align;
  const th = `<th class="nodown-table-header" align="${align}">${content}</th>`;
  return th;
}
