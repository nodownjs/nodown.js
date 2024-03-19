import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const footnoteId = `footnote-1`;
const footnoteText = `Some footnote text`;
const text = `Some simple text`;

describe("Footnote", () => {
  it("Basic footnote section", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<section class="nodown-section-footnote" id="footnotes"><div class="nodown-div"><div class="nodown-sub-div" style="overflow-y: hidden; flex: 1 0 0%;"><ol class="nodown-footnote-list"><li class="nodown-footnote" id="fn-${footnoteId}">${footnoteText}<a class="nodown-link" href="#fnref-${footnoteId}"> ↩</a></li></ol></div></div></section>`;
    const footnote = renderToHTML(
      parser(footnoteTest, {
        ...parserOptions,
        section: { disabled: false },
        horizontalAlignment: { disabled: false },
      })[1]
    );
    expect(footnote).toBe(footnoteResult);
  });

  it("Without div", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<section class="nodown-section-footnote" id="footnotes"><ol class="nodown-footnote-list"><li class="nodown-footnote" id="fn-${footnoteId}">${footnoteText}<a class="nodown-link" href="#fnref-${footnoteId}"> ↩</a></li></ol></section>`;
    const footnote = renderToHTML(
      parser(footnoteTest, {
        ...parserOptions,
        section: { disabled: false },
      })[1]
    );
    expect(footnote).toBe(footnoteResult);
  });

  it("Without section and div", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<ol class="nodown-footnote-list"><li class="nodown-footnote" id="fn-${footnoteId}">${footnoteText}<a class="nodown-link" href="#fnref-${footnoteId}"> ↩</a></li></ol>`;
    const footnote = renderToHTML(
      parser(footnoteTest, {
        ...parserOptions,
      })[1]
    );
    expect(footnote).toBe(footnoteResult);
  });
});
