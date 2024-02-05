import { childrenMap } from "../render";

export default function createCitation(obj) {
  const blockquote = document.createElement("blockquote");
  blockquote.innerHTML = childrenMap(obj.children);
  return blockquote;
}
