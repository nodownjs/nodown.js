import { titleIdRegExp, titleRegExp } from "../config.js";
import { convertToObject } from "./inline.js";

export default function createTitle(line) {
  const match = line.match(titleRegExp);
  const level = match[1].length;
  let content = match[2].trim();
  let id = null;
  const idMatch = titleIdRegExp.exec(content) || null;
  if (idMatch) {
    content = idMatch[1];
    id = idMatch[2];
  }
  const title = {
    type: "title",
    level: level,
    children: convertToObject(content),
  };
  if (id) title.id = id;
  return title;
}
