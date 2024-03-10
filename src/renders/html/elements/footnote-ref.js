export default function createFootnoteRef(obj) {
  let element = ``;
  if (!obj.inactive) {
    const aClass = `class="footnote-ref"`;
    const href = `href="#fn-${obj.refId}"`;
    const id = `id="fnref-${obj.id}"`;
    const a = `<a ${id} ${href} ${aClass}>${obj.index}</a>`;
    const sup = `<sup>${a}</sup>`;
    element = sup;
  } else {
    element = obj.raw;
  }
  return element;
}
