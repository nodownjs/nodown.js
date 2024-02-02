import renderToHTML from "../render.js";

export default function createStrikethrough(obj) {
  const del = document.createElement("del");
  del.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return del;
}
