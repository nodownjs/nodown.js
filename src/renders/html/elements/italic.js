import { childrenMap } from "../render.js";

export default function createItalic(obj) {
  const content = childrenMap(obj.children);
  const em = `<em class="nodown-emphasis">${content}</em>`;
  return em;
}
