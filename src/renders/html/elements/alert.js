import { childrenMap, recursiveRender } from "../render";

export default function createAlert(obj) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add(obj.variant);
  if (obj.title) {
    const title = document.createElement("h4");
    title.innerHTML = obj.title.map((child) => recursiveRender(child)).join("");
    alert.appendChild(title);
  }
  alert.innerHTML = alert.innerHTML + childrenMap(obj.children);
  return alert;
}
