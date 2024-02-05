import { childrenMap } from "../render.js";

export default function createVar(obj) {
  const p = document.createElement("span");
  p.innerHTML = childrenMap(obj.children);
  return p;
}
