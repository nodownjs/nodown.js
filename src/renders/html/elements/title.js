import { childrenMap } from "../render";

export default function createTitle(obj) {
  const content = childrenMap(obj.children);
  const h = `h${obj.level}`;
  let id = "";
  if (obj.id) id = ` id="${obj.id}"`;
  const heading = `<${h}${id}>${content}</${h}>`;
  return heading;
}
