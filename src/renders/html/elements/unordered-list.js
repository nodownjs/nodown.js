import { childrenMap } from "../render.js";

export default function createUnorderedList(obj) {
  const content = childrenMap(obj.children);
  const ul = `<ul class="nodown-unordered-list">${content}</ul>`;
  return ul;
}
