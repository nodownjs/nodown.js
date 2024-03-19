import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

const textContent = "Some text content";
const allStyle = [`overflow-y: hidden;`, `flex: 1 0 0%;`];

function generateTest(elementTest, index1, index2) {
  return renderToHTML(
    parser(elementTest, {
      ...parserOptions,
      horizontalAlignment: {
        disabled: false,
      },
      hideDisabledElements: false,
    })[index1].children[index2]
  );
}

describe("Sub-div", () => {
  it("Default sub-div", () => {
    const divTest = `${textContent}`;
    const divResult = `<div class="nodown-sub-div" style="${allStyle[0]} ${allStyle[1]}"><p class="nodown-paragraph">${textContent}</p></div>`;
    const div = generateTest(divTest, 0, 0);
    expect(div).toBe(divResult);
  });

  it("Align left", () => {
    const divTest = `------\n===:\n${textContent}`;
    const divResult = `<div class="nodown-sub-div" style="${allStyle[0]} text-align: right; ${allStyle[1]}"><p class="nodown-paragraph">${textContent}</p></div>`;
    const div = generateTest(divTest, 1, 1);
    expect(div).toBe(divResult);
  });

  it("Align center", () => {
    const divTest = `------\n:===:\n${textContent}`;
    const divResult = `<div class="nodown-sub-div" style="${allStyle[0]} text-align: center; ${allStyle[1]}"><p class="nodown-paragraph">${textContent}</p></div>`;
    const div = generateTest(divTest, 1, 1);
    expect(div).toBe(divResult);
  });

  it("With min width", () => {
    const divTest = `------\n===|\n${textContent}\n===|\n${textContent}`;
    const divResult = `<div class="nodown-sub-div" style="${allStyle[0]} max-width: calc(100% - 0em); text-align: left; flex: 0 1 auto;"><p class="nodown-paragraph">${textContent}</p></div>`;
    const div = generateTest(divTest, 1, 1);
    expect(div).toBe(divResult);
  });

  it("Double min width", () => {
    const divTest = `------\n===|\n${textContent}\n===|\n${textContent}`;
    const divResult = `<div class="nodown-div" style="text-align: left;"><div class="nodown-sub-div" style="overflow-y: hidden; flex: 1 0 0%;"></div><div class="nodown-sub-div" style="${allStyle[0]} max-width: calc(33.33% - 0.67em); text-align: left; flex: 0 1 auto;"><p class="nodown-paragraph">${textContent}</p></div><div class="nodown-sub-div" style="${allStyle[0]} max-width: calc(33.33% - 0.67em); text-align: left; flex: 0 1 auto;"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = renderToHTML(
      parser(divTest, {
        ...parserOptions,
        horizontalAlignment: {
          disabled: false,
        },
        hideDisabledElements: false,
      })[1]
    );
    expect(div).toBe(divResult);
  });
});
