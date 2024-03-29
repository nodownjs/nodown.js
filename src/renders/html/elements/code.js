import { childrenMap } from "../render";

export default function createCode(obj) {
  let content = childrenMap(obj.children);
  const code = `<code class="nodown-code">${content}</code>`;
  return code;
}
