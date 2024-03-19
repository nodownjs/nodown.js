import { childrenMap } from "../render.js";

export default function createSectionFootnote(obj) {
  const id = `id="footnotes"`;
  const content = childrenMap(obj.children);
  const section = `<section class="nodown-section-footnote" ${id}>${content}</section>`;
  return section;
}
