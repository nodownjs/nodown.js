import renderToHTML from "../render.js";

export default function createVar(obj) {
  const p = document.createElement("span");
  p.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return p;
}
