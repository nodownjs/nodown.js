import { childrenMap } from "../render";

export default function createTitle(obj) {
  let content = childrenMap(obj.children);
  const h = `h${obj.level}`;
  let id = "";
  if (obj.id) {
    id = ` id="${obj.id}"`;
    content = content.replace(/\s+$/, "");
  }
  const heading = `<${h}${id}>${content}</${h}>`;
  return heading;
}
