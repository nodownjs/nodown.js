import renderToHTML from "../render.js";

export default function createTableHeader(obj) {
  const th = document.createElement("th");
  th.align = obj.align === "default" ? "left" : obj.align;
  th.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return th;
}
