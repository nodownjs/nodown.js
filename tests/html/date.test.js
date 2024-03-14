import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[1]);
}

const dateRaw = `2000-02-04 01:00`;
const dateCode = `<i:${dateRaw}:F>`;

const dateL = new Date(dateRaw).toLocaleString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
});

describe("date", () => {
  it("Basic date", () => {
    const dateTest = `${dateCode}`;
    const dateResult = `<span title="${dateL.toLocaleString()}" class="nodown-date">${dateL}</span>`;
    const date = generateTest(dateTest);
    expect(date).toBe(dateResult);
  });
});
