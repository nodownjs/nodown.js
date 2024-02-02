export default function createFootnoteRef(obj) {
  let element;
  if (!obj.inactive) {
    const sup = document.createElement("sup");
    const a = document.createElement("a");
    a.classList.add("footnote-ref");
    a.href = "#fn-" + obj.ref;
    a.innerHTML = obj.index;
    a.id = "fnref-" + obj.id;
    sup.appendChild(a);
    element = sup;
  } else {
    element = document.createTextNode(obj.raw);
  }
  return element;
}
