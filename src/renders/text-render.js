import { globalTableRegExp } from "../config";

export default function renderToText(obj) {
  const arr = [];
  const blockElements = ["title", "citation", "alert", "table", "block-code"];
  const extraBlockElement = ["section", "section-var", "paragraph"];

  let listType = "";
  var orderedNumber = [];

  let divType = "";
  let divFirst = 0;

  function addLine(count = 1) {
    for (let i = 0; i < count; i++) {
      arr.push("\n");
    }
  }

  function convert(obj, noNewLine = false) {
    const isBlock = blockElements.includes(obj.type);
    const isExtraBlock = extraBlockElement.includes(obj.type);

    if (isBlock && !noNewLine) {
      addLine(2);
    }
    if (isExtraBlock && !noNewLine) {
      addLine();
    }

    switch (obj.type) {
      case "root":
      case "section":
      case "div":
        if (obj.display === "inline") {
          addLine(2);
          arr.push("======");
          divType = "inline";
        } else if (divType === "inline") {
          addLine(2);
          arr.push("------");
          divType = "block";
        }
        obj.children.forEach((child) => convert(child));
        divFirst = 0;
        break;
      case "sub-div":
        addLine();
        if (divFirst > 0) {
          addLine();
          arr.push("===");
          addLine();
        }
        divFirst++;
        obj.children.forEach((child) => convert(child));
        break;
      case "title":
        arr.push("#".repeat(obj.level) + " ");
        obj.children.forEach((child) => convert(child));
        if (obj.id && !obj.id.match(/^title-\d+$/)) arr.push(`{#${obj.id}}`);
        addLine();
        break;
      case "divider":
        addLine();
        arr.push("---");
        break;
      case "citation":
        arr.push("> ");
        obj.children.forEach((child) => convert(child));
        break;
      case "alert":
        let variant = "";
        switch (obj.variant) {
          case "warning":
            variant = "!";
            break;
          case "note":
            variant = "i";
            break;
          case "error":
            variant = "-";
            break;
          case "success":
            variant = "+";
            break;
          case "question":
            variant = "?";
            break;
        }
        arr.push(">" + variant + " ");
        obj.title.forEach((child) => convert(child));
        obj.children.forEach((child) => {
          addLine();
          arr.push(">" + variant + " ");
          convert(child, true);
        });
        break;
      case "unordered-list":
        listType = "unordered";
        // orderedNumber = 1;
        if (obj.level === 0) addLine();
        obj.children.forEach((child) => convert(child));
        break;
      case "ordered-list":
        listType = "ordered";
        orderedNumber[obj.level] = obj.start;
        if (obj.level === 0) addLine();
        obj.children.forEach((child) => convert(child));
        break;
      case "list-element":
        addLine();
        if (listType == "ordered") {
          arr.push("  ".repeat(obj.level) + orderedNumber[obj.level] + ". ");
          orderedNumber[obj.level]++;
        } else {
          arr.push("  ".repeat(obj.level) + "- ");
        }
        obj.children.forEach((child) => convert(child));
        break;
      case "task-list-element":
        addLine();
        let check = obj.checked ? "[x]" : "[ ]";
        arr.push("  ".repeat(obj.level) + "- " + check);
        obj.children.forEach((child) => convert(child));
        break;
      case "table-of-contents":
        addLine();
        arr.push("[[table-of-contents]]");
        break;
      case "section-footnote":
      case "section-var":
        addLine();
        obj.children.forEach((child) => convert(child));
        break;
      case "footnote":
        addLine();
        arr.push(`[^${obj.id}]: `);
        const filteredLinks = obj.children.filter((obj) => obj.type === "link");
        const footnoteChildren = obj.children.filter((child) => {
          if (
            !(
              child.type === "link" &&
              child.href &&
              child.href.startsWith("#fnref-")
            )
          ) {
            return child;
          }
        });
        footnoteChildren.forEach((child) => convert(child));
        break;
      case "table":
        const headerArr = [...obj.rawHeader.matchAll(globalTableRegExp)]
          .filter((_, i) => i !== 0)
          .map((d) => d[1].trim());

        const headerLength = headerArr.map((d) => d.length);

        let alignArr = [];

        alignArr = [...obj.rawSeparator.matchAll(globalTableRegExp)]
          .filter((_, i) => i !== 0)
          .map((d) => d[1].trim());

        const alignLength = alignArr.map((d) => d.length);

        let rowsArr = [];

        rowsArr = obj.rawRows.map((row) => {
          return [...row.matchAll(globalTableRegExp)]
            .filter((_, i) => i !== 0)
            .map((d) => d[1].replace(/\s+/g, " "));
        });

        const rowsLength = rowsArr.map((row) =>
          row.map((d) => d.trim().length)
        );

        function getMaxForEachElement(tableau) {
          return tableau[0].map((_, i) => {
            return tableau.reduce(
              (max, array) => Math.max(max, array[i]) | 0,
              tableau[0][i]
            );
          });
        }

        rowsLength.push(headerLength);
        rowsLength.push(alignLength);

        const lengthArr = getMaxForEachElement(rowsLength);

        arr.push("|");
        headerArr.forEach((child, i) => {
          arr.push(" ");
          arr.push(child);
          if (lengthArr[i] - child.length > 0)
            arr.push(" ".repeat(lengthArr[i] - child.length));
          arr.push(" |");
        });

        addLine();

        arr.push("|");
        alignArr.forEach((child, i) => {
          arr.push(" ");
          arr.push(child);
          if (lengthArr[i] - child.length > 0)
            arr.push("-".repeat(lengthArr[i] - child.length));
          arr.push(" |");
        });

        addLine();

        rowsArr.forEach((row) => {
          arr.push("|");
          row.forEach((child, i) => {
            arr.push(" ");
            arr.push(child);
            if (lengthArr[i] - child.length > 0)
              arr.push(" ".repeat(lengthArr[i] - child.length));
            arr.push(" |");
          });
          addLine();
        });

        // arr.push("|");
        // obj.headers.forEach((_, i) => {
        //   arr.push(" ");
        //   arr.push("-");
        //   arr.push("_".repeat(lengthArr[i] - child.length));
        //   arr.push(" |");
        // });

        // addLine();

        // obj.rows.forEach((child) => {
        //   convert(child);
        // });

        break;
      case "table-header":
      case "table-data":
        obj.children.forEach((child) => convert(child));
        break;
      case "table-row":
        arr.push("|");
        obj.children.forEach((child, i) => {
          arr.push(" ");
          convert(child);
          arr.push(" |");
        });
        addLine();
        break;
      case "var-content":
        arr.push("<");
        arr.push(obj.id);
        arr.push(">: ");
        obj.children.forEach((child, i) => {
          convert(child);
        });
        addLine();
        break;
      case "block-code":
        arr.push("```");
        arr.push(obj.language);
        addLine();
        obj.children.forEach((child, i) => {
          if (i > 0) addLine();
          return convert(child);
        });
        addLine();
        arr.push("```");
        break;
      // --------------------
      case "subscript":
        arr.push("<_");
        obj.children.forEach((child) => convert(child));
        arr.push(">");
        break;
      case "superscript":
        arr.push("<^");
        obj.children.forEach((child) => convert(child));
        arr.push(">");
        break;
      case "french-quotation-mark":
        arr.push('"');
        obj.children.forEach((child) => convert(child));
        arr.push('"');
        break;
      case "strikethrough":
        arr.push("~~");
        obj.children.forEach((child) => convert(child));
        arr.push("~~");
        break;
      case "unicode":
        arr.push("`");
        obj.children.forEach((child) => convert(child));
        arr.push("`");
        break;
      case "footnote-ref":
        arr.push(`[^${obj.ref}]`);
        break;
      case "image":
        let { title, width, height, alt, source, render } = obj;
        arr.push("![");
        if (alt) arr.push(alt);
        if (width || height || render) arr.push(";" + (width || ""));
        if (height || render) arr.push(";" + (height || ""));
        if (render) arr.push(";" + render || "");
        arr.push("](" + source);
        if (title) arr.push(";" + title);
        arr.push(")");
        break;
      case "link":
        const { linkTitle, children, href } = obj;
        arr.push("[");
        obj.children.forEach((child) => convert(child));
        arr.push("](" + href);
        if (linkTitle) arr.push(";" + linkTitle);
        arr.push(")");
        break;
      case "color":
        arr.push("`");
        obj.children.forEach((child) => convert(child));
        arr.push("`");
        break;
      case "underline":
        arr.push("==");
        obj.children.forEach((child) => convert(child));
        arr.push("==");
        break;
      case "italic":
        arr.push("*");
        obj.children.forEach((child) => convert(child));
        arr.push("*");
        break;
      case "bold":
        arr.push("**");
        obj.children.forEach((child) => convert(child));
        arr.push("**");
        break;
      case "boldAndItalic":
        arr.push("***");
        obj.children.forEach((child) => convert(child));
        arr.push("***");
        break;
      case "code":
        if (obj.formatted) arr.push("<");
        arr.push("`");
        obj.children.forEach((child) => convert(child));
        arr.push("`");
        if (obj.formatted) arr.push(">");
        break;
      case "var":
        arr.push("<");
        arr.push(obj.id);
        arr.push(">");
        break;
      case "date":
        const timeFormatMap = {
          "short-time": "t",
          "long-time": "T",
          "short-date": "d",
          "long-date": "D",
          "short-full": "f",
          "long-full": "F",
          "short-relative": "r",
          "long-relative": "R",
        };
        const outFormat = timeFormatMap[obj.outFormat];
        const dateFormatMap = {
          timestamp: "t",
          eureopean: "eu",
          american: "us",
          iso: "iso",
        };
        const inFormat = dateFormatMap[obj.inFormat];
        function formaterDate(timestamp, format) {
          const date = new Date(timestamp);
          const y = date.getFullYear().toString().padStart(2, "0");
          const m = (date.getMonth() + 1).toString().padStart(2, "0");
          const d = date.getDate().toString().padStart(2, "0");
          const h = date.getHours().toString().padStart(2, "0");
          const mn = date.getMinutes().toString().padStart(2, "0");
          const s = date.getSeconds().toString().padStart(2, "0");
          switch (format) {
            case "iso":
              return `${y}-${m}-${d} ${h}:${mn}:${s}`;
            case "eu":
              return `${d}-${m}-${y} ${h}:${mn}:${s}`;
            case "us":
              return `${m}-${d}-${y} ${h}:${mn}:${s}`;
            case "t":
              return (timestamp/1000).toString();
              return (timestamp / 1000).toString();
          }
        }
        const date = formaterDate(obj.timestamp, inFormat);
        const result = `<${inFormat}:${date}:${outFormat}>`;
        arr.push(result);
        break;
      case "paragraph":
        obj.children.forEach((child) => convert(child));
        break;
      case "text":
        arr.push(obj.children);
        break;
    }
  }

  convert(obj);

  const result = arr.join("").replace(/ +/g, " ");
  
  return result;
}
