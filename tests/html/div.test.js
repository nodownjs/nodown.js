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
    const divResult = `<div class="nodown-div"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 0);
    expect(div).toBe(divResult);
  });

  it("Basic div", () => {
    const divTest = `------\n${textContent}`;
    const divResult = `<div class="nodown-div" style="text-align: left;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });

  it("Flex div", () => {
    const divTest = `======\n${textContent}`;
    const divResult = `<div class="nodown-div" style="display: flex; justify-content: left;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });

  it("Right aligned", () => {
    const divTest = `------:\n${textContent}`;
    const divResult = `<div class="nodown-div" style="text-align: right;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Left aligned", () => {
    const divTest = `:------\n${textContent}`;
    const divResult = `<div class="nodown-div" style="text-align: left;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Center aligned", () => {
    const divTest = `---:---\n${textContent}`;
    const divResult = `<div class="nodown-div" style="text-align: center;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Flex left aligned", () => {
    const divTest = `:======\n${textContent}`;
    const divResult = `<div class="nodown-div" style="display: flex; justify-content: left;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Flex right aligned", () => {
    const divTest = `======:\n${textContent}`;
    const divResult = `<div class="nodown-div" style="display: flex; justify-content: right;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Flex center aligned", () => {
    const divTest = `===:===\n${textContent}`;
    const divResult = `<div class="nodown-div" style="display: flex; justify-content: center;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Flex space-between aligned", () => {
    const divTest = `:======:\n${textContent}`;
    const divResult = `<div class="nodown-div" style="display: flex; justify-content: space-between;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Flex space-around aligned", () => {
    const divTest = `:===:===:\n${textContent}`;
    const divResult = `<div class="nodown-div" style="display: flex; justify-content: space-around;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
  it("Flex space-evenly aligned", () => {
    const divTest = `::===:===::\n${textContent}`;
    const divResult = `<div class="nodown-div" style="display: flex; justify-content: space-evenly;"><div class="nodown-sub-div" style="${allStyle}"><p class="nodown-paragraph">${textContent}</p></div></div>`;
    const div = generateTest(divTest, 1);
    expect(div).toBe(divResult);
  });
});
