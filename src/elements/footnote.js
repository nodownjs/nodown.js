import { footnoteRegExp } from "../config.js";
import { footnoteRefList } from "../parser.js";
import { convertToObject } from "./inline.js";

export default function createFootnote(line) {
  const match = line.match(footnoteRegExp);
  const [_, id, content] = match;
  const f = footnoteRefList.find((f) => f.refID === id);
  if (!f) {
    const text = {
      type: "text",
      children: line
    }
    return text;
  }
  let back = ``;
  for (let i = 0; i < f.count; i++) {
    if (f.count === 1) {
      back = ` [↩](#fnref-${id})`;
    } else {
      if (i == 0) {
        back = back + ` [↩<^${i + 1}>](#fnref-${id})`;
      } else {
        back = back + ` [↩<^${i + 1}>](#fnref-${id}-${i})`;
      }
    }
  }
  const footnote = {
    type: "footnote",
    id: id,
    children: convertToObject(content + back),
    index: f.index,
    count: f.count
  };
  return footnote;
}
