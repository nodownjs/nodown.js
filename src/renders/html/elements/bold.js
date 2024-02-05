import { childrenMap } from "../render.js";

export default function createBold(obj) {
  const strong = document.createElement("strong");
  strong.innerHTML = childrenMap(obj.children);
  return strong;
}
