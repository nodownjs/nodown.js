import {
  escapedCharConfig,
  backSlashFinderRegExp,
  varRegExp,
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
  titleRegExp,
  blockCodeRegExp,
  globalTableRegExp,
  tableRegExp,
  tableHeaderRegExp,
  citationRegExp,
  listRegExp,
  sectionRegExp,
  divRegExp,
  subDivRegExp,
} from "./config.js";
import createBlockCode from "./elements/blockcode.js";
import createTitle from "./elements/title.js";
import createTable, {
  createTableAlign,
  createTableHeader,
  createTableRow,
  updateTableHeaderAlign,
} from "./elements/table.js";
import createCitation, {
  createCitationContent,
  createCitationType,
} from "./elements/citation.js";
import createList, {
  createListConfig,
  createListElement,
} from "./elements/list.js";
import createSection from "./elements/section.js";
import createDiv from "./elements/div.js";
import createSubDiv from "./elements/subDiv.js";

function transformEscapedChar(match, g1) {
  return (
    escapedIdentifier[0] +
    escapedCharConfig.find((c) => c.char === g1).code +
    escapedIdentifier[1]
  );
}

export default function parser(textDocument) {
  function getLastDiv() {
    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    const lastDiv = lastSection.children[lastSection.children.length - 1];
    const lastSubDiv = lastDiv.children[lastDiv.children.length - 1];
    return lastSubDiv;
  }

  textDocument = textDocument.replace(
    backSlashFinderRegExp,
    transformEscapedChar
  );

  const varList = Array.from(textDocument.matchAll(varRegExp)).map((match) => {
    textDocument = textDocument.replace(match[0], "");
    return { name: match[1], content: match[2] };
  });
  window.varList = varList;

  const linesList = textDocument.split("\n");

  const syntaxTree = {
    type: "root",
    children: [
      {
        type: "section",
        children: [
          {
            type: "div",
            children: [
              {
                type: "div",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

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
        .includes(varList.map((m) => "<" + m.name.toLowerCase() + ">")) &&
      !variable
    ) {
      varList.forEach((m) => {
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

  function convertToObject(text) {
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
      obj.children = removeBackslash(
        removeBackslashInCode(match.group[0]),
        true
      );
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

  const createParagraph = (line) => {
    const paragraph = {
      type: "paragraph",
      children: convertToObject(line),
    };
    // const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    // const lastDiv = lastSection.children[lastSection.children.length - 1];
    const lastDiv = getLastDiv();
    lastDiv.children.push(paragraph);
  };

  let isBlockCode = false;
  let blockCodeLanguage = "";
  let blockCodeContent = [];

  let tableStatus = 0;
  let tableHeader = [];
  let tableAlign = [];
  let tableRows = [];

  let citationContent = [];
  let citationType = {
    type: "",
  };

  let listRoot = {
    type: "",
    children: [],
    level: 0,
  };
  let stack = [];

  function makeDiv(line) {
    const div = createDiv(line);
    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    let lastDiv = lastSection.children[lastSection.children.length - 1];
    if (lastDiv && lastDiv.children.length === 0) {
      lastSection.children[lastDiv.children.length - 1] = div;
    } else {
      lastSection.children.push(div);
    }
  }

  function makeSubDiv(line) {
    const subDiv = createSubDiv(line);
    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    let lastDiv = lastSection.children[lastSection.children.length - 1];
    let lastLastDiv = lastDiv.children[lastDiv.children.length - 1];
    if (lastLastDiv && lastLastDiv.children.length === 0) {
      lastDiv.children[lastDiv.children.length - 1] = subDiv;
    } else {
      lastDiv.children.push(subDiv);
    }
  }

  function makeSection() {
    const section = createSection();
    syntaxTree.children.push(section);
  }

  function makeList(line, afterLine) {
    const [listType, listLevel] = createListConfig(line);
    // Initialisation & mise a jour de la première liste
    if (stack.length === 0) {
      listRoot.type = listType + "-list";
      stack.push(listRoot);
    }
    // Mis a jour de la pile
    while (stack.length > listLevel + 1) {
      stack.pop();
    }
    // Si nouvelle liste
    if (stack.length < listLevel + 1 && stack.length > 0) {
      const list = createList(listType);
      const parentList = stack[stack.length - 1];
      const parentElement = parentList.children[parentList.children.length - 1];
      if (parentElement) {
        parentElement.children.push(list);
        stack.push(list);
      }
    }
    // Création de l'élément
    const listElement = createListElement(line);
    // Ajout de l'élément
    const parent = stack[stack.length - 1];
    parent.children.push(listElement);
    // Si dernier élément
    if (!listRegExp.test(afterLine)) {
      const lastDiv = getLastDiv();
      lastDiv.children.push({
        ...listRoot,
      });
      stack = [];
      listRoot = {
        type: "",
        children: [],
      };
    }
  }

  function makeTitle(line) {
    const title = createTitle(line);
    if (title.level == 2) makeSection();
    const lastDiv = getLastDiv();
    lastDiv.children.push(title);
  }

  function makeTable(line, afterLine) {
    if (tableStatus === 0) {
      tableHeader = createTableHeader(line);
      tableStatus = 1;
    } else if (tableStatus === 1) {
      tableAlign = createTableAlign(line);
      tableHeader = updateTableHeaderAlign(tableHeader, tableAlign);
      tableStatus++;
    } else {
      const tableRow = createTableRow(line, tableAlign);
      tableRows.push(tableRow);
      if (!tableRegExp.test(afterLine)) {
        const table = createTable(tableAlign, tableHeader, tableRows);
        const lastDiv = getLastDiv();
        lastDiv.children.push(table);
        tableStatus = 0;
        tableHeader = [];
        tableRows = [];
        tableAlign = [];
      }
    }
  }

  function makeCitation(line, afterLine) {
    if (citationContent.length <= 0 && !citationType.title) {
      citationType = createCitationType(line);
      if (citationType.type === "citation") {
        citationContent.push(...citationType.children);
        delete citationType.children;
      }
    } else {
      citationContent.push(createCitationContent(line));
    }
    if (!citationRegExp.test(afterLine)) {
      const citation = createCitation(citationType, citationContent);
      const lastDiv = getLastDiv();
      lastDiv.children.push(citation);
      citationContent = [];
      citationType = {
        type: "",
      };
    }
  }

  function makeBlockCode(line, push = false) {
    if (push) {
      blockCodeContent.push(removeBackslashInCode(line));
    } else {
      if (isBlockCode) {
        isBlockCode = false;
        const blockCode = createBlockCode(
          line,
          blockCodeContent,
          blockCodeLanguage
        );
        const lastDiv = getLastDiv();
        lastDiv.children.push(blockCode);
        blockCodeContent = [];
        blockCodeLanguage = "";
      } else {
        isBlockCode = true;
      }
    }
  }

  for (let i = 0; i < linesList.length; i++) {
    const line = linesList[i];
    const afterLine = linesList[i + 1];

    const tableTest =
      afterLine &&
      [...line.matchAll(globalTableRegExp)].length ===
        [...afterLine.matchAll(globalTableRegExp)].length &&
      tableHeaderRegExp.test(afterLine);

    if (blockCodeRegExp.test(line)) {
      makeBlockCode(line);
    } else if (isBlockCode) {
      makeBlockCode(line, true);
    } else if (citationRegExp.test(line)) {
      // createCitation(line, afterLine);
      makeCitation(line, afterLine);
    } else if (titleRegExp.test(line)) {
      makeTitle(line);
    } else if (listRegExp.test(line)) {
      makeList(line, afterLine);
    } else if (sectionRegExp.test(line)) {
      makeSection(line);
    } else if (subDivRegExp.test(line)) {
      makeSubDiv(line);
    } else if (divRegExp.test(line)) {
      makeDiv(line);
    } else if (
      tableRegExp.test(line) &&
      (tableStatus === 0 ? tableTest : true)
    ) {
      makeTable(line, afterLine);
    } else if (line !== "") {
      createParagraph(line);
    }
  }

  syntaxTree.children = syntaxTree.children.filter((el) => el.children !== "");
  console.table(syntaxTree.children);
  console.log(syntaxTree);
  return syntaxTree;
}