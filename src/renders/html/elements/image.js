export default function createImage(obj) {
  const img = document.createElement("img");
  img.src = obj.source;
  const { title, width, height, render, alt } = obj;
  if (title) {
    img.title = title;
    img.alt = "title : " + title;
  }
  if (alt) img.alt = alt;
  if (width) {
    if (width.endsWith("%")) {
      img.style.width = width;
      img.style.minWidth = width;
    } else {
      img.style.width = width + "px";
      img.style.minWidth = width + "px";
    }
  }
  if (height) {
    if (height.endsWith("%")) {
      img.style.height = height;
      img.style.minHeight = height;
    } else {
      img.style.height = height + "px";
      img.style.minHeight = height;
    }
  }
  if (render) {
    img.style.imageRendering = render;
    if (render === "smooth") img.style.imageRendering = "auto";
  }
  return img;
}
