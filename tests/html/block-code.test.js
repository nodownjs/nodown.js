import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const codeText = `const a = 1;\nconst b = 2;\nconst c = a + b;\nconsole.log(c);\n// 3`;
const codeLanguage = `javascript`;

describe("Block-code", () => {
  it("Without language", () => {
    const codeTest = `\`\`\`\n${codeText}\n\`\`\``;
    const codeResult = `<pre class="nodown-block-code"><code>${codeText}</code></pre>`;
    const code = generateTest(codeTest);
    expect(code).toBe(codeResult);
  });

  it("With language", () => {
    const codeTest = `\`\`\`${codeLanguage}\n${codeText}\n\`\`\``;
    const codeResult = `<pre class="nodown-block-code ${codeLanguage}"><code>${codeText}</code></pre>`;
    const code = generateTest(codeTest);
    expect(code).toBe(codeResult);
  });

  it("Without end", () => {
    const codeTest = `\`\`\`${codeLanguage}\n${codeText}`;
    const codeResult = `<section class="nodown-section"><p class="nodown-paragraph">\`\`\`${codeLanguage}</p>${codeText
      .split("\n")
      .map((text) => `<p class="nodown-paragraph">${text}</p>`)
      .join("")}</section>`;
    const code = renderToHTML(
      parser(codeTest, { ...parserOptions, section: { disabled: false } })[0]
    );
    expect(code).toBe(codeResult);
  });
});
