import renderToHTML from "../render.js";

export default function createTaskListElement(obj) {
  const li = document.createElement("li");
  const check = document.createElement("input");
  check.type = "checkbox";
  if (obj.checked) check.setAttribute("checked", true);
  // check.style.margin = "0 .2em .25em -1.4em";
  // check.style.verticalAlign = "middle";
  li.appendChild(check);
  li.innerHTML =
    li.innerHTML + obj.children.map((child) => renderToHTML(child)).join("");
  // li.style.listStyle = "none";
  return li;
}
