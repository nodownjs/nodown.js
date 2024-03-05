import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "./parserOptions.json";

describe("Title", () => {
  const titleText = `Cool title`;

  it("Basic h1", () => {
    const titleTest = `# ${titleText}`;
    const titleResult = `<h1>${titleText}</h1>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });

  it("Basic h2", () => {
    const titleTest = `## ${titleText}`;
    const titleResult = `<h2 id="title-1">${titleText}</h2>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });

  it("Basic h3", () => {
    const titleTest = `### ${titleText}`;
    const titleResult = `<h3 id="title-1">${titleText}</h3>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });

  it("Basic h4", () => {
    const titleTest = `#### ${titleText}`;
    const titleResult = `<h4 id="title-1">${titleText}</h4>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });

  it("Title with id", () => {
    const titleTest = `# ${titleText} {#cool-title}`;
    const titleResult = `<h1 id="cool-title">${titleText}</h1>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });
});
