import { recursiveRender } from "../render.js";

export default function createBlockCode(obj) {
  const classes = `class="${obj.language}"`;
  const content = obj.children
    .map((child) => recursiveRender(child))
    .join("\n");
  const code = `<code>${content}</code>`;
  const pre = `<pre ${classes}>${code}</pre>`;
  return pre;
}
