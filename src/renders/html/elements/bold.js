import renderToHTML from "../render.js";

export default function createBold(obj) {
  const strong = document.createElement("strong");
  strong.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return strong;
}
