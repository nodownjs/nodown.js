import { childrenMap } from "../render.js";

export default function createTableRow(obj) {
  const tr = document.createElement("tr");
  tr.innerHTML = childrenMap(obj.children);
  return tr;
}
