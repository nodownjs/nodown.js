import { childrenMap } from "../render.js";

export default function createTableOfContents(obj) {
  const content = childrenMap(obj.children);
  const divClass = `class="nodown-table-of-contents"`;
  const div = `<div ${divClass}>${content}</div>`;
  return div;
}
