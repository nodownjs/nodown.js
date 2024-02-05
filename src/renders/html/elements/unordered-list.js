import { childrenMap } from "../render.js";

export default function createUnorderedList(obj) {
  const ul = document.createElement("ul");
  ul.innerHTML = childrenMap(obj.children);
  return ul;
}
