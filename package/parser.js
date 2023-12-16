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
  dividerRegExp,
  tableOfContents,
  titleIdRegExp,
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
import { convertToObject } from "./elements/inline.js";
import { removeBackslashInCode, transformEscapedChar } from "./utils.js";
import createDivider from "./elements/divider.js";
import createTableOfContents from "./elements/toc.js";

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
  console.log(varList);
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

  const createParagraph = (line) => {
    const paragraph = {
      type: "paragraph",
      children: convertToObject(line),
    };
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

  let titles = [];
  let titlesCount = 0;
  let toc = {
    type: "table-of-contents",
    children: [],
  };

  function makeDivider() {
    const divider = createDivider();
    const lastDiv = getLastDiv();
    lastDiv.children.push(divider);
  }

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

  function makeList(line, afterLine, isTitle) {
    const [listType, listLevel, start] = createListConfig(line);
    // Initialisation & mise a jour de la première liste
    if (stack.length === 0) {
      listRoot.type = listType + "-list";
      if (start) listRoot.start = start;
      stack.push(listRoot);
    }
    // Mis a jour de la pile
    while (stack.length > listLevel + 1) {
      stack.pop();
    }
    // Si nouvelle liste
    if (stack.length < listLevel + 1 && stack.length > 0) {
      const list = createList(listType, start);
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
      if (isTitle) {
        toc.children.push(listRoot);
        return;
      }
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
    if (title.level > 1) {
      if (!title.id) title.id = "title-" + (titlesCount + 1);
      const level = title.level - 2;
      titles.push(
        `${" ".repeat(level * 2)}- [${line
          .replace(/^#+\s/, "")
          .replace(titleIdRegExp, "$1")}](#${title.id})`
      );

      titlesCount++;
    }
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
      if (!afterLine.match(tableRegExp)) {
        const table = createTable(tableAlign, tableHeader, tableRows);
        const lastDiv = getLastDiv();
        lastDiv.children.push(table);
        tableStatus = 0;
        tableHeader = [];
        tableRows = [];
        tableAlign = [];
      }
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
        const match = line.match(blockCodeRegExp);
        if (match[1]) blockCodeLanguage = match[1];
        isBlockCode = true;
      }
    }
  }

  function makeTableOfContents() {
    const lastDiv = getLastDiv();
    lastDiv.children.push(toc);
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
      makeCitation(line, afterLine);
    } else if (titleRegExp.test(line)) {
      makeTitle(line);
    } else if (listRegExp.test(line)) {
      makeList(line, afterLine);
    } else if (sectionRegExp.test(line)) {
      makeSection(line);
    } else if (subDivRegExp.test(line)) {
      makeSubDiv(line);
    } else if (tableOfContents.test(line)) {
      makeTableOfContents(line);
    } else if (divRegExp.test(line)) {
      makeDiv(line);
    } else if (dividerRegExp.test(line)) {
      makeDivider(line);
      makeSection("------");
    } else if (
      tableRegExp.test(line) &&
      (tableStatus === 0 ? tableTest : true)
    ) {
      makeTable(line, afterLine);
    } else if (line !== "") {
      createParagraph(line);
    } else {
      tableStatus = 0;
    }

    if (isBlockCode && afterLine === undefined) {
      makeBlockCode(null);
    }
  }

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i].replace(/\(#index\)/, `(#title-${i})`);
    makeList(title, titles[i + 1], true);
  }

  syntaxTree.children = syntaxTree.children.filter((el) => el.children !== "");
  console.table(syntaxTree.children);
  console.log(syntaxTree);
  return syntaxTree;
}
