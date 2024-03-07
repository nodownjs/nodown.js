import { childrenMap } from "../render.js";

export default function createLink(obj) {
  let content = childrenMap(obj.children);
  if (obj.href.startsWith("#fnref-")) content = " " + content;
  if (content.trim() === "") content = obj.href;
  const href = ` href="${obj.href}"`;
  const title = obj.title ? ` title="${obj.title}"` : "";
  const a = `<a${href}${title}>${content}</a>`;
  return a;
}
