import { childrenMap } from "../render.js";

export default function createVar(obj) {
  const content = childrenMap(obj.children);
  const p = `<span class="nodown-var">${content}</span>`;
  return p;
}
