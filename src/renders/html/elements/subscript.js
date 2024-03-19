import { childrenMap, recursiveRender } from "../render";

export default function createSubscript(obj) {
  const content = childrenMap(obj.children, recursiveRender);
  const sub = `<sub class="nodown-subscript">${content}</sub>`;
  return sub;
}
