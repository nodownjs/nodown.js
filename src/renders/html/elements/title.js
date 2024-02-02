import renderToHTML from "../render.js";

export default function createTitle(obj) {
  const heading = document.createElement("h" + obj.level);
  heading.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  if (obj.id) heading.id = obj.id;
  return heading;
}
