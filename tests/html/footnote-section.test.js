import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const footnoteId = `footnote-1`;
const footnoteText = `Some footnote text`;
const text = `Some simple text`;

describe("Footnote", () => {
  it("Basic footnote section", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<section id="footnotes"><div><div><ol><li class="footnote" id="fn-${footnoteId}">${footnoteText}<a href="#fnref-${footnoteId}"> ↩</a></li></ol></div></div></section>`;
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
    const footnoteResult = `<section id="footnotes"><ol><li class="footnote" id="fn-${footnoteId}">${footnoteText}<a href="#fnref-${footnoteId}"> ↩</a></li></ol></section>`;
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
    const footnoteResult = `<ol><li class="footnote" id="fn-${footnoteId}">${footnoteText}<a href="#fnref-${footnoteId}"> ↩</a></li></ol>`;
    const footnote = renderToHTML(
      parser(footnoteTest, {
        ...parserOptions,
      })[1]
    );
    expect(footnote).toBe(footnoteResult);
  });
});
