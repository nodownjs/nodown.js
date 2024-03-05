import { recursiveRender } from "../render";

export default function createDiv(obj) {
  const content = obj.children
    .map((child) => recursiveRender({ ...child, total: obj.children.length }))
    .join("");
  let styles = ``;
  const { display, align } = obj;
  if (display === "inline") {
    styles = styles + "display: flex;";
    if (align) styles = styles + "justifyContent: align;";
  } else {
    if (align) styles = styles + "textAlign: align;";
  }
  const div = `<div style="${styles}">${content}</div>`;
  return div;
}
