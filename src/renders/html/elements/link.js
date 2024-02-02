import renderToHTML from "../render.js";

export default function createLink(obj) {
  const a = document.createElement("a");
  a.href = obj.href;
  if (obj.title) {
    a.title = obj.title;
  }
  let text = obj.children.map((child) => renderToHTML(child)).join("");
  if (obj.href.startsWith("#fnref-")) text = " " + text;
  if (text.trim() === "") text = obj.href;
  a.innerHTML = text;
  return a;
}
