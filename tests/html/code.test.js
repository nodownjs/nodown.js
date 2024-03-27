import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[0]);
}

const codeText = `Some code text`;

describe("code", () => {
  it("Basic code", () => {
    const codeTest = `\`${codeText}\``;
    const codeResult = `<code class="nodown-code">${codeText}</code>`;
    const code = generateTest(codeTest);
    expect(code).toBe(codeResult);
  });

  it("With inline syntax", () => {
    const codeTest = `\`*${codeText}*\``;
    const codeResult = `<code class="nodown-code">*${codeText}*</code>`;
    const code = generateTest(codeTest);
    expect(code).toBe(codeResult);
  });

  it("With backslash 1", () => {
    const codeTest = "`" + codeText + "\\`";
    const codeResult = `<code class="nodown-code">${codeText}\\</code>`;
    const code = generateTest(codeTest);
    expect(code).toBe(codeResult);
  });

  it("With backslash 2", () => {
    const codeTest = "`" + codeText + "\\`" + codeText + "`";
    const codeResult = `<p class="nodown-paragraph"><code class="nodown-code">${codeText}\\</code>${codeText}\`</p>`;
    const code = renderToHTML(parser(codeTest, parserOptions)[0]);
    expect(code).toBe(codeResult);
  });
});
