import { childrenMap } from "../render.js";

export default function createCode(obj) {
  const code = document.createElement("code");
  if (obj.formatted) {
    code.innerHTML = childrenMap(obj.children);
    return code;
  }
  code.textContent = childrenMap(obj.children);
  return code;
}
