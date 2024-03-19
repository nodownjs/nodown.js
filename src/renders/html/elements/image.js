export default function createImage(obj) {
  const src = obj.source;
  const { title, width, height, render, alt } = obj;
  let altText = "";
  let titleText = "";
  if (title) {
    titleText = ` title="${title}"`;
    altText = ` alt="Title : ${title}"`;
  }
  if (alt) altText = ` alt="${alt}"`;
  let styles = [];
  if (width) {
    if (width.endsWith("%")) {
      styles.push(...[`width: ${width};`, `min-width: ${width};`]);
    } else {
      styles.push(...[`width: ${width}px;`, `min-width: ${width}px;`]);
    }
  }
  if (height) {
    if (height.endsWith("%")) {
      styles.push(...[`height: ${height};`, `min-height: ${height};`]);
    } else {
      styles.push(...[`height: ${height}px;`, `min-height: ${height}px;`]);
    }
  }
  if (render) {
    if (render === "smooth") {
      styles.push(`image-rendering: auto;`);
    } else {
      styles.push(`image-rendering: ${render};`);
    }
  }
  if (styles.length < 1) {
    styles = "";
  } else {
    styles = ` style="${styles.join(" ")}"`;
  }
  const img = `<img class="nodown-image" src="${src}"${titleText}${altText}${styles} />`;
  return img;
}
