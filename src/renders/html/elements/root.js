import { childrenMap, options } from "../render.js";

export default function createRoot(obj) {
  const div = document.createElement("div");
  const customId = options?.root?.customId ?? "nodown-render";
  div.id = customId;
  div.innerHTML = childrenMap(obj.children);
  return div;
}
