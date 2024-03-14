import { addFootnoteId, childrenMap } from "../render.js";

export default function createFootnote(obj) {
  const footnoteClass = `class="nodown-footnote"`;
  const id = `id="fn-${obj.id}"`;
  addFootnoteId(obj.id);
  const content = childrenMap(obj.children);
  const footnote = `<li ${footnoteClass} ${id}>${content}</li>`;
  return footnote;
}
