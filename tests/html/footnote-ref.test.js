import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const footnoteId = `footnote-1`;
const footnoteText = `Some footnote text`;
const text = `Some simple text`;

describe("Footnote ref", () => {
  it("Basic footnote ref", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<p>${text}<sup><a id="fnref-${footnoteId}" href="#fn-${footnoteId}" class="footnote-ref">1</a></sup></p>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
  it("Inactive footnote", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}-inactive]: ${footnoteText}`;
    const footnoteResult = `<p>${text}[^${footnoteId}]</p>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
  it("Multiple footnotes", () => {
    const footnoteTest = `${text}[^${footnoteId}]${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<p>${text}<sup><a id="fnref-${footnoteId}" href="#fn-${footnoteId}" class="footnote-ref">1</a></sup>${text}<sup><a id="fnref-${footnoteId}-1" href="#fn-${footnoteId}" class="footnote-ref">1</a></sup></p>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
});
