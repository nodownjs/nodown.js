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
    const footnoteResult = `<p class="nodown-paragraph">${text}<sup class="nodown-superscript nodown-footnote-ref"><a class="nodown-link" id="fnref-${footnoteId}" href="#fn-${footnoteId}">1</a></sup></p>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
  it("Inactive footnote", () => {
    const footnoteTest = `${text}[^${footnoteId}]\n[^${footnoteId}-inactive]: ${footnoteText}`;
    const footnoteResult = `<p class="nodown-paragraph">${text}[^${footnoteId}]</p>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
  it("Multiple footnotes", () => {
    const footnoteTest = `${text}[^${footnoteId}]${text}[^${footnoteId}]\n[^${footnoteId}]: ${footnoteText}`;
    const footnoteResult = `<p class="nodown-paragraph">${text}<sup class="nodown-superscript nodown-footnote-ref"><a class="nodown-link" id="fnref-${footnoteId}" href="#fn-${footnoteId}">1</a></sup>${text}<sup class="nodown-superscript nodown-footnote-ref"><a class="nodown-link" id="fnref-${footnoteId}-1" href="#fn-${footnoteId}">1</a></sup></p>`;
    const footnote = generateTest(footnoteTest);
    expect(footnote).toBe(footnoteResult);
  });
});
