import { childrenMap } from "../render.js";

export default function createSectionFootnote(obj) {
  const id = `id="footnotes"`;
  const content = childrenMap(obj.children);
  const section = `<section ${id}>${content}</section>`;
  return section;
}
