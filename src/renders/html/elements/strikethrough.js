import { childrenMap } from "../render.js";

export default function createStrikethrough(obj) {
  const content = childrenMap(obj.children);
  const del = `<del class="nodown-strikethrough">${content}</del>`;
  return del;
}
