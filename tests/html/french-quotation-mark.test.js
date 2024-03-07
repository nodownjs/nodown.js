import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(
    parser(elementTest, {
      ...parserOptions,
      "french-quotation-mark": {
        disabled: false,
      },
    })[0]
  );
}

const text = `Du texte simple mais français`;

describe("French quotation mark", () => {
  it("Basic french quotation mark", () => {
    const frTest = `"${text}"`;
    const frResult = `<p>« ${text} »</p>`;
    const fr = generateTest(frTest);
    expect(fr).toBe(frResult);
  });
});
