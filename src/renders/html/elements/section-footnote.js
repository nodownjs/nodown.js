import { childrenMap } from "../render.js";

export default function createSectionFootnote(obj) {
  const id = `id="footnotes"`;
  const content = childrenMap(obj.children[0].children[0].children);
  const list = `<ol>${content}</ol>`;
  const section = `<section ${id} ><div><div>${list}</div></div></section>`;
  return section;
}
