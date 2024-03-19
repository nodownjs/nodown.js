import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const strikethroughText = `Some strikethrough text`;
const underlineText = `Some underline text`;
const italicText = `Some italic text`;

describe("strikethrough", () => {
  it("Basic strikethrough", () => {
    const strikethroughTest = `~~${strikethroughText}~~`;
    const strikethroughResult = `<p class="nodown-paragraph"><del class="nodown-strikethrough">${strikethroughText}</del></p>`;
    const strikethrough = generateTest(strikethroughTest);
    expect(strikethrough).toBe(strikethroughResult);
  });

  it("underline in strikethrough", () => {
    const strikethroughTest = `~~${strikethroughText} ==${underlineText}==~~`;
    const strikethroughResult = `<p class="nodown-paragraph"><del class="nodown-strikethrough">${strikethroughText} <u class="nodown-underline">${underlineText}</u></del></p>`;
    const strikethrough = generateTest(strikethroughTest);
    expect(strikethrough).toBe(strikethroughResult);
  });

  it("italic in strikethrough", () => {
    const strikethroughTest = `~~${strikethroughText} *${italicText}*~~`;
    const strikethroughResult = `<p class="nodown-paragraph"><del class="nodown-strikethrough">${strikethroughText} <em class="nodown-emphasis">${italicText}</em></del></p>`;
    const strikethrough = generateTest(strikethroughTest);
    expect(strikethrough).toBe(strikethroughResult);
  });

  it("Not strikethrough because of space", () => {
    const strikethroughTest = `~~${strikethroughText} ~~`;
    const strikethroughResult = `<p class="nodown-paragraph">${strikethroughTest}</p>`;
    const strikethrough = generateTest(strikethroughTest);
    expect(strikethrough).toBe(strikethroughResult);
  });
});
