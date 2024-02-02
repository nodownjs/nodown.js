import renderToHTML from "../render.js";

export default function createSection(obj) {
  const section = document.createElement("section");
  section.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");

  return section;
}
