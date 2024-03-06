import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";

const customId = "custom-id";

describe("Root", () => {
  it("Basic root", () => {
    const rootTest = ``;
    const rootResult = `<div id="nodown-render"><section><div><div></div></div></section></div>`;
    const root = renderToHTML(parser(rootTest));
    expect(root).toBe(rootResult);
  });

  it("Custom id", () => {
    const rootTest = ``;
    const rootResult = `<div id="${customId}"><section><div><div></div></div></section></div>`;
    const root = renderToHTML(parser(rootTest), {
      root: {
        customId: customId,
      },
    });
    expect(root).toBe(rootResult);
  });

  it("No root", () => {
    const rootTest = ``;
    const rootResult = `<section><div><div></div></div></section>`;
    const root = renderToHTML(
      parser(rootTest, {
        root: {
          disabled: true,
        },
      })[0]
    );
    expect(root).toBe(rootResult);
  });
});
