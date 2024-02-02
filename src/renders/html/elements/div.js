import renderToHTML from "../render.js";

export default function createDiv(obj) {
  const div = document.createElement("div");
  div.innerHTML = obj.children
    .map((child) => renderToHTML({ ...child, total: obj.children.length }))
    .join("");
  const { display, align } = obj;
  if (display === "inline") {
    div.style.display = "flex";
    if (align) div.style.justifyContent = align;
  } else {
    if (align) div.style.textAlign = align;
  }
  return div;
}
