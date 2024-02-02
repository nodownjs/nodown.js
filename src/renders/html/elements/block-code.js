import renderToHTML from "../render.js";

export default function createBlockCode(obj) {
  const pre = document.createElement("pre");
  pre.className = obj.language;
  const code = document.createElement("code");
  code.innerHTML = obj.children.map((child) => renderToHTML(child)).join("\n");
  pre.appendChild(code);
  return pre;
}
