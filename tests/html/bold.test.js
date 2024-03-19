import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const boldText = `Some bold text`;
const underlineText = `Some underline text`;
const italicText = `Some italic text`;

describe("Bold", () => {
  it("Basic bold", () => {
    const boldTest = `**${boldText}**`;
    const boldResult = `<p class="nodown-paragraph"><strong class="nodown-strong">${boldText}</strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("underline in bold", () => {
    const boldTest = `**${boldText} ==${underlineText}==**`;
    const boldResult = `<p class="nodown-paragraph"><strong class="nodown-strong">${boldText} <u class="nodown-underline">${underlineText}</u></strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("italic in bold", () => {
    const boldTest = `**${boldText} *${italicText}***`;
    const boldResult = `<p class="nodown-paragraph"><strong class="nodown-strong">${boldText} <em class="nodown-emphasis">${italicText}</em></strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("italic and bold", () => {
    const boldTest = `***${boldText}***`;
    const boldResult = `<p class="nodown-paragraph"><strong class="nodown-strong"><em class="nodown-emphasis">${boldText}</em></strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("Not bold because of space", () => {
    const boldTest = `**${boldText} **`;
    const boldResult = `<p class="nodown-paragraph">${boldTest}</p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });
});
