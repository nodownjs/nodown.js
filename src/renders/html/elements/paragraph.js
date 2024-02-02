import renderToHTML from "../render.js";

export default function createParagraph(obj) {
  const p = document.createElement("p");
  p.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return p;
}
