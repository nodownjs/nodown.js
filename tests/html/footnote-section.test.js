import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(
    parser(elementTest, {
      ...parserOptions,
      section: { disabled: false },
    })[1]
  );
}

const footnoteId = `footnote-1`;
const footnoteText = `Some footnote text`;
const text = `Some simple text`;

describe("Footnote", () => {
  it("Basic footnote section", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    console.log("🚀 ~ footnoteTest:", footnoteTest);
    const footnoteResult = `<section id="footnotes"><ol><li class="footnote" id="fn-${footnoteId}">${footnoteText}<a href="#fnref-${footnoteId}" > ↩</a></li></ol></section>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
});
