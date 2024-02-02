import renderToHTML from "../render.js";

export default function createItalic(obj) {
  const em = document.createElement("em");
  em.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return em;
}
