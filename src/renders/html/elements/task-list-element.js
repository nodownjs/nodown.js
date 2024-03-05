import { childrenMap } from "../render.js";

export default function createTaskListElement(obj) {
  const type = `type="checkbox"`;
  let checked = ``;
  if (obj.checked) checked = `checked`;
  const content = childrenMap(obj.children);
  const check = `<input ${type} ${checked} />`;
  const li = `<li>${check}${content}</li>`;
  return li;
}
