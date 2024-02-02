import renderToHTML from "../render.js";

export default function createTableRow(obj) {
  const tr = document.createElement("tr");
  tr.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return tr;
}
