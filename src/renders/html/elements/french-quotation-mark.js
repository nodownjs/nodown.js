import { childrenMap } from "../render";

export default function createFrenchQuotationMark(obj) {
  const text = document.createElement("span");
  var open = document.createTextNode("« ");
  var close = document.createTextNode(" »");
  text.appendChild(open);
  text.innerHTML = text.innerHTML + childrenMap(obj.children);
  text.appendChild(close);
  return text;
}
