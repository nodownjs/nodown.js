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
} from "./config.js";

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
    if (text.toLowerCase().includes(varList.map((m) => "<" + m.name.toLowerCase() + ">")) && !variable) {
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

  const titleRegex = /^(#{1,6})\s(.+)/;
  function createTitle(line) {
    const match = line.match(titleRegex);
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
    if (level == 2) addNewSection(":======");
    const lastDiv = getLastDiv();
    lastDiv.children.push(title);
  }

  const BlockCodeRegex = /^\s*`{3}(\w*)/;
  let isBlockCode = false;
  let blockCodeLanguage = "";
  let blockCodeContent = [];
  function createBlockCode(line) {
    const match = line.match(BlockCodeRegex);
    if (match[1]) blockCodeLanguage = match[1];
    // Si fin du block code
    if (isBlockCode) {
      isBlockCode = false;
      const blockCode = {
        type: "block-code",
        language: blockCodeLanguage,
        children: blockCodeContent,
      };
      const lastDiv = getLastDiv();
      lastDiv.children.push(blockCode);
      blockCodeContent = [];
      blockCodeLanguage = "";
    } else {
      // Si début du block code
      isBlockCode = true;
    }
  }
  function addBlockCodeContent(line) {
    blockCodeContent.push(removeBackslashInCode(line));
  }

  const tableRegExp = /^\s*\|(?:(?:[^\|]*|\\|)\|)*/;
  const globalTableRegExp = /((?:[^\|]|\\\|)*)(?<!\\)\|/g;
  const tableHeaderRegExp = /^\s*\|(?:\s*(?::)?-+(?::)?\s*\|)+\s*$/;
  let tableStatus = 0;
  let tableHeader = [];
  let tableAlign = [];
  let tableRows = [];
  function createTable(line, afterLine) {
    const matchs = [...line.matchAll(globalTableRegExp)].filter(
      (_, i) => i !== 0
    );
    if (tableStatus === 0) {
      tableHeader = matchs.map((arr) => {
        return {
          type: "table-header",
          children: convertToObject(arr[1].trim()),
        };
      });
      tableStatus = 1;
    } else if (tableStatus === 1) {
      tableAlign = matchs.map((arr) => arr[1].trim());
      const leftRegExp = /^-+:$/;
      const rightRegExp = /^:-+$/;
      const centerRegExp = /^:-+:$/;
      tableAlign = tableAlign.map((text) => {
        if (leftRegExp.test(text)) {
          return "left";
        } else if (rightRegExp.test(text)) {
          return "right";
        } else if (centerRegExp.test(text)) {
          return "center";
        } else {
          return "default";
        }
      });
      tableStatus++;
    } else {
      tableRows.push({
        type: "table-row",
        children: matchs.map((arr, i) => {
          return {
            type: "table-data",
            align: tableAlign[i],
            children: convertToObject(arr[1].trim()),
          };
        }),
      });
      if (!tableRegExp.test(afterLine)) {
        const table = {
          type: "table",
          align: tableAlign,
          headers: tableHeader,
          rows: tableRows,
        };
        const lastDiv = getLastDiv();
        lastDiv.children.push(table);
        tableStatus = 0;
        tableHeader = [];
        tableRows = [];
        tableAlign = [];
      }
    }
  }

  const citationRegExp =
    /^>([+\-i?!]|\s\[!(?:IMPORTANT|WARNING|NOTE)\])?\s+(.+)$/;
  const moreAlertType = /\[!(?:IMPORTANT|WARNING|NOTE)\]/;
  let citation = {
    type: "idk",
    children: [],
  };
  function createCitation(line, afterLine) {
    const match = line.match(citationRegExp);
    let [_, type, content] = match;

    if (!type && moreAlertType.test(content)) {
      type = content;
      content = "";
    } else if (!type) {
      type = "citation";
    }

    const children = { type: "paragraph", children: convertToObject(content) };

    if (type) type = type.trim();

    if (citation.type === "idk") {
      citation = {
        type: "idk",
        children: [],
      };

      switch (type) {
        case "[!WARNING]":
        case "[!IMPORTANT]":
        case "!":
          citation.type = "alert";
          citation.variant = "warning";
          break;
        case "[!NOTE]":
        case "i":
          citation.type = "alert";
          citation.variant = "info";
          break;
        case "?":
          citation.type = "alert";
          citation.variant = "question";
          break;
        case "i":
          citation.type = "alert";
          citation.variant = "info";
          break;
        case "+":
          citation.type = "alert";
          citation.variant = "success";
          break;
        case "-":
          citation.type = "alert";
          citation.variant = "error";
          break;
        case "citation":
          citation.type = "citation";
          break;
      }

      if (citation.type !== "citation") {
        citation.title = convertToObject(content);
      } else {
        citation.children.push(children);
      }
    } else {
      citation.children.push(children);
    }

    if (!citationRegExp.test(afterLine)) {
      const lastDiv = getLastDiv();
      lastDiv.children.push(citation);
      citation = {
        type: "idk",
        children: [],
      };
    }
  }

  const listRegex = /^(\s*)(-|\*|(?:\d+\.?)+) (.+)/;
  let listRoot = {
    type: "idk",
    children: [],
    level: 0,
  };
  let stack = [];
  function createList(line, afterLine) {
    const match = line.match(listRegex);
    const listType =
      match[2] === "-" || match[2] === "*" ? "unordered" : "ordered";
    const checkRegExp = /^(?:\s*)(?:-|\*|(?:\d+\.?)+) (\[ \]|\[x\])(.+)/;
    const isTask = checkRegExp.exec(line);
    const listItemType = isTask ? "task-list-element" : "list-element";
    const content = match[3];

    // Mis a jour du niveau
    let level = match[1].length;
    if (level % 2 == 1) level--; // Changement de niveau tout les deux espaces uniquement
    level = level / 2;

    // Initialisation & mise a jour de la première liste
    if (stack.length === 0) {
      listRoot.type = listType + "-list";
      stack.push(listRoot);
    }

    // Mis a jour de la pile
    while (stack.length > level + 1) {
      stack.pop();
    }

    // Si nouvelle liste
    if (stack.length < level + 1 && stack.length > 0) {
      const list = {
        type: listType + "-list",
        children: [],
      };
      const parentList = stack[stack.length - 1];
      const parentElement = parentList.children[parentList.children.length - 1];
      if (parentElement) {
        parentElement.children.push(list);
        stack.push(list);
      }
    }

    // Création de l'élément
    let listItem = {
      type: listItemType,
      children: convertToObject(content),
    };

    if (isTask) {
      listItem.checked = isTask[1] === "[x]" ? true : false;
      listItem.children = convertToObject(isTask[2]);
    }

    // Ajout de l'élément
    const parent = stack[stack.length - 1];
    parent.children.push(listItem);

    // Si dernier élément
    if (!listRegex.test(afterLine)) {
      const lastDiv = getLastDiv();
      lastDiv.children.push({
        ...listRoot,
      });
      stack = [];
      listRoot = {
        type: "idk",
        children: [],
        level: 0,
      };
    }
  }

  const SectionRegExp = /^##$/g;
  function addNewSection() {
    const section = {
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
    };
    syntaxTree.children.push(section);
  }

  const divRegExp =
    /^(------|------|------:|---:---|======|===:===|:======|======:|:======:|:===:===:|::===:===::)\s?$/;
  function addNewDiv(line) {
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

    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    let lastDiv = lastSection.children[lastSection.children.length - 1];
    if (lastDiv && lastDiv.children.length === 0) {
      lastSection.children[lastDiv.children.length - 1] = div;
    } else {
      lastSection.children.push(div);
    }
  }

  const subDivRegExp = /^(===|:===:|:===|===:)(\|)?(\d+)?$/;
  function addNewSubDiv(line) {
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
    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    let lastDiv = lastSection.children[lastSection.children.length - 1];
    let lastLastDiv = lastDiv.children[lastDiv.children.length - 1];
    if (lastLastDiv && lastLastDiv.children.length === 0) {
      lastDiv.children[lastDiv.children.length - 1] = div;
    } else {
      lastDiv.children.push(div);
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

    if (BlockCodeRegex.test(line)) {
      createBlockCode(line);
    } else if (isBlockCode) {
      addBlockCodeContent(line);
    } else if (citationRegExp.test(line)) {
      createCitation(line, afterLine);
    } else if (titleRegex.test(line)) {
      createTitle(line);
    } else if (listRegex.test(line)) {
      createList(line, afterLine);
    } else if (SectionRegExp.test(line)) {
      addNewSection(line);
    } else if (subDivRegExp.test(line)) {
      addNewSubDiv(line);
    } else if (divRegExp.test(line)) {
      addNewDiv(line);
    } else if (
      tableRegExp.test(line) &&
      (tableStatus === 0 ? tableTest : true)
    ) {
      createTable(line, afterLine);
    } else if (line !== "") {
      createParagraph(line);
    }
  }

  syntaxTree.children = syntaxTree.children.filter((el) => el.children !== "");
  console.table(syntaxTree.children);
  console.log(syntaxTree);
  // return objectToHTML(syntaxTree);
  return syntaxTree;
}
