import { describe, expect, it } from "vitest";
import { parser, renderToHTML } from "../../src/index";
import parserOptions from "../parserOptions.json";

function generateTest(elementTest) {
  return renderToHTML(parser(elementTest, parserOptions)[0]);
}

const alertText = "This is an alert";
const alertTitle = "Alert title";

describe("Alert", () => {
  it("Without content", () => {
    const alertTest = `>? ${alertTitle}`;
    const alertResult = `<div class="alert question"><h4>${alertTitle}</h4></div>`;
    const alert = generateTest(alertTest);
    expect(alert).toBe(alertResult);
  });

  it("Warning alert", () => {
    const alertTest = `>! ${alertTitle}\n>! ${alertText}`;
    const alertResult = `<div class="alert warning"><h4>${alertTitle}</h4><p>${alertText}</p></div>`;
    const alert = generateTest(alertTest);
    expect(alert).toBe(alertResult);
  });

  it("Info alert", () => {
    const alertTest = `>i ${alertTitle}\n>i ${alertText}`;
    const alertResult = `<div class="alert info"><h4>${alertTitle}</h4><p>${alertText}</p></div>`;
    const alert = generateTest(alertTest);
    expect(alert).toBe(alertResult);
  });

  it("Success alert", () => {
    const alertTest = `>+ ${alertTitle}\n>+ ${alertText}`;
    const alertResult = `<div class="alert success"><h4>${alertTitle}</h4><p>${alertText}</p></div>`;
    const alert = generateTest(alertTest);
    expect(alert).toBe(alertResult);
  });

  it("Error alert", () => {
    const alertTest = `>- ${alertTitle}\n>- ${alertText}`;
    const alertResult = `<div class="alert error"><h4>${alertTitle}</h4><p>${alertText}</p></div>`;
    const alert = generateTest(alertTest);
    expect(alert).toBe(alertResult);
  });

  it("Question alert", () => {
    const alertTest = `>? ${alertTitle}\n>? ${alertText}`;
    const alertResult = `<div class="alert question"><h4>${alertTitle}</h4><p>${alertText}</p></div>`;
    const alert = generateTest(alertTest);
    expect(alert).toBe(alertResult);
  });
});
