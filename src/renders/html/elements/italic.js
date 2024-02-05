import { childrenMap } from "../render.js";

export default function createItalic(obj) {
  const em = document.createElement("em");
  em.innerHTML = childrenMap(obj.children);
  return em;
}
