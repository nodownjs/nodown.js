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
  "<",
].map((char) => {
  return { char: char, code: `&#${char.charCodeAt(0)};` };
});

export const backSlashFinderRegExp = new RegExp(
  "\\\\(" + escapedCharConfig.map((c) => "\\" + c.char).join("|") + ")",
  "g"
);

export const escapedIdentifier = ["{_█", "█_}"];

export const varRegExp = /^<([\w\-_]+)>: (.*)/gm;

export const italicRegExp = /\*(?!\s)((?:\*\*|[^\*])+)(?<!\s)\*/g;

export const boldRegExp = /\*\*(?!\s)((?:(?!\*\*).)+)(?<!\s)\*\*/g;

export const italicBoldRegExp = /\*{3}(?!\s)(.+)(?<!\s)\*{3}/g;

export const strikethroughRegExp = /~~(?!\s)(.+)(?<!\s)~~/g;

export const underlineRegExp = /==(?!\s)(.+)(?<!\s)==/g;

export const subScriptRegExp = /<_([^<>]+)>/g;
export const superScriptRegExp = /<\^([^<>]+)>/g;

export const dateRegExp =
  /<(t|eu|e|us|u|iso|i):([\d\s:\/\-\p{L}\p{M}\p{P}]+):(t|T|d|D|f|F|R|r)>/gu;

export const digitalDateRegExp =
  /(?:(\d{2,4})(?:[-\/])(\d{2,4})(?:[-\/])(\d{2,4}))(?:\s*(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/;

const hexRegExp = /(?:#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4}))/;

const rgbaRegExp =
  /(?:rgba?\((?:\s*(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:100|[0-9]{1,2}(?:\.?\d*)%))\s*,?\s*){3}(?:(?:\s*[0-1]?\.?\d+\s*)|(?:\s*(?:100|[0-9]{1,2})?\.?\d+%\s*))?\))/;

const hslaRegExp =
  /(?:hsla?\((?:\s*(?:360|3[0-5]\d|[12]\d{2}|[1-9]\d|\d)\s*,\s*(?:100|[1-9]\d?|0)%\s*,\s*(?:100|[1-9]\d?|0)%\s*)(?:(?:,\s*[0-1]?\.?\d+\s*)|(?:,\s*(?:100|[0-9]{1,2})?\.?\d+%\s*))?\))/;

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

export const frenchQuotationMarkRegExp = /(?<![^\s])"([^"]+)"(?![^.,\s])/gu;

export const imageRegExp = new RegExp(
  '!\\[((?:[^\\];]*)(?:;\\d*%?)?(?:;\\d*%?)?(?:;\\w+)?)?\\]\\(((?:[^\\;\\(\\)"]|' +
  ";" +
  escapedIdentifier[1] +
  ')+)(?:(?:;|\s")([^\\(\\)"]*)(?:")?)?\\)',
  "gi"
);

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
    ')*)?\\]\\(((?:[^\\;\\(\\)"]|' +
    ";" +
    escapedIdentifier[1] +
    ')+)(?:(?:;|\\s")([^\\(\\)"]*)(?:")?)?\\)',
  "gi"
);

export const standardLinkRegExp = /\b((?:https?:\/\/|www\.)[^\s]+)/g;

// BLOCK

export const titleRegExp = /^(#{1,6})\s(.+)/;

export const blockCodeRegExp = /^\s*`{3}(\w*)/;

export const tableRegExp = /^\s*\|(?:(?:[^\|]*|\\|)\|)*/;
export const globalTableRegExp = /((?:[^\|]|\\\|)*)(?<!\\)\|/g;
export const tableHeaderRegExp = /^\s*\|(?:\s*(?::)?-+(?::)?\s*\|)+\s*$/;

export const citationRegExp =
  /^>([+\-i?!]|\s\[!(?:IMPORTANT|WARNING|NOTE)\])?\s+(.+)$/;

export const citationAlertTypeRegExp = /\[!(?:IMPORTANT|WARNING|NOTE)\]/;

export const listRegExp = /^(\s*)(-|\*|(?:\d+(?:\.|\)))+) (.+)/;

export const sectionRegExp = /^##$/g;

export const divRegExp =
  /^(------|------|------:|---:---|======|===:===|:======|======:|:======:|:===:===:|::===:===::)\s?$/;

export const subDivRegExp = /^(===|:===:|:===|===:)(\|)?(\d+)?$/;

export const dividerRegExp = /^---$/;
