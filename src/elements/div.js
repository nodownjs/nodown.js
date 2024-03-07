export default function createDiv(line) {
  const div = {
    type: "div",
    children: [
      {
        type: "sub-div",
        children: [],
      },
    ],
  };
  switch (line) {
    case "------":
      div.display = "block";
      div.align = "left";
      break;
    case ":------":
      div.display = "block";
      div.align = "left";
      break;
    case "------:":
      div.display = "block";
      div.align = "right";
      break;
    case "---:---":
      div.display = "block";
      div.align = "center";
      break;
    case "======":
      div.display = "inline";
      div.align = "left";
      break;
    case ":======":
      div.display = "inline";
      div.align = "left";
      break;
    case "======:":
      div.display = "inline";
      div.align = "right";
      break;
    case "===:===":
      div.display = "inline";
      div.align = "center";
      break;
    case ":======:":
      div.display = "inline";
      div.align = "space-between";
      break;
    case ":===:===:":
      div.display = "inline";
      div.align = "space-around";
      break;
    case "::===:===::":
      div.display = "inline";
      div.align = "space-evenly";
      break;
  }
  return div;
}
