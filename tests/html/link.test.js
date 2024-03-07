import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[1]);
}

const linkUrl = `https://example.com`;
const linkText = `Text of the link`;

describe("Link", () => {
  it("Basic link", () => {
    const linkTest = `[${linkText}](${linkUrl})`;
    const linkResult = `<a href="${linkUrl}">${linkText}</a>`;
    const link = generateTest(linkTest);
    expect(link).toBe(linkResult);
  });
});
