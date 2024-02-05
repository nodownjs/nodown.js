import { childrenMap } from "../render";

export default function createTitle(obj) {
  const heading = document.createElement("h" + obj.level);
  heading.innerHTML = childrenMap(obj.children);

  if (obj.id) heading.id = obj.id;
  return heading;
}
