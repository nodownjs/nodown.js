import renderToHTML from "../render.js";

export default function createColor(obj) {
  const color = document.createElement("span");
  const code = document.createElement("code");
  code.classList.add("color");
  color.setAttribute("style", "background-color: " + obj.color + " !important");
  color.style.display = "inline-block";
  color.style.marginRight = "0.375em";
  color.style.transform = "translateY(.1em)";
  const size = "1em";
  color.style.height = size;
  color.style.width = size;
  color.classList.add("preview");
  code.appendChild(color);
  code.innerHTML =
    code.innerHTML + obj.children.map((child) => renderToHTML(child)).join("");
  return code;
}
