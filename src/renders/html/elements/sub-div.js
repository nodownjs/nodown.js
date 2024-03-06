import { childrenMap } from "../render.js";

export default function createSubDiv(obj) {
  const content = childrenMap(obj.children);
  let styles = [`overflow-y: hidden;`];
  let flex = `1 0 0%`;
  if (obj.size !== undefined) {
    flex = `${obj.size} 0 0%`;
    if (obj.size == 0) {
      flex = `0 1 auto`;
      styles.push(
        `max-width: calc(${(1 / obj.total) * 100}% - ${
          (obj.total - 1) / obj.total
        }em);`
      );
    }
  }
  if (obj.align) styles.push(`text-align: ${obj.align};`);
  styles.push(`flex: ${flex};`);
  styles = ` style="${styles.join(" ")}"`;
  const subDiv = `<div${styles}>${content}</div>`;
  return subDiv;
}
