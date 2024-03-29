import { childrenMap } from "../render.js";

export default function createBold(obj) {
  const content = childrenMap(obj.children);
  const strong = `<strong class="nodown-strong">${content}</strong>`;
  return strong;
}
