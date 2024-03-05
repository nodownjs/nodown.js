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

  it("Basic image", () => {
    const imgTest = `![](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });

  it("With alt", () => {
    const imgTest = `![${imgAlt}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" alt="${imgAlt}" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });

  it("With title", () => {
    const imgTest = `![](${imgSrc};${imgTitle})`;
    const imgResult = `<img src="${imgSrc}" title="${imgTitle}" alt="Title : ${imgTitle}" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });

  it("With alt and title", () => {
    const imgTest = `![${imgAlt}](${imgSrc};${imgTitle})`;
    const imgResult = `<img src="${imgSrc}" title="${imgTitle}" alt="${imgAlt}" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });

  it("With 100% of width", () => {
    const imgTest = `![;${img100Width}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="width: ${img100Width}; min-width: ${img100Width};" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });

  it("With 255px of width", () => {
    const imgTest = `![;${img255Width}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="width: ${img255Width}px; min-width: ${img255Width}px;" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });

  it("With 100% of height", () => {
    const imgTest = `![;;${img100Height}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="height: ${img100Height}; min-height: ${img100Height};" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });

  it("With 255px of height", () => {
    const imgTest = `![;;${img255Height}](${imgSrc})`;
    const imgResult = `<img src="${imgSrc}" style="height: ${img255Height}px; min-height: ${img255Height}px;" />`;
    const img = renderToHTML(parser(imgTest, parserOptions)[0].children[1]);
    expect(img).toBe(imgResult);
  });
});
