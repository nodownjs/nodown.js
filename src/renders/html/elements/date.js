import { childrenMap } from "../render";

export default function createDate(obj) {
  const title = new Date(obj.timestamp).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const content = childrenMap(obj.children);
  const timeClass = `class="date"`;
  const time = `<span title=${title} ${timeClass}>${content}</span>`;
  return time;
}
