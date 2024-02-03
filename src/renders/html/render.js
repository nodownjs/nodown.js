import createAlert from "./elements/alert.js";
import createBlockCode from "./elements/block-code.js";
import createBold from "./elements/bold.js";
import createCitation from "./elements/citation.js";
import createCode from "./elements/code.js";
import createColor from "./elements/color.js";
import createDate from "./elements/date.js";
import createDiv from "./elements/div.js";
import createDivider from "./elements/divider.js";
import createFootnoteRef from "./elements/footnote-ref.js";
import createFootnote from "./elements/footnote.js";
import createFrenchQuotationMark from "./elements/french-quotation-mark.js";
import createImage from "./elements/image.js";
import createItalic from "./elements/italic.js";
import createLink from "./elements/link.js";
import createListElement from "./elements/list-element.js";
import createOrderedList from "./elements/ordered-list.js";
import createParagraph from "./elements/paragraph.js";
import createRoot from "./elements/root.js";
import createSectionFootnote from "./elements/section-footnote.js";
import createSection from "./elements/section.js";
import createStrikethrough from "./elements/strikethrough.js";
import createSubDiv from "./elements/sub-div.js";
import createSubscript from "./elements/subscript.js";
import createSuperscript from "./elements/superscript.js";
import createTableData from "./elements/table-data.js";
import createTableHeader from "./elements/table-header.js";
import createTableOfContents from "./elements/table-of-contents.js";
import createTableRow from "./elements/table-row.js";
import createTable from "./elements/table.js";
import createTaskListElement from "./elements/task-list-element.js";
import createTitle from "./elements/title.js";
import createUnderline from "./elements/underline.js";
import createUnicode from "./elements/unicode.js";
import createUnorderedList from "./elements/unordered-list.js";
import createVar from "./elements/var.js";

let footnoteIds = [];
export const addFootnoteId = (id) => {
  footnoteIds.push(id);
};

export const options = {};
const setOptions = (optionsArg) => {
  Object.assign(options, optionsArg);
};

export function childrenMap(children) {
  return children.map((child) => recursiveRender(child).outerHTML).join("");
}

export function recursiveRender(obj) {
  if (!obj || typeof obj !== "object") {
    return obj ? obj.toString() : "";
  }
  const opt = options[obj.type];

  if (opt === false) {
    return "";
  } else if (opt === "raw") {
    return {
      outerHTML: childrenMap(obj.children),
    };
  } else if (typeof opt === "function") {
    const element = opt({
      ...obj,
      children: obj.children ? childrenMap(obj.children) : undefined,
    });
    return element;
  } else {
    const element = createElementFromObj(obj);
    return element;
  }
}

export default function renderToHTML(tree, optionsArg) {
  setOptions(optionsArg);
  const doc = recursiveRender(tree);
  return doc.outerHTML;
}

function createElementFromObj(obj) {
  switch (obj.type) {
    case "root":
      return createRoot(obj);
    case "section":
      return createSection(obj);
    case "div":
      return createDiv(obj);
    case "sub-div":
      return createSubDiv(obj);
    case "table":
      return createTable(obj);
    case "table-header":
      return createTableHeader(obj);
    case "table-row":
      return createTableRow(obj);
    case "table-data":
      return createTableData(obj);
    case "italic":
      return createItalic(obj);
    case "bold":
      return createBold(obj);
    case "strikethrough":
      return createStrikethrough(obj);
    case "underline":
      return createUnderline(obj);
    case "superscript":
      return createSuperscript(obj);
    case "subscript":
      return createSubscript(obj);
    case "french-quotation-mark":
      return createFrenchQuotationMark(obj);
    case "color":
      return createColor(obj);
    case "unicode":
      return createUnicode(obj);
    case "code":
      return createCode(obj);
    case "block-code":
      return createBlockCode(obj);
    case "var":
      return createVar(obj);
    case "image":
      return createImage(obj);
    case "link":
      return createLink(obj);
    case "footnote-ref":
      return createFootnoteRef(obj);
    case "footnote":
      return createFootnote(obj);
    case "section-footnote":
      return createSectionFootnote(obj);
    case "alert":
      return createAlert(obj);
    case "table-of-contents":
      return createTableOfContents(obj);
    case "divider":
      return createDivider();
    case "unordered-list":
      return createUnorderedList(obj);
    case "ordered-list":
      return createOrderedList(obj);
    case "list-element":
      return createListElement(obj);
    case "task-list-element":
      return createTaskListElement(obj);
    case "title":
      return createTitle(obj);
    case "citation":
      return createCitation(obj);
    case "date":
      return createDate(obj);
    case "paragraph":
      return createParagraph(obj);
    case "text":
      const text = {
        outerHTML: obj.children,
      };
      return text;

    default:
      return {
        outerHTML: "",
      };
  }
}
