import renderToHTML from "../render.js";

export default function createTable(obj) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = obj.headers.map((child) => renderToHTML(child)).join("");
  tbody.innerHTML = obj.rows.map((child) => renderToHTML(child)).join("");
  thead.appendChild(tr);
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}
