import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const tableHeaderText = `Header`;
const tableBodyText = `Body`;
const dataNumber = 4;

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

describe("Table", () => {
  it("Basic table", () => {
    const tableHeader = "|" + ` ${tableHeaderText} |`.repeat(dataNumber);
    const tableSeparator = "|" + ` - |`.repeat(dataNumber);
    const tableBody = ("| " + ` ${tableBodyText} |`.repeat(dataNumber) + "\n")
      .repeat(dataNumber)
      .slice(0, -1);
    const tableResult =
      '<table class="nodown-table"><thead><tr class="nodown-table-row">' +
      `<th class="nodown-table-header" align="left">${tableHeaderText}</th>`.repeat(
        dataNumber
      ) +
      "</tr></thead><tbody>" +
      (
        `<tr class="nodown-table-row">` +
        `<td class="nodown-table-data" align="left">${tableBodyText}</td>`.repeat(
          dataNumber
        ) +
        `</tr>`
      ).repeat(dataNumber) +
      "</tbody></table>";
    const table = generateTest(
      tableHeader + "\n" + tableSeparator + "\n" + tableBody
    );
    expect(table).toBe(tableResult);
  });

  it("Only header", () => {
    const tableHeader = "|" + ` ${tableHeaderText} |`.repeat(dataNumber);
    const tableSeparator = "|" + ` -: |`.repeat(dataNumber);
    const tableResult =
      '<table class="nodown-table"><thead><tr class="nodown-table-row">' +
      `<th class="nodown-table-header" align="right">${tableHeaderText}</th>`.repeat(
        dataNumber
      ) +
      "</tr></thead><tbody></tbody></table>";
    const table = generateTest(tableHeader + "\n" + tableSeparator);
    expect(table).toBe(tableResult);
  });
  it("With right align", () => {
    const tableHeader = "|" + ` ${tableHeaderText} |`.repeat(dataNumber);
    const tableSeparator = "|" + ` -: |`.repeat(dataNumber);
    const tableBody = ("| " + ` ${tableBodyText} |`.repeat(dataNumber) + "\n")
      .repeat(dataNumber)
      .slice(0, -1);
    const tableResult =
      '<table class="nodown-table"><thead><tr class="nodown-table-row">' +
      `<th class="nodown-table-header" align="right">${tableHeaderText}</th>`.repeat(
        dataNumber
      ) +
      "</tr></thead><tbody>" +
      (
        `<tr class="nodown-table-row">` +
        `<td class="nodown-table-data" align="right">${tableBodyText}</td>`.repeat(
          dataNumber
        ) +
        `</tr>`
      ).repeat(dataNumber) +
      "</tbody></table>";
    const table = generateTest(
      tableHeader + "\n" + tableSeparator + "\n" + tableBody
    );
    expect(table).toBe(tableResult);
  });
  it("With different align", () => {
    const tableHeader = "|" + ` ${tableHeaderText} |`.repeat(dataNumber);
    const tableSeparator = "|" + ` :- | -: |`.repeat(dataNumber / 2);
    const tableBody = ("| " + ` ${tableBodyText} |`.repeat(dataNumber) + "\n")
      .repeat(dataNumber)
      .slice(0, -1);
    const tableResult =
      '<table class="nodown-table"><thead><tr class="nodown-table-row">' +
      `<th class="nodown-table-header" align="left">${tableHeaderText}</th><th class=\"nodown-table-header\" align="right">${tableHeaderText}</th>`.repeat(
        dataNumber / 2
      ) +
      "</tr></thead><tbody>" +
      (
        `<tr class="nodown-table-row">` +
        `<td class="nodown-table-data" align="left">${tableBodyText}</td><td class="nodown-table-data" align="right">${tableBodyText}</td>`.repeat(
          dataNumber / 2
        ) +
        `</tr>`
      ).repeat(dataNumber) +
      "</tbody></table>";
    const table = generateTest(
      tableHeader + "\n" + tableSeparator + "\n" + tableBody
    );
    expect(table).toBe(tableResult);
  });
});
