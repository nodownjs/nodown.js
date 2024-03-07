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
    const boldResult = `<p><strong>${boldText}</strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("underline in bold", () => {
    const boldTest = `**${boldText} ==${underlineText}==**`;
    const boldResult = `<p><strong>${boldText} <u>${underlineText}</u></strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("italic in bold", () => {
    const boldTest = `**${boldText} *${italicText}***`;
    const boldResult = `<p><strong>${boldText} <em>${italicText}</em></strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("italic and bold", () => {
    const boldTest = `***${boldText}***`;
    const boldResult = `<p><strong><em>${boldText}</em></strong></p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });

  it("Not bold because of space", () => {
    const boldTest = `**${boldText} **`;
    const boldResult = `<p>${boldTest}</p>`;
    const bold = generateTest(boldTest);
    expect(bold).toBe(boldResult);
  });
});
