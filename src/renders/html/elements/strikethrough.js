import { childrenMap } from "../render.js";

export default function createStrikethrough(obj) {
  const del = document.createElement("del");
  del.innerHTML = childrenMap(obj.children);
  return del;
}
