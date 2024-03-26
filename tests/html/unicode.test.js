import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[1]);
}

const char1 = `\\u21AA`;
const char2 = `U+1DDF`;

function charCode(rawChar) {
  return String.fromCodePoint(
    parseInt("0x" + rawChar.trim().replace(/(?:U\+|\\u|{|})/g, ""), 16)
  );
}

describe("char", () => {
  it("Basic char 1", () => {
    const charTest = `\`${char1}\``;
    const charResult = `<code class="nodown-code nodown-unicode"><span class="nodown-preview">${charCode(
      char1
    )}</span><span>${char1}</span></code>`;
    const char = generateTest(charTest);
    expect(char).toBe(charResult);
  });

  it("Basic char 2", () => {
    const charTest = `\`${char2}\``;
    const charResult = `<code class="nodown-code nodown-unicode"><span class="nodown-preview">${charCode(
      char2
    )}</span><span>${char2}</span></code>`;
    const char = generateTest(charTest);
    expect(char).toBe(charResult);
  });
});
