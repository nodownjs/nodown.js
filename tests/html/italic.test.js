import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const italicText = `Some italic text`;
const underlineText = `Some underline text`;
const boldText = `Some bold text`;

describe("italic", () => {
  it("Basic italic", () => {
    const italicTest = `*${italicText}*`;
    const italicResult = `<p><em>${italicText}</em></p>`;
    const italic = generateTest(italicTest);
    expect(italic).toBe(italicResult);
  });

  it("underline in italic", () => {
    const italicTest = `*${italicText} ==${underlineText}==*`;
    const italicResult = `<p><em>${italicText} <u>${underlineText}</u></em></p>`;
    const italic = generateTest(italicTest);
    expect(italic).toBe(italicResult);
  });

  it("bold in italic", () => {
    const italicTest = `*${italicText} **${boldText}***`;
    const italicResult = `<p><em>${italicText} <strong>${boldText}</strong></em></p>`;
    const italic = generateTest(italicTest);
    expect(italic).toBe(italicResult);
  });

  it("Not italic because of space", () => {
    const italicTest = `*${italicText} *`;
    const italicResult = `<p>${italicTest}</p>`;
    const italic = generateTest(italicTest);
    expect(italic).toBe(italicResult);
  });

  it("Weird test", () => {
    const italicTest = `*${italicText} *${italicText}*`;
    const italicResult = `<p>*${italicText} <em>${italicText}</em></p>`;
    const italic = generateTest(italicTest);
    expect(italic).toBe(italicResult);
  });
});
