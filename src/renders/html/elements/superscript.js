import { childrenMap } from "../render";

export default function createSuperscript(obj) {
  const content = childrenMap(obj.children);
  const sup = `<sup>${content}</sup>`;
  return sup;
}
