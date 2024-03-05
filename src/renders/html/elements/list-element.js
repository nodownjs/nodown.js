import { childrenMap } from "../render.js";

export default function createListElement(obj) {
  const content = childrenMap(obj.children);
  const li = `<li>${content}</li>`;
  return li;
}
