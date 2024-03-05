import { childrenMap } from "../render.js";

export default function createVar(obj) {
  const content = childrenMap(obj.children);
  const p = `<span>${content}</span>`;
  return p;
}
