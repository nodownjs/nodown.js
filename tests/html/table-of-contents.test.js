import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[4]);
}

const h1 = `Heading 1`;
const h2 = `Heading 2`;
const h31 = `Heading 3.1`;
const h32 = `Heading 3.2`;

describe("Table of contents", () => {
  it("Basic table of contents", () => {
    const tocTest = `# ${h1}\n## ${h2}\n### ${h31}\n### ${h32}\n[[table-of-contents]]`;
    const tocResult = `<div class="nodown-table-of-contents"><ul class="nodown-unordered-list"><li class="nodown-list-element"><a class="nodown-link" href="#title-1">${h2}</a><ul class="nodown-unordered-list"><li class="nodown-list-element"><a class="nodown-link" href="#title-2">${h31}</a></li><li class="nodown-list-element"><a class="nodown-link" href="#title-3">${h32}</a></li></ul></li></ul></div>`;
    const toc = generateTest(tocTest);
    expect(toc).toBe(tocResult);
  });
});
