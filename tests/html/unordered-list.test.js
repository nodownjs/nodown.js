import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const ulText = `Some list item text`;

describe("Unordered-list", () => {
  it("Basic unordered list", () => {
    const ulTest = `- ${ulText}\n- ${ulText}\n- ${ulText}`;
    const ulResult = `<ul><li>${ulText}</li><li>${ulText}</li><li>${ulText}</li></ul>`;
    const ul = generateTest(ulTest);
    expect(ul).toBe(ulResult);
  });

  it("With sub-list 1", () => {
    const ulTest = `- ${ulText}\n- ${ulText}\n  - ${ulText}`;
    const ulResult = `<ul><li>${ulText}</li><li>${ulText}<ul><li>${ulText}</li></ul></li></ul>`;
    const ul = generateTest(ulTest);
    expect(ul).toBe(ulResult);
  });

  it("With sub-list 1", () => {
    const ulTest = `- ${ulText}\n- ${ulText}\n  - ${ulText}\n  - ${ulText}`;
    const ulResult = `<ul><li>${ulText}</li><li>${ulText}<ul><li>${ulText}</li><li>${ulText}</li></ul></li></ul>`;
    const ul = generateTest(ulTest);
    expect(ul).toBe(ulResult);
  });

  it("With sub-list 3", () => {
    const ulTest = `- ${ulText}\n- ${ulText}\n  - ${ulText}\n- ${ulText}`;
    const ulResult = `<ul><li>${ulText}</li><li>${ulText}<ul><li>${ulText}</li></ul></li><li>${ulText}</li></ul>`;
    const ul = generateTest(ulTest);
    expect(ul).toBe(ulResult);
  });

  it("With sub-list 4", () => {
    const ulTest = `- ${ulText}\n- ${ulText}\n  - ${ulText}\n    - ${ulText}\n- ${ulText}`;
    const ulResult = `<ul><li>${ulText}</li><li>${ulText}<ul><li>${ulText}<ul><li>${ulText}</li></ul></li></ul></li><li>${ulText}</li></ul>`;
    const ul = generateTest(ulTest);
    expect(ul).toBe(ulResult);
  });
});
