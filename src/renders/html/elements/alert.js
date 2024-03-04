import { childrenMap, recursiveRender } from "../render";

export default function createAlert(obj) {
  const title = obj.title
    ? `<h4>${obj.title.map((child) => recursiveRender(child)).join("")}</h4>`
    : "";
  const classes = `class="alert ${obj.variant}"`;
  const content = childrenMap(obj.children);
  const alert = `<div ${classes}>${title}${content}</div>`;
  return alert;
}
