import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";

const customId = "custom-id";

describe("Root", () => {
  it("Basic root", () => {
    const rootTest = ``;
    const rootResult = `<div class="nodown-root" id="nodown-render"><section class="nodown-section"><div class="nodown-div"><div class="nodown-sub-div" style="overflow-y: hidden; flex: 1 0 0%;"></div></div></section></div>`;
    const root = renderToHTML(parser(rootTest));
    expect(root).toBe(rootResult);
  });

  it("Custom id", () => {
    const rootTest = ``;
    const rootResult = `<div class="nodown-root" id="${customId}"><section class="nodown-section"><div class="nodown-div"><div class="nodown-sub-div" style="overflow-y: hidden; flex: 1 0 0%;"></div></div></section></div>`;
    const root = renderToHTML(parser(rootTest), {
      root: {
        customId: customId,
      },
    });
    expect(root).toBe(rootResult);
  });

  it("No root", () => {
    const rootTest = ``;
    const rootResult = `<section class="nodown-section"><div class="nodown-div"><div class="nodown-sub-div" style="overflow-y: hidden; flex: 1 0 0%;"></div></div></section>`;
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
