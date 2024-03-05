import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "./parserOptions.json";

describe("Image", () => {
  const imgSrc = `https://example.com/image.png`;
  const imgTitle = `Exemple title`;
  const imgAlt = `Exemple alt`;
  const img100Width = `100%`;
  const img255Width = `255`;
  const img100Height = `100%`;
  const img255Height = `255`;

  function generateTest(elementTest) {
    return renderToHTML(parser(elementTest, parserOptions)[0].children[1]);
  }

  it("Basic image", () => {
    const imgTest = `![](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it("With alt", () => {
    const imgTest = `![${imgAlt}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" alt="${imgAlt}" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it("With title", () => {
    const imgTest = `![](${imgSrc};${imgTitle})`;
    const imgResult = `<img src="${imgSrc}" title="${imgTitle}" alt="Title : ${imgTitle}" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it("With alt and title", () => {
    const imgTest = `![${imgAlt}](${imgSrc};${imgTitle})`;
    const imgResult = `<img src="${imgSrc}" title="${imgTitle}" alt="${imgAlt}" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it("With 100% of width", () => {
    const imgTest = `![;${img100Width}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="width: ${img100Width}; min-width: ${img100Width};" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it("With 255px of width", () => {
    const imgTest = `![;${img255Width}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="width: ${img255Width}px; min-width: ${img255Width}px;" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it("With 100% of height", () => {
    const imgTest = `![;;${img100Height}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="height: ${img100Height}; min-height: ${img100Height};" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it("With 255px of height", () => {
    const imgTest = `![;;${img255Height}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="height: ${img255Height}px; min-height: ${img255Height}px;" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it(`With pixelated render`, () => {
    const imgTest = `![;;;pixelated](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="image-rendering: pixelated;" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it(`With smooth render`, () => {
    const imgTest = `![;;;smooth](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="image-rendering: auto;" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });

  it(`With all`, () => {
    const imgTest = `![${imgAlt};${img100Width};${img255Height};pixelated](${imgSrc};${imgTitle})`;
    const imgResult = `<img src="${imgSrc}" title="${imgTitle}" alt="${imgAlt}" style="width: ${img100Width}; min-width: ${img100Width};height: ${img255Height}px; min-height: ${img255Height}px;image-rendering: pixelated;" />`;
    const img = generateTest(imgTest);
    expect(img).toBe(imgResult);
  });
});
