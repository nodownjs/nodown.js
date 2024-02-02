import renderToHTML from "../render.js";

export default function createAlert(obj) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add(obj.variant);
  if (obj.title) {
    const title = document.createElement("h4");
    title.innerHTML = obj.title.map((child) => renderToHTML(child)).join("");
    alert.appendChild(title);
  }
  alert.innerHTML =
    alert.innerHTML + obj.children.map((child) => renderToHTML(child)).join("");
  return alert;
}
