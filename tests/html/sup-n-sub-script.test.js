import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[1]);
}

const suText = `Some su text`;
const boldText = `Some bold text`;

describe("Sup and Sub", () => {
  it("Basic Sup", () => {
    const suTest = `<^${suText}>`;
    const suResult = `<sup>${suText}</sup>`;
    const su = generateTest(suTest);
    expect(su).toBe(suResult);
  });
  it("Basic Sub", () => {
    const suTest = `<_${suText}>`;
    const suResult = `<sub>${suText}</sub>`;
    const su = generateTest(suTest);
    expect(su).toBe(suResult);
  });

  it("Sup with bold", () => {
    const suTest = `<_${suText} **${boldText}**>`;
    const suResult = `<sub>${suText} <strong>${boldText}</strong></sub>`;
    const su = generateTest(suTest);
    expect(su).toBe(suResult);
  });

  it("Sup in bold", () => {
    const suTest = `**${boldText} <_${suText}>**`;
    const suResult = `<strong>${boldText} <sub>${suText}</sub></strong>`;
    const su = generateTest(suTest);
    expect(su).toBe(suResult);
  });
});