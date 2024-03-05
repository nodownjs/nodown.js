import { childrenMap } from "../render.js";

export default function createSection(obj) {
  const content = childrenMap(obj.children);
  const section = `<section>${content}</section>`;
  return section;
}
