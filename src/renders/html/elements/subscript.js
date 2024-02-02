import renderToHTML from "../render";

export default function createSubscript(obj) {
  const sub = document.createElement("sub");
  sub.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return sub;
}
