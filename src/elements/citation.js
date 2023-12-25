import { citationAlertTypeRegExp, citationRegExp } from "../config.js";
import { convertToObject } from "./inline.js";

export function createCitationType(line) {
  const match = line.match(citationRegExp);
  let [_, type, content] = match;

  const citationType = {
    type: "",
  };

  if (!type && citationAlertTypeRegExp.test(content)) {
    type = content;
    content = "";
  } else if (!type) {
    type = "citation";
  }

  if (type) type = type.trim();

  switch (type) {
    case "[!WARNING]":
    case "[!IMPORTANT]":
    case "!":
      citationType.type = "alert";
      citationType.variant = "warning";
      break;
    case "[!NOTE]":
    case "i":
      citationType.type = "alert";
      citationType.variant = "info";
      break;
    case "?":
      citationType.type = "alert";
      citationType.variant = "question";
      break;
    case "+":
      citationType.type = "alert";
      citationType.variant = "success";
      break;
    case "-":
      citationType.type = "alert";
      citationType.variant = "error";
      break;
    case "citation":
      citationType.type = "citation";
      break;
  }

  if (citationType.type !== "citation") {
    citationType.title = convertToObject(content);
  } else {
    citationType.children = convertToObject(content);
  }
  return citationType;
}

export function createCitationContent(line) {
  const match = line.match(citationRegExp);
  let [_, __, content] = match;
  const citationContent = {
    type: "paragraph",
    children: convertToObject(content),
  };
  return citationContent;
}

export default function createCitation(config, content) {
  const citation = {
    ...config,
    children: [...content],
  };
  return citation;
}
