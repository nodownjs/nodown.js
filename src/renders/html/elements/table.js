import { childrenMap } from "../render.js";

export default function createTable(obj) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = childrenMap(obj.headers);
  tbody.innerHTML = childrenMap(obj.rows);
  thead.appendChild(tr);
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}
