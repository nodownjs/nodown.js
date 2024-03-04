import { childrenMap } from "../render";

export default function createCode(obj) {
  let content = childrenMap(obj.children);
  if (!obj.formatted) {
    content = content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/&/g, "&amp;");
  }
  const code = `<code>${content}</code>`;
  return code;
}
