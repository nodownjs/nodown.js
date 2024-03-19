import { childrenMap } from "../render.js";

export default function createParagraph(obj) {
  const content = childrenMap(obj.children);
  const p = `<p class="nodown-paragraph">${content}</p>`;
  return p;
}
