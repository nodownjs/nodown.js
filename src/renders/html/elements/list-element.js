import renderToHTML from "../render.js";

export default function createListElement(obj) {
  const li = document.createElement("li");
  li.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return li;
}
