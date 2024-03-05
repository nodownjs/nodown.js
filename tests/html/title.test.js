import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../dist/main";
import parserOptions from "./parserOptions.json";

const root = [`<div id="nodown-render">`, `</div>`];

describe("Title", () => {
  it("Basic h1", () => {
    const titleText = `Cool title`;
    const titleTest = `# ${titleText}`;
    const titleResult = `${root[0]}<h1>${titleText}</h1>${root[1]}`;
    const title = renderToHTML(parser(titleTest, parserOptions));
    expect(title).toBe(titleResult);
  });

  it("Basic h2", () => {
    const titleText = `Cool title`;
    const titleTest = `## ${titleText}`;
    const titleResult = `${root[0]}<h2 id="title-1">${titleText}</h2>${root[1]}`;
    const title = renderToHTML(parser(titleTest, parserOptions));
    expect(title).toBe(titleResult);
  });

  it("Basic h3", () => {
    const titleText = `Cool title`;
    const titleTest = `### ${titleText}`;
    const titleResult = `${root[0]}<h3 id="title-1">${titleText}</h3>${root[1]}`;
    const title = renderToHTML(parser(titleTest, parserOptions));
    expect(title).toBe(titleResult);
  });

  it("Title with id", () => {
    const titleText = `Cool title`;
    const titleTest = `# ${titleText} {#cool-title}`;
    const titleResult = `${root[0]}<h1 id="cool-title">${titleText}</h1>${root[1]}`;
    const title = renderToHTML(parser(titleTest, parserOptions));
    expect(title).toBe(titleResult);
  });
});
