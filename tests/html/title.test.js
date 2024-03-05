import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../dist/main";
import parserOptions from "./parserOptions.json";

describe("Title", () => {
  it("Basic h1", () => {
    const titleText = `Cool title`;
    const titleTest = `# ${titleText}`;
    const titleResult = `<h1>${titleText}</h1>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });

  it("Basic h2", () => {
    const titleText = `Cool title`;
    const titleTest = `## ${titleText}`;
    const titleResult = `<h2 id="title-1">${titleText}</h2>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });

  it("Basic h3", () => {
    const titleText = `Cool title`;
    const titleTest = `### ${titleText}`;
    const titleResult = `<h3 id="title-1">${titleText}</h3>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });

  it("Title with id", () => {
    const titleText = `Cool title`;
    const titleTest = `# ${titleText} {#cool-title}`;
    const titleResult = `<h1 id="cool-title">${titleText}</h1>`;
    const title = renderToHTML(parser(titleTest, parserOptions)[0]);
    expect(title).toBe(titleResult);
  });
});
