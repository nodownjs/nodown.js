export default function objectToHTML(obj) {
  if (!obj || typeof obj !== "object") {
    return obj ? obj.toString() : "";
  }

  const container = document.createElement("div");

  if (obj.type === "root" && obj.children) {
    const div = document.createElement("div");
    div.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(div);
  } else if (obj.type === "section" && obj.children) {
    const section = document.createElement("section");
    section.innerHTML = obj.children
      .map((child) => objectToHTML(child))
      .join("");
    container.appendChild(section);
  } else if (obj.type === "div" && obj.children) {
    const div = document.createElement("div");
    div.innerHTML = obj.children
      .map((child) => objectToHTML({ ...child, total: obj.children.length }))
      .join("");
    const { display, align } = obj;
    if (display === "inline") {
      div.style.display = "flex";
      if (align) div.style.justifyContent = align;
    } else {
      if (align) div.style.textAlign = align;
    }
    container.appendChild(div);
  } else if (obj.type === "sub-div" && obj.children) {
    const div = document.createElement("div");
    div.style.flex = "1 0 0%";
    if (obj.size !== undefined) {
      div.style.flex = obj.size + " 0 0%";
      if (obj.size == 0) {
        div.style.flex = " 0 1 auto";
        div.style.maxWidth =
          "calc(" +
          (1 / obj.total) * 100 +
          "% - " +
          (obj.total - 1) / obj.total +
          "em)";
      }
    }
    if (obj.align) div.style.textAlign = obj.align;
    div.style.overflowY = "hidden";
    div.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(div);
  } else if (obj.type === "table" && obj.rows) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = obj.headers.map((child) => objectToHTML(child)).join("");
    tbody.innerHTML = obj.rows.map((child) => objectToHTML(child)).join("");
    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table);
  } else if (obj.type === "table-header" && obj.children) {
    const th = document.createElement("th");
    th.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(th);
  } else if (obj.type === "table-row" && obj.children) {
    const tr = document.createElement("tr");
    tr.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(tr);
  } else if (obj.type === "table-data" && obj.children) {
    const td = document.createElement("td");
    td.align = obj.align === "default" ? "left" : obj.align;
    td.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(td);
  } else if (obj.type === "citation" && obj.children) {
    const blockquote = document.createElement("blockquote");
    blockquote.innerHTML = obj.children
      .map((child) => objectToHTML(child))
      .join("");
    container.appendChild(blockquote);
  } else if (obj.type === "alert" && obj.children) {
    const alert = document.createElement("div");
    alert.classList.add("alert");
    alert.classList.add(obj.variant);
    let color;
    switch (obj.variant) {
      case "note":
        color = "blue";
        break;
      case "warning":
        color = "orange";
        break;
      case "success":
        color = "green";
        break;
      case "error":
        color = "red";
        break;
      default:
        color = "gray";
        break;
    }
    const title = document.createElement("h4");
    title.innerHTML = obj.title.map((child) => objectToHTML(child)).join("");
    alert.appendChild(title);
    alert.innerHTML =
      alert.innerHTML +
      obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(alert);
  } else if (obj.type === "unordered-list" && obj.children) {
    const ul = document.createElement("ul");
    ul.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(ul);
  } else if (obj.type === "ordered-list" && obj.children) {
    const ol = document.createElement("ol");
    ol.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(ol);
  } else if (obj.type === "block-code" && obj.children) {
    const pre = document.createElement("pre");
    pre.className = obj.language;
    const code = document.createElement("code");
    code.textContent = obj.children
      .map((child) => objectToHTML(child))
      .join("\n");
    pre.appendChild(code);
    container.appendChild(pre);
  } else if (obj.type === "list-element" && obj.children) {
    const li = document.createElement("li");
    li.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(li);
  } else if (obj.type === "task-list-element" && obj.children) {
    const li = document.createElement("li");
    const check = document.createElement("input");
    check.type = "checkbox";
    if (obj.checked) check.setAttribute("checked", true);
    check.style.margin = "0 .2em .25em -1.4em";
    check.style.verticalAlign = "middle";
    li.appendChild(check);
    li.innerHTML =
      li.innerHTML + obj.children.map((child) => objectToHTML(child)).join("");
    li.style.listStyle = "none";
    container.appendChild(li);
  } else if (obj.type === "title" && obj.children) {
    const heading = document.createElement("h" + obj.level);
    heading.innerHTML = obj.children
      .map((child) => objectToHTML(child))
      .join("");
    if (obj.id) heading.id = obj.id;
    container.appendChild(heading);
  } else if (obj.type === "code" && obj.children) {
    const code = document.createElement("code");
    code.textContent = obj.children;
    container.appendChild(code);
  } else if (obj.type === "boldAndItalic" && obj.children) {
    const strong = document.createElement("strong");
    const em = document.createElement("em");
    em.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    strong.appendChild(em);
    container.appendChild(strong);
  } else if (obj.type === "strikethrough" && obj.children) {
    const del = document.createElement("del");
    del.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(del);
  } else if (obj.type === "italic" && obj.children) {
    const em = document.createElement("em");
    em.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(em);
  } else if (obj.type === "bold" && obj.children) {
    const strong = document.createElement("strong");
    strong.innerHTML = obj.children
      .map((child) => objectToHTML(child))
      .join("");
    container.appendChild(strong);
  } else if (obj.type === "subscript" && obj.children) {
    const sub = document.createElement("sub");
    sub.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(sub);
  } else if (obj.type === "superscript" && obj.children) {
    const sup = document.createElement("sup");
    sup.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(sup);
  } else if (obj.type === "french-quotation-mark" && obj.children) {
    const text = document.createElement("span");
    var open = document.createTextNode(" « ");
    var close = document.createTextNode(" » ");
    text.appendChild(open);
    text.innerHTML =
      text.innerHTML +
      obj.children.map((child) => objectToHTML(child)).join("");
    text.appendChild(close);
    container.appendChild(text);
  } else if (obj.type === "underline" && obj.children) {
    const u = document.createElement("u");
    u.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(u);
  } else if (obj.type === "color" && obj.children) {
    const color = document.createElement("span");
    const code = document.createElement("code");
    code.style.display = "inline-flex";
    code.style.alignItems = "center";
    code.style.gap = "0.33em";
    const size = "0.75em";
    color.setAttribute(
      "style",
      "background-color:#" + obj.color + " !important"
    );
    color.style.height = size;
    color.style.width = size;
    color.style.borderRadius = "50%";
    code.appendChild(color);
    code.innerHTML =
      code.innerHTML +
      obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(code);
  } else if (obj.type === "paragraph" && obj.children) {
    const p = document.createElement("p");
    p.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(p);
  } else if (obj.type === "image" && obj.source) {
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
    container.appendChild(img);
  } else if (obj.type === "link" && obj.children) {
    const a = document.createElement("a");
    a.href = obj.href;
    if (obj.title) {
      a.title = obj.title;
    }
    let text = obj.children.map((child) => objectToHTML(child)).join("");
    if (text.trim() === "") text = obj.href;
    a.innerHTML = text;
    container.appendChild(a);
  } else if (obj.type === "text" && obj.children) {
    container.textContent = obj.children;
  }

  return container.innerHTML;
}