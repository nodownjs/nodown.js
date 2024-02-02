import renderToHTML from "../render.js";

export default function createCode(obj) {
  const code = document.createElement("code");
  code.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return code;
}
