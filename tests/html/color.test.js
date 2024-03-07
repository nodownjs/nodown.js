import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0].children[1]);
}

const colorHex = `#FFDAB9`;
const colorShortHex = `#FB9`;
const colorRgb = `rgb(204, 230, 255)`;
const colorRgba = `rgba(255, 235, 205, 0.5)`;
const colorHsl = `hsl(160, 100%, 96%)`;
const colorHsla = `hsla(260, 100%, 96%, 0.5)`;

const styles = `style="background-color: {{color}} !important; display: inline-block; margin-right: 0.375em; transform: translateY(.1em); height: 1em; width: 1em;"`;

describe("color", () => {
  it("Basic HEX color", () => {
    const colorTest = `\`${colorHex}\``;
    const colorResult = `<code class="color"><span ${styles.replace(
      /{{color}}/,
      colorHex
    )} class="preview"></span>${colorHex}</code>`;
    const color = generateTest(colorTest);
    expect(color).toBe(colorResult);
  });

  it("Short HEX", () => {
    const colorTest = `\`${colorShortHex}\``;
    const colorResult = `<code class="color"><span ${styles.replace(
      /{{color}}/,
      colorShortHex
    )} class="preview"></span>${colorShortHex}</code>`;
    const color = generateTest(colorTest);
    expect(color).toBe(colorResult);
  });

  it("Basic RGB color", () => {
    const colorTest = `\`${colorRgb}\``;
    const colorResult = `<code class="color"><span ${styles.replace(
      /{{color}}/,
      colorRgb
    )} class="preview"></span>${colorRgb}</code>`;
    const color = generateTest(colorTest);
    expect(color).toBe(colorResult);
  });

  it("Basic RGBa color", () => {
    const colorTest = `\`${colorRgba}\``;
    const colorResult = `<code class="color"><span ${styles.replace(
      /{{color}}/,
      colorRgba
    )} class="preview"></span>${colorRgba}</code>`;
    const color = generateTest(colorTest);
    expect(color).toBe(colorResult);
  });

  it("Basic HSL color", () => {
    const colorTest = `\`${colorHsl}\``;
    const colorResult = `<code class="color"><span ${styles.replace(
      /{{color}}/,
      colorHsl
    )} class="preview"></span>${colorHsl}</code>`;
    const color = generateTest(colorTest);
    expect(color).toBe(colorResult);
  });

  it("Basic HSLa color", () => {
    const colorTest = `\`${colorHsla}\``;
    const colorResult = `<code class="color"><span ${styles.replace(
      /{{color}}/,
      colorHsla
    )} class="preview"></span>${colorHsla}</code>`;
    const color = generateTest(colorTest);
    expect(color).toBe(colorResult);
  });
});
