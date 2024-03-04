import { childrenMap } from "../render";

export default function createCode(obj) {
  const content = childrenMap(obj.children);
  const code = `<code>${content}</code>`;
  return code;
}
