import renderToHTML from "../render";

export default function createFrenchQuotationMark(obj) {
  const text = document.createElement("span");
  var open = document.createTextNode("« ");
  var close = document.createTextNode(" »");
  text.appendChild(open);
  text.innerHTML =
    text.innerHTML + obj.children.map((child) => renderToHTML(child)).join("");
  text.appendChild(close);
  return text;
}
