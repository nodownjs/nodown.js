import { childrenMap } from "../render";

export default function createColor(obj) {
  const codeClasses = `class="color"`;
  const colorClasses = `class="preview"`;
  const size = "1em";
  const styles = `style="
  background-color: ${obj.color} !important; 
  display: inline-block; 
  margin-right: 0.375em; 
  transform: translateY(.1em); 
  height: ${size}; 
  width: ${size};
  "`;
  const color = `<span ${styles} ${colorClasses}></span>`;
  const content = childrenMap(obj.children);
  const code = `<code ${codeClasses}>${color}${content}</code>`;
  return code;
}
