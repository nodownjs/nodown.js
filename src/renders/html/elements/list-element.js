import { childrenMap } from "../render.js";

export default function createListElement(obj) {
  const li = document.createElement("li");
  li.innerHTML = childrenMap(obj.children);
  return li;
}
