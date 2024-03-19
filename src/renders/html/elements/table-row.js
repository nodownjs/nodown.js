import { childrenMap } from "../render.js";

export default function createTableRow(obj) {
  const content = childrenMap(obj.children);
  const tr = `<tr class="nodown-table-row">${content}</tr>`;
  return tr;
}
