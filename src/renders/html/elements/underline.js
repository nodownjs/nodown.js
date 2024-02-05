import { childrenMap } from "../render.js";

export default function createUnderline(obj) {
  const u = document.createElement("u");
  u.innerHTML = childrenMap(obj.children);
  return u;
}
