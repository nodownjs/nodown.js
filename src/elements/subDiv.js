import { subDivRegExp } from "../config.js";

export default function createSubDiv(line) {
  const [_, m, noGrow, grow] = subDivRegExp.exec(line);
  const div = {
    type: "sub-div",
    children: [],
  };
  if (noGrow) div.size = "0";
  if (grow) div.size = grow;
  switch (m) {
    case "===":
      div.align = "left";
      break;
    case ":===":
      div.align = "left";
      break;
    case "===:":
      div.align = "right";
      break;
    case ":===:":
      div.align = "center";
      break;
  }
  return div;
}
