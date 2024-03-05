import { childrenMap, options } from "../render.js";

export default function createRoot(obj) {
  const customId = options?.root?.customId ?? "nodown-render";
  const content = childrenMap(obj.children);
  const div = `<div id="${customId}">${content}</div>`;
  return div;
}
