import { childrenMap } from "../render.js";

export default function createCode(obj) {
  const code = document.createElement("code");
  code.innerHTML = childrenMap(obj.children);
  return code;
}
