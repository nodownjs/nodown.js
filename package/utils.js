import { escapedCharConfig, escapedIdentifier } from "./config.js";

export function transformEscapedChar(match, g1) {
  return (
    escapedIdentifier[0] +
    escapedCharConfig.find((c) => c.char === g1).code +
    escapedIdentifier[1]
  );
}

export function removeBackslash(text, variable) {
  if (
    text
      .toLowerCase()
      .includes(window.varList.map((m) => "<" + m.name.toLowerCase() + ">")) &&
    !variable
  ) {
    window.varList.forEach((m) => {
      const varRegExp = new RegExp("<" + m.name + ">", "gi");
      text = text.replace(varRegExp, m.content);
    });
  }
  const backSlashFixerRegExp = new RegExp(
    escapedIdentifier[0] +
      "(" +
      escapedCharConfig.map((c) => c.code).join("|") +
      ")" +
      escapedIdentifier[1],
    "g"
  );
  // return text;
  function fixEscapedChar(match, p1) {
    return escapedCharConfig.find((c) => c.code === p1).char;
  }
  return text.replace(backSlashFixerRegExp, fixEscapedChar);
}

export function removeBackslashInCode(text) {
  // return text;
  const backSlashFixerRegExp = new RegExp(
    escapedIdentifier[0] +
      "(" +
      escapedCharConfig.map((c) => c.code).join("|") +
      ")" +
      escapedIdentifier[1],
    "g"
  );
  function fixEscapedChar(match, p1) {
    return "\\" + escapedCharConfig.find((c) => c.code === p1).char;
  }
  return text.replace(backSlashFixerRegExp, fixEscapedChar);
}