import { childrenMap, recursiveRender } from "../render";

export default function createSubscript(obj) {
  const content = childrenMap(obj.children, recursiveRender);
  const sub = `<sub>${content}</sub>`;
  return sub;
}
