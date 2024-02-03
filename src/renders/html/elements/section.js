import { childrenMap } from "../render.js";

export default function createSection(obj) {
  const section = document.createElement("section");
  section.innerHTML = childrenMap(obj.children);

  return section;
}
