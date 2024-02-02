import renderToHTML from "../render.js";

export default function createSubDiv(obj) {
  const subDiv = document.createElement("div");
  subDiv.style.flex = "1 0 0%";
  if (obj.size !== undefined) {
    subDiv.style.flex = obj.size + " 0 0%";
    if (obj.size == 0) {
      subDiv.style.flex = " 0 1 auto";
      subDiv.style.maxWidth =
        "calc(" +
        (1 / obj.total) * 100 +
        "% - " +
        (obj.total - 1) / obj.total +
        "em)";
    }
  }
  if (obj.align) subDiv.style.textAlign = obj.align;
  subDiv.style.overflowY = "hidden";
  subDiv.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return subDiv;
}
