import renderToHTML from "../render.js";

export default function createTableOfContents(obj) {
  const div = document.createElement("div");
  div.classList.add("table-of-contents");
  div.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return div;
}
