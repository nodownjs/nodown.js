import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "./parserOptions.json";

describe("Image", () => {
  const imgSrc = `https://example.com/image.png`;
  const imgTitle = `Exemple title`;
  const imgAlt = `Exemple alt`;

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
});
