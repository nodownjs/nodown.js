export default function createFootnoteRef(obj) {
  let element = ``;
  if (!obj.inactive) {
    const href = `href="#fn-${obj.refId}"`;
    const id = `id="fnref-${obj.id}"`;
    const a = `<a class="nodown-link" ${id} ${href}>${obj.index}</a>`;
    const sup = `<sup class="nodown-superscript nodown-footnote-ref">${a}</sup>`;
    element = sup;
  } else {
    element = obj.raw;
  }
  return element;
}
