export const escapedCharConfig = [
  "*",
  "_",
  "~",
  "`",
  "\\",
  "|",
  "[",
  "]",
  "(",
  ")",
  ".",
  "#",
  "-",
  '"',
].map((char) => {
  return { char: char, code: `&#${char.charCodeAt(0)};` };
});

export const backSlashFinderRegExp = new RegExp(
  "\\\\(" + escapedCharConfig.map((c) => "\\" + c.char).join("|") + ")",
  "g"
);

export const escapedIdentifier = ["{_█", "█_}"];

export const varRegExp = /^<([\w\-_]+)>: (.*)/gm;

export const italicRegExp = /\*((?:(?!\*).)+)\*/g;

export const boldRegExp = /\*\*((?:(?!\*).)+)\*\*/g;

export const italicBoldRegExp = /\*{3}((?:(?!\*).)+)\*{3}/g;

export const strikethroughRegExp = /~~((?:(?!\*).)+)~~/g;

export const underlineRegExp = /==((?:(?!\*).)+)==/g;

export const subScriptRegExp = /<_([^<>]+)>/g;
export const superScriptRegExp = /<\^([^<>]+)>/g;

const hexRegExp = /(?:#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4}))/;

const rgbaRegExp =
  /(?:rgba?\((?:\s*(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|100|[0-9]{1,2}\.?\d*%)\s*,?\s*){3}(?:(?:\s*[0-1]?\.?\d+\s*)|(?:\s*(?:100|[0-9]{1,2})?\.?\d+%\s*))?\))/;

const hslaRegExp =
  /(?:hsla?\((?:\s*(?:360|3[0-5]\d|[12]\d{2}|[1-9]\d|\d)\s*,\s(?:100|[1-9]\d?|0)%\s*,\s*(?:100|[1-9]\d?|0)%\s*)(?:(?:,\s*[0-1]?\.?\d+\s*)|(?:,\s*(?:100|[0-9]{1,2})?\.?\d+%\s*))?\))/;

export const colorRegExp = new RegExp(
  "`(" +
    hexRegExp.source +
    "|" +
    rgbaRegExp.source +
    "|" +
    hslaRegExp.source +
    ")`",
  "gi"
);

const escapedCode = escapedIdentifier[0] + "&#96;" + escapedIdentifier[1];

export const codeRegExp = new RegExp(
  "`((?:(?!" + escapedCode + "|`).)+)(`|" + escapedCode + ")",
  "g"
);
export const codeWithVarRegExp = new RegExp(
  "<`((?:(?!" + escapedCode + "|`).)+)(`>|" + escapedCode + ">)",
  "g"
);

export const frenchQuotationMarkRegExp =
  /(?:\s|^)"([\p{L}\p{M}\s\p{P}]+)"(?:\s|$|,|\.)/gu;

export const imageRegExp =
  /!\[((?:[^\];]*)(?:;\d*%?)?(?:;\d*%?)?(?:;\w+)?)?\]\(([^\;\(\)"]+)(?:(?:;|\s")([^\(\)"]*)(?:")?)?\)/gi;

const imageNoCapturingRegExp = imageRegExp.source.replace(
  /(?<!\\)\((?!\?)/g,
  "(?:"
);

const codeNoCapturingRegExp = codeRegExp.source.replace(
  /(?<!\\)\((?!\?)/g,
  "(?:"
);

export const linkRegExp = new RegExp(
  "(?<![\\\\!])\\[((?:[^\\[]|(?:" +
    imageNoCapturingRegExp +
    ")|" +
    codeNoCapturingRegExp +
    ')*)?\\]\\(([^\\;\\(\\)"]+)(?:(?:;|\\s")([^\\(\\)"]*)(?:")?)?\\)',
  "gi"
);
