import { childrenMap } from "../render.js";

export default function createTableOfContents(obj) {
  const div = document.createElement("div");
  div.classList.add("table-of-contents");
  div.innerHTML = childrenMap(obj.children);
  return div;
}
