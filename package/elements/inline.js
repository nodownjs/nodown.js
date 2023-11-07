import {
  escapedCharConfig,
  escapedIdentifier,
  italicRegExp,
  boldRegExp,
  italicBoldRegExp,
  underlineRegExp,
  strikethroughRegExp,
  colorRegExp,
  subScriptRegExp,
  superScriptRegExp,
  codeRegExp,
  codeWithVarRegExp,
  frenchQuotationMarkRegExp,
  imageRegExp,
  linkRegExp,
} from "../config.js";

const inlineRegExpList = [
  {
    name: "image",
    regexp: imageRegExp,
  },
  {
    name: "link",
    regexp: linkRegExp,
  },
  {
    name: "italic",
    regexp: italicRegExp,
  },
  {
    name: "bold",
    regexp: boldRegExp,
  },
  {
    name: "strikethrough",
    regexp: strikethroughRegExp,
  },
  {
    name: "boldAndItalic",
    regexp: italicBoldRegExp,
  },
  {
    name: "underline",
    regexp: underlineRegExp,
  },
  {
    name: "color",
    regexp: colorRegExp,
  },
  {
    name: "french-quotation-mark",
    regexp: frenchQuotationMarkRegExp,
  },
  {
    name: "subscript",
    regexp: subScriptRegExp,
  },
  {
    name: "superscript",
    regexp: superScriptRegExp,
  },
  {
    name: "code",
    regexp: codeRegExp,
  },
  {
    name: "code-with-var",
    regexp: codeWithVarRegExp,
  },
];

function removeBackslash(text, variable) {
  if (
    text
      .toLowerCase()
      .includes(window.varList.map((m) => "<" + m.name.toLowerCase() + ">")) &&
    !variable
  ) {
    window.varList.forEach((m) => {
      const varRegExp = new RegExp("<" + m.name + ">", "gi");
      text = text.replace(varRegExp, m.content);
    });
  }
  const backSlashFixerRegExp = new RegExp(
    escapedIdentifier[0] +
      "(" +
      escapedCharConfig.map((c) => c.code).join("|") +
      ")" +
      escapedIdentifier[1],
    "g"
  );
  // return text;
  function fixEscapedChar(match, p1) {
    return escapedCharConfig.find((c) => c.code === p1).char;
  }
  return text.replace(backSlashFixerRegExp, fixEscapedChar);
}

function removeBackslashInCode(text) {
  // return text;
  const backSlashFixerRegExp = new RegExp(
    escapedIdentifier[0] +
      "(" +
      escapedCharConfig.map((c) => c.code).join("|") +
      ")" +
      escapedIdentifier[1],
    "g"
  );
  function fixEscapedChar(match, p1) {
    return "\\" + escapedCharConfig.find((c) => c.code === p1).char;
  }
  return text.replace(backSlashFixerRegExp, fixEscapedChar);
}

export function convertToObject(text) {
  let allMatches = inlineRegExpList.map((config) => ({ ...config }));

  allMatches = allMatches
    .map((config) => {
      const match = [...text.matchAll(config.regexp)][0];
      // if (match && match[1].trim() !== "") {
      if (match) {
        config.index = match.index;
        config.raw = match[0];
        config.group = [...match].filter((match, index) => index > 0);
      }
      return config;
    })
    .filter((a) => a.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (allMatches.length === 0) {
    return [
      {
        type: "text",
        children: removeBackslash(text),
      },
    ];
  }

  const match = allMatches[0];

  const textBefore = removeBackslash(text.substring(0, match.index));

  const textAfter = removeBackslash(
    text.substring(match.index + match.raw.length)
  );

  const obj = {};

  const result = [
    {
      type: "text",
      children: textBefore,
    },
    obj,
    ...convertToObject(textAfter),
  ];

  if (match.name === "image") {
    const [alt, width, height, render] = match.group[0]
      ? match.group[0].split(";")
      : "";
    const source = match.group[1];
    const title = match.group[2];
    if (width) obj.width = width;
    if (height) obj.height = height;
    if (render) obj.render = render;
    obj.type = "image";
    obj.title = title;
    obj.alt = alt;
    obj.source = source;
  } else if (match.name === "link") {
    obj.type = "link";
    obj.href = match.group[1];
    obj.title = match.group[2];
    obj.children = convertToObject(match.group[0].trim());
  } else if (match.name === "color") {
    obj.type = "color";
    obj.color = match.group[0];
    obj.children = convertToObject(match.group[0].trim());
  } else if (match.name === "code") {
    obj.type = "code";
    if (
      match.group[1] ===
      escapedIdentifier[0] + "&#96;" + escapedIdentifier[1]
    ) {
      match.group[0] = match.group[0] + "\\";
    }
    obj.children = removeBackslash(removeBackslashInCode(match.group[0]), true);
  } else if (match.name === "code-with-var") {
    obj.type = "code";
    if (match.group[1] === "&#96;") match.group[0] = match.group[0] + "\\";
    obj.children = removeBackslash(
      removeBackslashInCode(match.group[0]),
      false
    );
  } else {
    obj.type = match.name;
    obj.children = convertToObject(match.group[0]);
  }

  return result;
}
