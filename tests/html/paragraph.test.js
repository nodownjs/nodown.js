import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const paragraphText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

describe("Paragraph", () => {
  it("Basic paragraph", () => {
    const paragraphTest = `${paragraphText}`;
    const paragraphResult = `<p>${paragraphText}</p>`;
    const paragraph = generateTest(paragraphTest);
    expect(paragraph).toBe(paragraphResult);
  });

  it("With HTML", () => {
    const paragraphTest = `<strong>${paragraphText}</strong>`;
    const paragraphResult = `<p>&lt;strong&gt;${paragraphText}&lt;/strong&gt;</p>`;
    const paragraph = generateTest(paragraphTest);
    expect(paragraph).toBe(paragraphResult);
  });
});
