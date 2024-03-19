import { childrenMap } from "../render";

export default function createCitation(obj) {
  const content = childrenMap(obj.children);
  const blockquote = `<blockquote class="nodown-citation">${content}</blockquote>`;
  return blockquote;
}
