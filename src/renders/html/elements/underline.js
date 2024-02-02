import renderToHTML from "../render.js";

export default function createUnderline(obj) {
  const u = document.createElement("u");
  u.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return u;
}
