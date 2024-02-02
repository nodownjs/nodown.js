import renderToHTML from "../render.js";

export default function createCitation(obj) {
  const blockquote = document.createElement("blockquote");
  blockquote.innerHTML = obj.children
    .map((child) => renderToHTML(child))
    .join("");
  return blockquote;
}
