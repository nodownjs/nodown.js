import { titleRegExp } from "../config.js";
import { convertToObject } from "./inline.js";


export default function createTitle(line) {
    const match = line.match(titleRegExp);
    const level = match[1].length;
    let content = match[2].trim();
    let id = null;
    const idRegExp = /(.*)(?:{#(.+)})$/g;
    const idMatch = idRegExp.exec(content) || null;
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
    // if (level == 2) addNewSection(":======");
    // const lastDiv = getLastDiv();
    // lastDiv.children.push(title);
  }