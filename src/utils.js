import { escapedCharConfig, escapedIdentifier } from "./config.js";

export function transformEscapedChar(match, g1) {
  return (
    escapedIdentifier[0] +
    escapedCharConfig.find((c) => c.char === g1).code +
    escapedIdentifier[1]
  );
}

export function removeBackslash(text, variable) {
  const lowerCaseText = text.toLowerCase();

  // if (
  //   varList.some((m) =>
  //     lowerCaseText.includes("<" + m.name.toLowerCase() + ">")
  //   )
  // ) {
  //   for (let i = 0; i < varList.length; i++) {
  //     const var_ = varList[i];
  //     const varRegExp = new RegExp("<" + var_.name + ">", "gi");
  //     text = text.replace(varRegExp, var_.content);
  //   }
  // }

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

export function removeBackslashInCode(text, exception) {
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
    if (exception && p1 === `&#${exception.charCodeAt(0)};`) {
      return escapedCharConfig.find((c) => c.code === p1).char;
    } else {
      return "\\" + escapedCharConfig.find((c) => c.code === p1).char;
    }
  }
  return text.replace(backSlashFixerRegExp, fixEscapedChar);
}
