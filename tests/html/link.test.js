import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[0]);
}

const linkUrl = `https://example.com`;
const linkText = `Text of the link`;
const linkTitle = `Title of the link`;

describe("Link", () => {
  it("Basic link", () => {
    const linkTest = `[${linkText}](${linkUrl})`;
    const linkResult = `<a class="nodown-link" href="${linkUrl}">${linkText}</a>`;
    const link = generateTest(linkTest);
    expect(link).toBe(linkResult);
  });

  it("Without text", () => {
    const linkTest = `[](${linkUrl})`;
    const linkResult = `<a class="nodown-link" href="${linkUrl}">${linkUrl}</a>`;
    const link = generateTest(linkTest);
    expect(link).toBe(linkResult);
  });

  it("With title", () => {
    const linkTest = `[${linkText}](${linkUrl};${linkTitle})`;
    const linkResult = `<a class="nodown-link" href="${linkUrl}" title="${linkTitle}">${linkText}</a>`;
    const link = generateTest(linkTest);
    expect(link).toBe(linkResult);
  });
});
