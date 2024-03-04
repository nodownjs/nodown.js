import { childrenMap } from "../render.js";

export default function createOrderedList(obj) {
  const content = childrenMap(obj.children);
  const start =
    !isNaN(obj.start) && obj.start > 1 ? ` start="${obj.start}"` : "";
  const ol = `<ol ${start}>${content}</ol>`;
  return ol;
}
