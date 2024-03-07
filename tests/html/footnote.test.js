import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[1].children[0]);
}

const footnoteId = `footnote-1`;
const footnoteText = `Some footnote text`;
const text = `Some simple text`;

describe("Footnote", () => {
  it("Basic footnote", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<li class="footnote" id="fn-${footnoteId}">${footnoteText}<a href="#fnref-${footnoteId}"> ↩</a></li>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
  it("Inactive footnote", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}-inactive]: ${footnoteText}`;
    const footnoteResult = `<li class="footnote" id="fn-${footnoteId}-inactive">${footnoteText}</li>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
  it("Multiple footnotes", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<li class="footnote" id="fn-${footnoteId}">${footnoteText}<a href="#fnref-${footnoteId}"> ↩<sup>1</sup></a><a href="#fnref-${footnoteId}-1"> ↩<sup>2</sup></a></li>`;
    const footnote = renderToHTML(
      parser(footnoteTest, parserOptions)[2].children[0]
    );
    expect(footnote).toBe(footnoteResult);
  });
});
