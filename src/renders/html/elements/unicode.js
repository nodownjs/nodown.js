import { childrenMap } from "../render.js";

export default function createUnicode(obj) {
  const content = childrenMap(obj.children);
  const contentSpan = `<span>${content}</span>`;
  const codeClass = `class="unicode"`;
  const charClass = `class="preview"`;
  const char = `<span ${charClass}>${obj.char}</span>`;
  const code = `<code ${codeClass}>${char}${contentSpan}</code>`;
  return code;
}
