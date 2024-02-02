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
import createFrenchQuotationMark from "./elements/french-quotation-mark.js";
import createImage from "./elements/image.js";
import createItalic from "./elements/italic.js";
import createLink from "./elements/link.js";
import createListElement from "./elements/list-element.js";
import createOrderedList from "./elements/ordered-list.js";
import createParagraph from "./elements/paragraph.js";
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
const addFootnoteId = (id) => {
  footnoteIds.push(id);
};

export default function renderToHTML(obj) {
  if (!obj || typeof obj !== "object") {
    return obj ? obj.toString() : "";
  }

  const container = document.createElement("div");

  if (obj.type === "root" && obj.children) {
    const div = document.createElement("div");
    div.id = "nodown-render";
    div.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
    container.appendChild(div);
  } else if (obj.type === "section" && obj.children) {
    const section = createSection(obj);
    container.appendChild(section);
  } else if (obj.type === "div" && obj.children) {
    const div = createDiv(obj);
    container.appendChild(div);
  } else if (obj.type === "sub-div" && obj.children) {
    const subDiv = createSubDiv(obj);
    container.appendChild(subDiv);
  } else if (obj.type === "table" && obj.rows) {
    const table = createTable(obj);
    container.appendChild(table);
  } else if (obj.type === "table-header" && obj.children) {
    const th = createTableHeader(obj);
    container.appendChild(th);
  } else if (obj.type === "table-row" && obj.children) {
    const tr = createTableRow(obj);
    container.appendChild(tr);
  } else if (obj.type === "table-data" && obj.children) {
    const td = createTableData(obj);
    container.appendChild(td);
  } else if (obj.type === "citation" && obj.children) {
    const blockquote = createCitation(obj);
    container.appendChild(blockquote);
  } else if (obj.type === "alert" && obj.children) {
    const alert = createAlert(obj);
    container.appendChild(alert);
  } else if (obj.type === "unordered-list" && obj.children) {
    const ul = createUnorderedList(obj);
    container.appendChild(ul);
  } else if (obj.type === "ordered-list" && obj.children) {
    const ol = createOrderedList(obj);
    container.appendChild(ol);
  } else if (obj.type === "table-of-contents") {
    const div = createTableOfContents(obj);
    container.appendChild(div);
  } else if (obj.type === "block-code" && obj.children) {
    const pre = createBlockCode(obj);
    container.appendChild(pre);
  } else if (obj.type === "list-element" && obj.children) {
    const li = createListElement(obj);
    container.appendChild(li);
  } else if (obj.type === "task-list-element" && obj.children) {
    const li = createTaskListElement(obj);
    container.appendChild(li);
  } else if (obj.type === "title" && obj.children) {
    const heading = createTitle(obj);
    container.appendChild(heading);
  } else if (obj.type === "code" && obj.children) {
    const code = createCode(obj);
    container.appendChild(code);
  } else if (obj.type === "date") {
    const time = createDate(obj);
    container.appendChild(time);
  } else if (obj.type === "strikethrough" && obj.children) {
    const del = createStrikethrough(obj);
    container.appendChild(del);
  } else if (obj.type === "italic" && obj.children) {
    const em = createItalic(obj);
    container.appendChild(em);
  } else if (obj.type === "bold" && obj.children) {
    const strong = createBold(obj);
    container.appendChild(strong);
  } else if (obj.type === "subscript" && obj.children) {
    const sub = createSubscript(obj);
    container.appendChild(sub);
  } else if (obj.type === "superscript" && obj.children) {
    const sup = createSuperscript(obj);
    container.appendChild(sup);
  } else if (obj.type === "french-quotation-mark" && obj.children) {
    const text = createFrenchQuotationMark(obj);
    container.appendChild(text);
  } else if (obj.type === "underline" && obj.children) {
    const u = createUnderline(obj);
    container.appendChild(u);
  } else if (obj.type === "divider") {
    const divider = createDivider();
    container.appendChild(divider);
  } else if (obj.type === "color" && obj.children) {
    const color = createColor(obj);
    container.appendChild(color);
  } else if (obj.type === "unicode" && obj.children) {
    const char = createUnicode(obj);
    container.appendChild(char);
  } else if (obj.type === "paragraph" && obj.children) {
    const p = createParagraph(obj);
    container.appendChild(p);
  } else if (obj.type === "var" && obj.children) {
    const p = createVar(obj);
    container.appendChild(p);
  } else if (obj.type === "image" && obj.source) {
    const img = createImage(obj);
    container.appendChild(img);
  } else if (obj.type === "footnote-ref") {
    const element = createFootnoteRef(obj);
    container.appendChild(element);
  } else if (obj.type === "section-footnote") {
    const section = createSectionFootnote(obj);
    container.appendChild(section);
  } else if (obj.type === "footnote" && obj.id) {
    if (obj.inactive || footnoteIds.includes(obj.id)) return;
    const footnote = document.createElement("li");
    footnote.classList.add("footnote");
    footnote.id = "fn-" + obj.id;
    addFootnoteId(obj.id);
    const p = document.createElement("p");
    p.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
    footnote.innerHTML = obj.children
      .map((child) => renderToHTML(child))
      .join("");
    container.appendChild(footnote);
  } else if (obj.type === "link" && obj.children) {
    const a = createLink(obj);
    container.appendChild(a);
  } else if (obj.type === "text" && obj.children) {
    container.textContent = obj.children;
  }

  return container.innerHTML;
}
