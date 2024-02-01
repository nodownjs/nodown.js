import { footnoteRegExp } from "../config.js";
import { footnoteRefList } from "../parser.js";
import { convertToObject } from "./inline.js";

export default function createFootnote(line) {
  const match = line.match(footnoteRegExp);
  const [_, id, content] = match;
  let back = ``;
  const footnote = {
    type: "footnote",
    id: id,
  };
  const f = footnoteRefList.find((f) => f.refID === id);
  if (!f) {
    footnote.inactive = true;
    footnote.children = convertToObject(content);
    return footnote;
  }
  const arrow = "↩";
  for (let i = 0; i < f.count; i++) {
    if (f.count === 1) {
      back = `[${arrow}](#fnref-${id})`;
    } else {
      if (i == 0) {
        back = back + `[${arrow}<^${i + 1}>](#fnref-${id})`;
      } else {
        back = back + `[${arrow}<^${i + 1}>](#fnref-${id}-${i})`;
      }
    }
  }
  footnote.children = convertToObject(content + back);
  footnote.index = f.index;
  footnote.count = f.count;
  return footnote;
}
