import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

describe("Divider", () => {
  it("Basic divider", () => {
    const dividerTest = `---`;
    const dividerResult = `<hr />`;
    const divider = generateTest(dividerTest);
    expect(divider).toBe(dividerResult);
  });
});
