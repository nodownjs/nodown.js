export default function createImage(obj) {
  const src = obj.source;
  const { title, width, height, render, alt } = obj;
  let altText,
    titleText,
    widthSize,
    heightSize,
    renderText = "";
  if (title) {
    titleText = `title="${title}"`;
    altText = `alt="title : ${title}"`;
  }
  if (alt) altText = `alt="${alt}"`;
  let styles = ``;
  if (width) {
    if (width.endsWith("%")) {
      styles = styles + `width: ${width}; min-width: ${width};`;
    } else {
      styles = styles + `width: ${width}px; min-width: ${width}px;`;
    }
  }
  if (height) {
    if (height.endsWith("%")) {
      styles = styles + `height: ${height}; min-height: ${height};`;
    } else {
      styles = styles + `height: ${height}px; min-height: ${height};`;
    }
  }
  if (render) {
    styles = styles + `image-rendering: ${render};`;
    if (render === "smooth") styles = styles + `image-rendering: auto;`;
  }

  const img = `<img src="${src}" ${titleText} ${altText} style="${styles}" >`;
  return img;
}
