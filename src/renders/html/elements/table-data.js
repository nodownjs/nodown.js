import renderToHTML from "../render.js";

export default function createTableData(obj) {
  const td = document.createElement("td");
  td.align = obj.align === "default" ? "left" : obj.align;
  td.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return td;
}
