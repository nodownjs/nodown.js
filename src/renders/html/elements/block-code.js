import { recursiveRender } from "../render.js";

export default function createBlockCode(obj) {
  let blockCodeClass = ["nodown-block-code"];
  if (obj.language) blockCodeClass.push(obj.language);
  blockCodeClass = `class="${blockCodeClass.join(" ")}"`;
  const content = obj.children
    .map((child) => recursiveRender(child))
    .join("\n");
  const code = `<code>${content}</code>`;
  const pre = `<pre ${blockCodeClass}>${code}</pre>`;
  return pre;
}
