import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const citationText = `Citation about something`;

describe("Citation", () => {
  it("Basic citation", () => {
    const citationTest = `> ${citationText}`;
    const citationResult = `<blockquote><p>${citationText}</p></blockquote>`;
    const citation = generateTest(citationTest);
    expect(citation).toBe(citationResult);
  });

  it("Multi lines", () => {
    const citationTest = `> ${citationText}\n> ${citationText}`;
    const citationResult = `<blockquote><p>${citationText}</p><p>${citationText}</p></blockquote>`;
    const citation = generateTest(citationTest);
    expect(citation).toBe(citationResult);
  });
});
