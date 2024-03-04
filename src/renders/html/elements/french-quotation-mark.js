import { childrenMap } from "../render";

export default function createFrenchQuotationMark(obj) {
  const open = `« `;
  const close = ` »`;
  const content = childrenMap(obj.children);
  const text = `${open}${content}${close}`;
  return text;
}
