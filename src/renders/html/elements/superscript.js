import renderToHTML from "../render";

export default function createSuperscript(obj) {
  const sup = document.createElement("sup");
  sup.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return sup;
}
