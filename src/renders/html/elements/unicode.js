import renderToHTML from "../render.js";

export default function createUnicode(obj) {
  const char = document.createElement("span");
  const content = document.createElement("span");
  const code = document.createElement("code");
  code.classList.add("unicode");
  char.textContent = obj.char;
  char.classList.add("preview");
  content.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  code.appendChild(char);
  code.appendChild(content);
  return code;
}
