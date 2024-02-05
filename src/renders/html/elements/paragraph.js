import { childrenMap } from "../render.js";

export default function createParagraph(obj) {
  const p = document.createElement("p");
  p.innerHTML = childrenMap(obj.children);
  return p;
}
