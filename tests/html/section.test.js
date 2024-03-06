import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const sectionText = `Some section text`;

describe("Section", () => {
  it("Basic section", () => {
    const sectionTest = `${sectionText}`;
    const sectionResult = `<section><p>${sectionText}</p></section>`;
    const section = renderToHTML(
      parser(sectionTest, {
        ...parserOptions,
        section: { disabled: false },
      })[0]
    );
    expect(section).toBe(sectionResult);
  });

  it("Without section", () => {
    const sectionTest = `${sectionText}`;
    const sectionResult = `<p>${sectionText}</p>`;
    const section = renderToHTML(
      parser(sectionTest, {
        ...parserOptions,
      })[0]
    );
    expect(section).toBe(sectionResult);
  });
});
