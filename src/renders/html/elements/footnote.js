import renderToHTML, { addFootnoteId } from "../render.js";

export default function createFootnote(obj) {
  const footnote = document.createElement("li");
  footnote.classList.add("footnote");
  footnote.id = "fn-" + obj.id;
  addFootnoteId(obj.id);
  const p = document.createElement("p");
  p.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  footnote.innerHTML = obj.children
    .map((child) => renderToHTML(child))
    .join("");
  return footnote;
}
