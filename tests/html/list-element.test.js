import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[0]);
}

const liText = `Some list item text`;

describe("List-element", () => {
  it("Basic list element", () => {
    const liTest = `- ${liText}`;
    const liResult = `<li>${liText}</li>`;
    const li = generateTest(liTest);
    expect(li).toBe(liResult);
  });

  it("With checkbox unchecked", () => {
    const liTest = `- [ ] ${liText}`;
    const liResult = `<li><input type="checkbox" />${liText}</li>`;
    const li = generateTest(liTest);
    expect(li).toBe(liResult);
  });

  it("With checkbox checked", () => {
    const liTest = `- [x] ${liText}`;
    const liResult = `<li><input type="checkbox" checked />${liText}</li>`;
    const li = generateTest(liTest);
    expect(li).toBe(liResult);
  });
});
