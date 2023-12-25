import { globalTableRegExp, tableRegExp } from "../config.js";
import { convertToObject } from "./inline.js";

export default function createTable(
  tableAlign,
  tableHeader,
  tableRows,
  rawHeader,
  rawSeparator,
  rawRows
) {
  const table = {
    type: "table",
    align: tableAlign,
    headers: tableHeader,
    rows: tableRows,
    rawHeader: rawHeader,
    rawSeparator: rawSeparator,
    rawRows: rawRows,
  };
  return table;
}

export function createTableHeader(line) {
  const matchs = [...line.matchAll(globalTableRegExp)].filter(
    (_, i) => i !== 0
  );
  const tableHeader = matchs.map((arr) => {
    return {
      type: "table-header",
      children: convertToObject(arr[1].trim(), "|"),
    };
  });
  return tableHeader;
}

export function createTableAlign(line) {
  const matchs = [...line.matchAll(globalTableRegExp)].filter(
    (_, i) => i !== 0
  );
  let tableAlign = matchs.map((arr) => arr[1].trim());
  const rightRegExp = /^-+:$/;
  const leftRegExp = /^:-+$/;
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
  return tableAlign;
}

export function updateTableHeaderAlign(tableHeader, tableAlign) {
  return tableHeader.map((header, i) => {
    return { ...header, align: tableAlign[i] };
  });
}

export function createTableRow(line, tableAlign) {
  const matchs = [...line.matchAll(globalTableRegExp)].filter(
    (_, i) => i !== 0
  );
  const tableRow = {
    type: "table-row",
    children: matchs.map((arr, i) => {
      return {
        type: "table-data",
        align: tableAlign[i],
        children: convertToObject(arr[1].trim(), "|"),
      };
    }),
  };
  return tableRow;
}
