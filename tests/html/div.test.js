import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const textContent = "Some text content";
const allStyle = "overflow-y: hidden; flex: 1 0 0%;";

function generateTest(elementTest, index) {
  return renderToHTML(
    parser(elementTest, {
      ...parserOptions,
      horizontalAlignment: {
        disabled: false,
      },
      hideDisabledElements: false,
    })[index]
  );
}

describe("Div", () => {
  it("Default div", () => {
    const divTest = `${textContent}`;
    const divResult = `<div><div><p>${textContent}</p></div></div>`;
    const div = generateTest(divTest, 0);
    expect(div).toBe(divResult);
  });

  it("Basic div", () => {
    const divTest = `------\n${textContent}`;
    const divResult = `<div style="text-align: left;"><div style="${allStyle}"><p>${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });

  it("Flex div", () => {
    const divTest = `======\n${textContent}`;
    const divResult = `<div style="display: flex; justify-content: left;"><div style="${allStyle}"><p>${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
});
