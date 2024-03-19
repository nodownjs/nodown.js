import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const sectionText = `Some section text`;

describe("Section", () => {
  it("Basic section", () => {
    const sectionTest = `${sectionText}`;
    const sectionResult = `<section class="nodown-section"><p class="nodown-paragraph">${sectionText}</p></section>`;
    const section = renderToHTML(
      parser(sectionTest, {
        ...parserOptions,
        section: { disabled: false },
      })[0]
    );
    expect(section).toBe(sectionResult);
  });

  it("With div and sub-div", () => {
    const sectionTest = `${sectionText}\n------\n===\n${sectionText}`;
    const sectionResult = `<section class="nodown-section"><div class="nodown-div"><div class="nodown-sub-div" style="overflow-y: hidden; flex: 1 0 0%;"><p class="nodown-paragraph">${sectionText}</p></div></div><div class="nodown-div" style="text-align: left;"><div class="nodown-sub-div" style="overflow-y: hidden; text-align: left; flex: 1 0 0%;"><p class="nodown-paragraph">${sectionText}</p></div></div></section>`;
    const section = renderToHTML(
      parser(sectionTest, {
        ...parserOptions,
        section: { disabled: false },
        horizontalAlignment: { disabled: false },
      })[0]
    );
    expect(section).toBe(sectionResult);
  });

  it("Without section", () => {
    const sectionTest = `${sectionText}`;
    const sectionResult = `<p class="nodown-paragraph">${sectionText}</p>`;
    const section = renderToHTML(
      parser(sectionTest, {
        ...parserOptions,
      })[0]
    );
    expect(section).toBe(sectionResult);
  });
});
