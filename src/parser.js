import {
  backSlashFinderRegExp,
  blockCodeRegExp,
  blockCodeStartRegExp,
  citationRegExp,
  divRegExp,
  dividerRegExp,
  footnoteRefRegExp,
  footnoteRegExp,
  globalTableRegExp,
  linkRegExp,
  listRegExp,
  sectionRegExp,
  subDivRegExp,
  tableHeaderRegExp,
  tableOfContents,
  tableRegExp,
  titleIdRegExp,
  titleRegExp,
  varRegExp,
} from "./config.js";
import createBlockCode from "./elements/blockcode.js";
import createCitation, {
  createCitationContent,
  createCitationType,
} from "./elements/citation.js";
import createDiv from "./elements/div.js";
import createDivider from "./elements/divider.js";
import createFootnote from "./elements/footnote.js";
import { convertToObject } from "./elements/inline.js";
import createList, {
  createListConfig,
  createListElement,
} from "./elements/list.js";
import createSection from "./elements/section.js";
import createSubDiv from "./elements/subDiv.js";
import createTable, {
  createTableAlign,
  createTableHeader,
  createTableRow,
  updateTableHeaderAlign,
} from "./elements/table.js";
import createTitle from "./elements/title.js";
import { removeBackslashInCode, transformEscapedChar } from "./utils.js";

export let footnoteList = [];
export const setFootnoteList = (list) => {
  footnoteList = list;
};

export let footnoteRefList = [];
export const setFootnoteRefList = (list) => {
  footnoteRefList = list;
};

export let varList = [];
export const setVarList = (list) => {
  varList = list;
};
function mergeObjects(obj1, obj2) {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === "object" && !Array.isArray(obj2[key])) {
        obj1[key] = mergeObjects(obj1[key] || {}, obj2[key]);
      } else {
        if (obj2[key] !== undefined && obj2[key] !== null) {
          obj1[key] = obj2[key];
        }
      }
    }
  }
  return obj1;
}

export let options = {};
export const setOptions = (opt) => {
  options = mergeObjects(options, opt);
};

const defaultOptions = {
  "french-quotation-mark": {
    disabled: true,
  },
};

export default function parser(textDocument, opt = defaultOptions) {
  setOptions(mergeObjects(defaultOptions, opt));
  setFootnoteRefList([]);
  setFootnoteList([]);
  setVarList([]);

  function getLastDiv() {
    const disabledSection = options?.section?.disabled ?? false;
    const disabledDiv = options?.horizontalAlignment?.disabled ?? false;
    if (disabledSection) {
      if (disabledDiv) {
        return syntaxTree;
      } else {
        const lastDiv = syntaxTree.children[syntaxTree.children.length - 1];
        const lastSubDiv = lastDiv.children[lastDiv.children.length - 1];
        return lastSubDiv;
      }
    } else {
      if (disabledDiv) {
        const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
        return lastSection;
      } else {
        const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
        const lastDiv = lastSection.children[lastSection.children.length - 1];
        const lastSubDiv = lastDiv.children[lastDiv.children.length - 1];
        return lastSubDiv;
      }
    }
  }

  textDocument = textDocument.replace(
    backSlashFinderRegExp,
    transformEscapedChar
  );

  setFootnoteList(
    Array.from(
      textDocument.matchAll(new RegExp(footnoteRegExp.source, "gm"))
    ).map((match) => {
      // textDocument = textDocument.replace(match[0], "");
      return { id: match[1], value: match[2] };
    })
  );

  const linesList = textDocument.split("\n");

  const noSectionChildren = [
    {
      type: "div",
      children: [
        {
          type: "sub-div",
          children: [],
        },
      ],
    },
  ];
  const noDivChildren = [
    {
      type: "section",
      children: [],
    },
  ];

  const noSectionNoDivChildren = [];

  const sectionAndDivChildren = [
    {
      type: "section",
      children: [
        {
          type: "div",
          children: [
            {
              type: "sub-div",
              children: [],
            },
          ],
        },
      ],
    },
  ];

  const disabledSection = options?.section?.disabled ?? false;
  const disabledDiv = options?.horizontalAlignment?.disabled ?? false;

  const syntaxTree = {
    type: "root",
    children: disabledSection
      ? disabledDiv
        ? [...noSectionNoDivChildren]
        : [...noSectionChildren]
      : disabledDiv
      ? [...noDivChildren]
      : [...sectionAndDivChildren],
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
  let tableRawHeader = "";
  let tableRawSeparator = "";
  let tableRawRows = [];

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

  const footnotes = [];

  function makeDivider() {
    const divider = createDivider();
    const lastDiv = getLastDiv();
    lastDiv.children.push(divider);
  }

  function makeDiv(line) {
    const horizontalAlignmentDisabled =
      options?.horizontalAlignment?.disabled ?? false;
    if (horizontalAlignmentDisabled) return;
    const div = createDiv(line);
    const disabledSection = options?.section?.disabled ?? false;
    if (disabledSection) {
      syntaxTree.children.push(div);
      return;
    }
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
    const disabledSection = options?.section?.disabled ?? false;
    if (disabledSection) {
      const lastDiv = syntaxTree.children[syntaxTree.children.length - 1];
      const lastLastDiv = lastDiv.children[lastDiv.children.length - 1];
      if (lastLastDiv && lastLastDiv.children.length === 0) {
        lastDiv.children[lastDiv.children.length - 1] = subDiv;
      } else {
        lastDiv.children.push(subDiv);
      }
      return;
    }
    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    let lastDiv = lastSection.children[lastSection.children.length - 1];
    let lastLastDiv = lastDiv.children[lastDiv.children.length - 1];
    if (lastLastDiv && lastLastDiv.children.length === 0) {
      lastDiv.children[lastDiv.children.length - 1] = subDiv;
    } else {
      lastDiv.children.push(subDiv);
    }
  }

  function makeSection(custom) {
    const disabledSection = options?.section?.disabled ?? false;
    if (disabledSection) return;
    const section = createSection(custom);
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
      const list = createList(listType, start, stack.length);
      const parentList = stack[stack.length - 1];
      const parentElement = parentList.children[parentList.children.length - 1];
      if (parentElement) {
        parentElement.children.push(list);
        stack.push(list);
      }
    }
    // Création de l'élément
    const listElement = createListElement(line, stack.length - 1);
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
        level: 0,
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
          .replace(titleIdRegExp, "$1")
          .replace(footnoteRefRegExp, "")
          .replace(linkRegExp, "$1")}](#${title.id})`
      );

      titlesCount++;
    }
    const newSectionByHeader = options?.section?.newSectionByHeader ?? true;
    const newSectionHeaderLevel = options?.section?.newSectionHeaderLevel ?? 2;
    if (title.level == newSectionHeaderLevel && newSectionByHeader) {
      if (options?.section?.disabled) {
        makeDiv();
      }
      makeSection();
    }
    const lastDiv = getLastDiv();
    lastDiv.children.push(title);
  }

  function makeTable(line, afterLine) {
    if (tableStatus === 0) {
      tableHeader = createTableHeader(line);
      tableRawHeader = line;
      tableStatus = 1;
    } else if (tableStatus === 1) {
      tableAlign = createTableAlign(line);
      tableHeader = updateTableHeaderAlign(tableHeader, tableAlign);
      tableStatus++;
      if (afterLine === undefined || !afterLine.match(tableRegExp)) {
        const table = createTable(tableAlign, tableHeader, tableRows);
        const lastDiv = getLastDiv();
        lastDiv.children.push(table);
        tableStatus = 0;
        tableHeader = [];
        tableRows = [];
        tableAlign = [];
      }
      tableRawSeparator = line;
    } else {
      const tableRow = createTableRow(line, tableAlign);
      tableRows.push(tableRow);
      tableRawRows.push(line);
      if (!tableRegExp.test(afterLine)) {
        const table = createTable(
          tableAlign,
          tableHeader,
          tableRows,
          tableRawHeader,
          tableRawSeparator,
          tableRawRows
        );
        const lastDiv = getLastDiv();
        lastDiv.children.push(table);
        tableStatus = 0;
        tableHeader = [];
        tableRows = [];
        tableAlign = [];
        tableRawRows = [];
        tableRawHeader = [];
        tableRawSeparator = [];
      }
    }
  }

  function makeCitation(line, afterLine) {
    if (citationContent.length <= 0 && !citationType.title) {
      citationType = createCitationType(line);
      if (citationType.children) {
        citationContent.push(
          createCitationContent("> " + citationType.children)
        );
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

  function makeBlockCode(line, push = false, inactive = false) {
    if (line === null && !inactive) {
      createParagraph("```" + blockCodeLanguage);
      blockCodeContent.forEach((content) => {
        createParagraph(content);
      });
      return;
    }
    if (push && !blockCodeStartRegExp.test(line)) {
      blockCodeContent.push(removeBackslashInCode(line));
    } else {
      if (isBlockCode) {
        isBlockCode = false;
        if (!inactive) {
          const blockCode = createBlockCode(
            line,
            blockCodeContent,
            blockCodeLanguage
          );
          const lastDiv = getLastDiv();
          lastDiv.children.push(blockCode);
        }
        blockCodeContent = [];
        blockCodeLanguage = "";
        if (blockCodeStartRegExp.test(line)) makeBlockCode(line);
      } else {
        const match = line.match(blockCodeRegExp);
        if (match[1]) blockCodeLanguage = match[1];
        isBlockCode = true;
      }
    }
  }

  function makeFootnote(line) {
    const footnote = createFootnote(line);
    if (footnote.type === "footnote") footnotes.push(footnote);
  }

  function makeEmptyLine() {
    const br = {
      type: "empty-line",
    };
    const lastDiv = getLastDiv();
    lastDiv.children.push(br);
  }

  function makeTableOfContents() {
    const lastDiv = getLastDiv();
    lastDiv.children.push(toc);
  }

  const varRegExp_ = new RegExp(varRegExp.source);

  for (let i = 0; i < linesList.length; i++) {
    const line = linesList[i];

    if (
      (blockCodeStartRegExp.test(line) && !isBlockCode) ||
      (blockCodeRegExp.test(line) && !blockCodeStartRegExp.test(line))
    ) {
      makeBlockCode(line, false, true);
    } else if (isBlockCode) {
      makeBlockCode(line, true, true);
    } else if (varRegExp_.test(line)) {
      setVarList([
        ...varList,
        {
          name: line.match(varRegExp_)[1],
          content: line.match(varRegExp_)[2],
          raw: line.match(varRegExp_)[0],
        },
      ]);
    }
  }

  blockCodeContent = [];
  blockCodeLanguage = "";
  isBlockCode = false;

  for (let i = 0; i < linesList.length; i++) {
    const line = linesList[i];
    const afterLine = linesList[i + 1];

    const tableTest =
      afterLine &&
      [...line.matchAll(globalTableRegExp)].length ===
        [...afterLine.matchAll(globalTableRegExp)].length &&
      tableHeaderRegExp.test(afterLine);

    const sectionDisabled = options?.section?.disabled ?? false;
    const horizontalAlignmentDisabled =
      options?.horizontalAlignment?.disabled ?? false;
    const hideDisabledElements = options?.hideDisabledElements ?? true;

    if (
      (blockCodeStartRegExp.test(line) && !isBlockCode) ||
      (blockCodeRegExp.test(line) && !blockCodeStartRegExp.test(line))
    ) {
      makeBlockCode(line);
    } else if (isBlockCode) {
      makeBlockCode(line, true);
    } else if (citationRegExp.test(line)) {
      makeCitation(line, afterLine);
    } else if (titleRegExp.test(line)) {
      makeTitle(line);
    } else if (listRegExp.test(line)) {
      makeList(line, afterLine);
    } else if (footnoteRegExp.test(line)) {
      makeFootnote(line);
    } else if (
      sectionRegExp.test(line) &&
      !(sectionDisabled && !hideDisabledElements)
    ) {
      makeSection();
    } else if (
      subDivRegExp.test(line) &&
      !(horizontalAlignmentDisabled && !hideDisabledElements)
    ) {
      makeSubDiv(line);
    } else if (tableOfContents.test(line)) {
      makeTableOfContents(line);
    } else if (
      divRegExp.test(line) &&
      !(horizontalAlignmentDisabled && !hideDisabledElements)
    ) {
      makeDiv(line);
      // } else if (/^$/g.test(line)) {
      //   makeEmptyLine();
    } else if (dividerRegExp.test(line)) {
      makeDivider(line);
      makeSection();
    } else if (
      tableRegExp.test(line) &&
      (tableStatus === 0 ? tableTest : true)
    ) {
      makeTable(line, afterLine);
    } else if (line !== "" && !new RegExp(varRegExp.source).test(line)) {
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

  if (footnotes.length > 0) {
    makeSection("footnote");
    const lastDiv = getLastDiv();
    lastDiv.children.push({
      type: "footnote-list",
      children: [...footnotes.sort((a, b) => a.index - b.index)],
    });
  }
  if (varList.length > 0) {
    makeSection("var");
    const lastDiv = getLastDiv();
    lastDiv.children.push(
      ...varList.map((p) => {
        return {
          type: "var-content",
          id: p.name,
          children: [{ type: "text", children: p.content }],
        };
      })
    );
  }
  syntaxTree.children = syntaxTree.children.filter((el) => el.children !== "");
  syntaxTree.tableOfContents = toc.children[0];
  // console.table(syntaxTree.children);
  // console.log(syntaxTree);
  const disabledRoot = options?.root?.disabled ?? false;
  if (disabledRoot) return syntaxTree.children;
  return syntaxTree;
}
