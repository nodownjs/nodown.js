import { childrenMap } from "../render.js";

export default function createParagraph(obj) {
  const content = childrenMap(obj.children);
  const p = `<p>${content}</p>`;
  return p;
}
