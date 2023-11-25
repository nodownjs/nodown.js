import { listRegExp } from "../config.js";
import { convertToObject } from "./inline.js";

export function createListElement(line) {
  const match = line.match(listRegExp);
  const checkRegExp = /^(?:\s*)(?:-|\*|(?:\d+\.?)+) (\[ \]|\[x\])(.+)/;
  const isTask = checkRegExp.exec(line);
  const listElementType = isTask ? "task-list-element" : "list-element";
  const content = match[3];

  if (isTask) {
    listItem.checked = isTask[1] === "[x]" ? true : false;
    listItem.children = convertToObject(isTask[2]);
  }

  const listElement = {
    type: listElementType,
    children: convertToObject(content),
  };

  return listElement;
}

export function createListConfig(line) {
  const match = line.match(listRegExp);
  const type = match[2] === "-" || match[2] === "*" ? "unordered" : "ordered";
  // Si commence a un certain nombre
  let start = null;
  if (type === "ordered") {
    start = 1;
    start = Math.round(match[2].slice(0,-1));
  }
  // Mis a jour du niveau
  let level = match[1].length;
  if (level % 2 == 1) level--; // Changement de niveau tout les deux espaces uniquement
  level = level / 2;

  return [type, level, start];
}

export default function createList(type) {
  const list = {
    type: type + "-list",
    children: [],
  };
  return list;
}
