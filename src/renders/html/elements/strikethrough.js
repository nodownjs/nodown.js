import { childrenMap } from "../render.js";

export default function createStrikethrough(obj) {
  const content = childrenMap(obj.children);
  const del = `<del>${content}</del>`;
  return del;
}
