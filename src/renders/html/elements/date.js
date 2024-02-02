import renderToHTML from "../render.js";

export default function createDate(obj) {
  const time = document.createElement("span");
  time.classList.add("date");
  time.title = new Date(obj.timestamp).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  time.innerHTML = obj.children.map((child) => renderToHTML(child)).join("");
  return time;
}