import { childrenMap } from "../render.js";

export default function createFootnoteList(obj) {
  const content = childrenMap(obj.children);
  const ol = `<ol class="nodown-ordered-list nodown-footnote-list">${content}</ol>`;
  return ol;
}
