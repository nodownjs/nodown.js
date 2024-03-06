import { childrenMap } from "../render.js";

export default function createFootnoteList(obj) {
  const content = childrenMap(obj.children);
  const ol = `<ol>${content}</ol>`;
  return ol;
}
