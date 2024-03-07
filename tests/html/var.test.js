import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const varValue = `This is var`;
const varText = `The value of the variable is :`;
const varName = `varName`;

describe("Var", () => {
  it("Basic var", () => {
    const varTest = "<" + varName + ">\n<" + varName + ">: " + varValue;
    const varResult = `<p><span>${varValue}</span></p>`;
    const var_ = generateTest(varTest);
    expect(var_).toBe(varResult);
  });
  it("With text", () => {
    const varTest =
      varText + " <" + varName + ">\n<" + varName + ">: " + varValue;
    const varResult = `<p>${varText} <span>${varValue}</span></p>`;
    const var_ = generateTest(varTest);
    expect(var_).toBe(varResult);
  });
});
