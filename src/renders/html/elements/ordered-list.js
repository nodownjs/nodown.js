import { childrenMap } from "../render.js";

export default function createOrderedList(obj) {
  const ol = document.createElement("ol");
  if (!isNaN(obj.start) && obj.start > 1) ol.start = obj.start;
  ol.innerHTML = childrenMap(obj.children);
  return ol;
}
