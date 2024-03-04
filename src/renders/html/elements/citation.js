import { childrenMap } from "../render";

export default function createCitation(obj) {
  const content = childrenMap(obj.children);
  const blockquote = `<blockquote>${content}</blockquote>`;
  return blockquote;
}
