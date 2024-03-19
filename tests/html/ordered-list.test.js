import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const olText = `Some list item text`;
const start = 10;

describe("Ordered-list", () => {
  it("Basic ordered list", () => {
    const olTest = `1. ${olText}\n2. ${olText}\n3. ${olText}`;
    const olResult = `<ol class="nodown-ordered-list"><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li></ol>`;
    const ol = generateTest(olTest);
    expect(ol).toBe(olResult);
  });

  it("Without ordered", () => {
    const olTest = `1. ${olText}\n1. ${olText}\n1. ${olText}`;
    const olResult = `<ol class="nodown-ordered-list"><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li></ol>`;
    const ol = generateTest(olTest);
    expect(ol).toBe(olResult);
  });

  it("Different start", () => {
    const olTest = `${start}. ${olText}\n${start + 1}. ${olText}\n${
      start + 2
    }. ${olText}`;
    const olResult = `<ol class="nodown-ordered-list" start="${start}"><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li></ol>`;
    const ol = generateTest(olTest);
    expect(ol).toBe(olResult);
  });

  it("Different start without ordered", () => {
    const olTest = `${start}. ${olText}\n${start}. ${olText}\n${start}. ${olText}`;
    const olResult = `<ol class="nodown-ordered-list" start="${start}"><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li><li class="nodown-list-element">${olText}</li></ol>`;
    const ol = generateTest(olTest);
    expect(ol).toBe(olResult);
  });
});
