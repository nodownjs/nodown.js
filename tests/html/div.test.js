import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const textContent = "Some text content";

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

describe("Citation", () => {
  it("Default div", () => {
    const divTest = `${textContent}`;
    const divResult = `<div><div><p>${textContent}</p></div></div>`;
    const div = generateTest(divTest, 0);
    expect(div).toBe(divResult);
  });

  it("Basic div", () => {
    const divTest = `------\n${textContent}`;
    const divResult = `<div><div><p>${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });

  it("Flex div", () => {
    const divTest = `======\n${textContent}`;
    const divResult = `<div style="display: flex; justifyContent: align;"><div style="flex: 1 0 0%;"><p>${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
});
