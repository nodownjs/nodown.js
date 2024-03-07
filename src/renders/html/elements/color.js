import { childrenMap } from "../render";

export default function createColor(obj) {
  const codeClass = `class="color"`;
  const colorClass = `class="preview"`;
  const size = "1em";
  let styles = [];
  styles.push(`background-color: ${obj.color} !important;`);
  styles.push(`display: inline-block;`);
  styles.push(`margin-right: 0.375em;`);
  styles.push(`transform: translateY(.1em);`);
  styles.push(`height: ${size};`);
  styles.push(`width: ${size};`);
  styles = `style="${styles.join(" ")}"`;
  const color = `<span ${styles} ${colorClass}></span>`;
  const content = childrenMap(obj.children);
  const code = `<code ${codeClass}>${color}${content}</code>`;
  return code;
}
