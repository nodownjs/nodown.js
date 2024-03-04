import { childrenMap } from "../render.js";

export default function createUnderline(obj) {
  const content = childrenMap(obj.children);
  const u = `<u>${content}</u>`;
  return u;
}
