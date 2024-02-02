import renderToHTML from "../render.js";

export default function createSectionFootnote(obj) {
  const section = document.createElement("section");
  section.id = "footnotes";
  const divA = document.createElement("div");
  const divB = document.createElement("div");
  const list = document.createElement("ol");
  list.innerHTML = obj.children[0].children[0].children
    .map((child) => renderToHTML(child))
    .join("");
  divB.appendChild(list);
  divA.appendChild(divB);
  section.appendChild(divA);
  return section;
}
