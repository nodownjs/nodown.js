import {
  boldRegExp,
  codeRegExp,
  codeWithVarRegExp,
  colorRegExp,
  dateRegExp,
  escapedIdentifier,
  footnoteRefRegExp,
  frenchQuotationMarkRegExp,
  imageRegExp,
  italicBoldRegExp,
  italicRegExp,
  linkRegExp,
  standardLinkRegExp,
  strikethroughRegExp,
  subScriptRegExp,
  superScriptRegExp,
  underlineRegExp,
  unicodeRegExp,
} from "../config.js";
import {
  footnoteList,
  footnoteRefList,
  options,
  setFootnoteRefList,
  varList,
} from "../parser.js";
import { removeBackslash, removeBackslashInCode } from "../utils.js";
import createDate from "./date.js";

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
    name: "bold",
    regexp: boldRegExp,
  },
  {
    name: "italic",
    regexp: italicRegExp,
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
    name: "unicode",
    regexp: unicodeRegExp,
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
    name: "date",
    regexp: dateRegExp,
  },
  {
    name: "footnote-ref",
    regexp: footnoteRefRegExp,
  },
  {
    name: "standard-link",
    regexp: standardLinkRegExp,
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

// varList.forEach((var_) => {
//   const regexp = new RegExp("<" + var_.name + ">", "gi");
//   inlineRegExpList.push({
//     name: "var",
//     regexp: regexp,
//   });
// });

// if (
//   varList.some((m) =>
//     lowerCaseText.includes("<" + m.name.toLowerCase() + ">")
//   )
// ) {
//   for (let i = 0; i < varList.length; i++) {
//     const var_ = varList[i];
//     const varRegExp = new RegExp("<" + var_.name + ">", "gi");
//     text = text.replace(varRegExp, var_.content);
//   }
// }

export function convertToObject(text, exception) {
  // if (!options?.frenchQuotationMark?.enabled) {
  //   inlineRegExpList.splice(
  //     inlineRegExpList.findIndex((m) => m.name === "french-quotation-mark"),
  //     1
  //   );
  // }

  const isVar = inlineRegExpList.find((m) => m.name === "var");

  if (!isVar) {
    varList.forEach((var_) => {
      const regexp = new RegExp(
        "<(" + var_.name.replace(/-/g, "\\-") + ")>",
        "gi"
      );
      inlineRegExpList.push({
        name: "var",
        regexp: regexp,
      });
    });
  }

  let allMatches = inlineRegExpList
    .filter((m) => (options?.[m.name]?.disabled ?? false) !== true)
    .map((config) => ({ ...config }));

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
    .sort((a, b) => b.raw.length - a.raw.length)
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

  const obj = {};

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
    obj.source = removeBackslash(removeBackslashInCode(source));
  } else if (match.name === "link") {
    obj.type = "link";
    obj.href = removeBackslash(removeBackslashInCode(match.group[1]));
    obj.title = match.group[2];
    obj.children = convertToObject(match.group[0].trim());
  } else if (match.name === "color") {
    obj.type = "color";
    obj.color = match.group[0];
    obj.children = convertToObject(match.group[0].trim());
  } else if (match.name === "footnote-ref") {
    obj.type = "footnote-ref";
    const refID = match.group[0];
    const isLinked = footnoteList.find((f) => f.id === refID) ? true : false;
    if (!isLinked) {
      obj.raw = match.raw;
      obj.inactive = true;
    } else {
      let existingFootnoteRef =
        footnoteRefList.length > 0
          ? footnoteRefList.find((f) => f.refID === refID)
          : null;
      if (!existingFootnoteRef) {
        let newFootnoteRef = {
          index: footnoteRefList.length + 1 || 1,
          refID: refID,
          count: 1,
        };
        setFootnoteRefList([...footnoteRefList, newFootnoteRef]);
        existingFootnoteRef = newFootnoteRef;
        obj.id = refID;
      } else {
        existingFootnoteRef.count = existingFootnoteRef.count + 1;
        obj.id = refID + "-" + (existingFootnoteRef.count - 1);
      }
      obj.ref = refID;
      obj.index = existingFootnoteRef.index;
    }
  } else if (match.name === "unicode") {
    obj.type = "unicode";
    const rawChar = match.group[0].trim();
    const hexValue = rawChar.replace(/(?:U\+|\\u|{|})/g, "");
    const charCode = parseInt("0x" + hexValue, 16);
    const char = String.fromCodePoint(charCode);
    obj.char = char;
    obj.children = convertToObject(match.group[0].trim());
  } else if (match.name === "var") {
    obj.type = "var";
    const id = match.group[0];
    const var_ = varList.find((v) => v.name === id);
    obj.id = id;
    obj.children = [
      {
        type: "text",
        children: var_.content,
      },
    ];
  } else if (match.name === "standard-link") {
    obj.type = "link";
    obj.href = match.group[0];
    obj.title = match.group[0];
    obj.children = [
      {
        type: "text",
        children: removeBackslash(removeBackslashInCode(match.group[0])),
      },
    ];
  } else if (match.name === "code") {
    obj.type = "code";
    if (
      match.group[1] ===
      escapedIdentifier[0] + "&#96;" + escapedIdentifier[1]
    ) {
      match.group[0] = match.group[0] + "\\";
    }
    obj.children = [
      {
        type: "text",
        children: removeBackslash(
          removeBackslashInCode(match.group[0], exception),
          true
        ),
      },
    ];
  } else if (match.name === "code-with-var") {
    obj.type = "code";
    obj.formatted = true;
    if (match.group[1] === "&#96;") match.group[0] = match.group[0] + "\\";
    obj.children = convertToObject(match.group[0].trim());
  } else if (match.name === "date") {
    const { inFormat, outFormat, timestamp, children } = createDate(
      match.group
    );
    obj.type = "date";
    obj.inFormat = inFormat;
    obj.outFormat = outFormat;
    obj.timestamp = timestamp;
    obj.children = children;
  } else {
    obj.type = match.name;
    obj.children = convertToObject(match.group[0]);
  }

  const textAfter = removeBackslash(
    text.substring(match.index + match.raw.length)
  );

  const result = [
    {
      type: "text",
      children: textBefore,
    },
    obj,
    ...convertToObject(textAfter),
  ];

  return result;
}
