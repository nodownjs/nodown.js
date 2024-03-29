import { recursiveRender } from "../render";

export default function createDiv(obj) {
  const content = obj.children
    .map((child) => recursiveRender({ ...child, total: obj.children.length }))
    .join("");
  let styles = [];
  const { display, align } = obj;
  if (display === "inline") {
    styles.push("display: flex;");
    if (align) styles.push(`justify-content: ${align};`);
  } else {
    if (align) styles.push(`text-align: ${align};`);
  }
  if (styles.length < 1) {
    styles = "";
  } else {
    styles = ` style="${styles.join(" ")}"`;
  }
  const div = `<div class="nodown-div"${styles}>${content}</div>`;
  return div;
}
