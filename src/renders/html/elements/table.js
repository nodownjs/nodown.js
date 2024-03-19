import { childrenMap } from "../render.js";

export default function createTable(obj) {
  const headers = childrenMap(obj.headers);
  const rows = childrenMap(obj.rows);
  const tr = `<tr class="nodown-table-row">${headers}</tr>`;
  const tbody = `<tbody>${rows}</tbody>`;
  const thead = `<thead>${tr}</thead>`;
  const table = `<table class="nodown-table">${thead}${tbody}</table>`;
  return table;
}
