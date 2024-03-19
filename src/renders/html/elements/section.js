import { childrenMap } from "../render.js";

export default function createSection(obj) {
  const content = childrenMap(obj.children);
  const section = `<section class="nodown-section">${content}</section>`;
  return section;
}
