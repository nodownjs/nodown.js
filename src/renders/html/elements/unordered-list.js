import renderToHTML from "../render.js";

export default function createUnorderedList(obj) {
  const ul = document.createElement("ul");
  ul.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return ul;
}
