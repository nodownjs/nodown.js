import { childrenMap } from "../render.js";

export default function createRoot(obj) {
  const div = document.createElement("div");
  div.id = "nodown-render";
  div.innerHTML = childrenMap(obj.children);
  return div;
}
