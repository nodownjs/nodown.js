import { childrenMap, recursiveRender } from "../render";

export default function createSubscript(obj) {
  const sub = document.createElement("sub");
  sub.innerHTML = childrenMap(obj.children, recursiveRender);
  return sub;
}
