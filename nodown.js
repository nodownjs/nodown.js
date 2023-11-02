function update() {
  const data = document.getElementById("nodown-input").value;
  const resultText = noDown(data);
  const render = document.getElementById("nodown-render");
  render.innerHTML = resultText;
}

function noDown(text) {
  const ndRegExpA = /\\(\*|_|~|`|\\|\||\[|\d|#)/g;
  const lines = text.replace(ndRegExpA, "{_█\\$1█_}").split("\n");
  // .filter((line) => line !== "");
  const syntaxTree = {
    type: "root",
    children: [
      {
        type: "section",
        children: [
          {
            type: "div",
            children: [
              {
                type: "div",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

  let lastSection;
  let lastDiv;

  function getLastDiv() {
    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    const lastDiv = lastSection.children[lastSection.children.length - 1];
    const lastLastDiv = lastDiv.children[lastDiv.children.length - 1];
    return lastLastDiv;
  }

  const regexConfig = [
    {
      name: "image",
      regexp:
        /(?<!\\)!\[((?:[^\];]*)(?:;(?:[\d%]*))?(?:;(?:[\d%]*))?(?:;(?:\w+))?)?\]\(([-a-zA-Z0-9@\/:%._\+~#=?&]+)(?:(?:;|\s")([^\(\)"]*)(?:")?)?\)/g,
    },
    {
      name: "link",
      regexp:
        /(?<![\\!])\[([^\[]*(?<!\\)!\[(?:[^\];]*)(?:;(?:[\d%]*))?(?:;(?:[\d%]*))?(?:;(?:\w+))?\]\((?:[-a-zA-Z0-9@\/:%._\+~#=?&]+)(?:(?:;|\s")(?:[^\(\)"]*)(?:")?)?\)[^\[]*|[^\[]+)\]\(([-a-zA-Z0-9@\/:%._\+~#=?&]+)(?:(?:;|\s")([^\(\)"]*)(?:")?)?\)/g,
    },
    {
      name: "italic",
      regexp: /(?<!\*|\\)\*{1}((?:(?!\*).)+)(?<!\\)\*{1}(?!\*)/g,
    },
    {
      name: "bold",
      regexp: /(?<!\*|\\)\*{2}((?:(?!\*\*).)+)(?<!\\)\*{2}(?!\*)/g,
    },
    {
      name: "strikethrough",
      regexp: /(?<!~|\\)~{2}((?:[^~]|\\~)+)(?<!\\)~{2}(?!~)/g,
    },
    {
      name: "boldAndItalic",
      regexp: /(?<!\*|\\)\*{3}((?:(?!\*\*\*).)+)(?<!\\)\*{3}(?!\*)/g,
    },
    {
      name: "underline",
      regexp: /(?<!=|\\)={2}((?:[^=]|\\=)+)(?<!\\)={2}(?!=)/g,
    },
    {
      name: "color",
      regexp:
        /(?:\s|^)`#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})`(?:\s|$)/g,
    },
    {
      name: "french-quotation-mark",
      regexp: /(?:\s|^)"([\p{L}\p{M}\s\p{P}]+)"(?:\s|$|,|\.)/gu,
    },
    {
      name: "subscript",
      regexp: /<_([^<>]+)>/g,
    },
    {
      name: "superscript",
      regexp: /<\^([^<>]+)>/g,
    },
    { name: "code", regexp: /(?<!`|\\)`{1}((?:[^`]|\\`)+)(?<!\\)`{1}(?!`)/g },
  ];

  function removeBackslash(text) {
    // const regexp = /\\(\*|_|~|\\)/g;
    // return text.replace(regexp, "$1");
    // return text;
    const ndRegExpB = /{_█\\(\*|_|~|`|\\|\||\[|\d|#)█_}/g;
    return text.replace(ndRegExpB, "$1");
  }
  function removeCodeBackslash(text) {
    const ndRegExpC = /{_█(\\\\)█_}/g;
    return text.replace(ndRegExpC, "$1");
  }

  function convertToObject(text) {
    let allMatches = regexConfig.map((config) => ({ ...config }));

    allMatches = allMatches
      .map((config) => {
        const match = [...text.matchAll(config.regexp)][0];
        // if (match && match[1].trim() !== "") {
        if (match) {
          config.index = match.index;
          config.raw = match[0];
          config.group = [...match].filter((match, index) => index > 0);
        }
        return config;
      })
      .filter((a) => a.index >= 0)
      .sort((a, b) => a.index - b.index);

    if (allMatches.length === 0) {
      return [
        {
          type: "text",
          children: removeBackslash(text),
        },
      ];
    }

    const match = allMatches[0];

    const textBefore = removeBackslash(text.substring(0, match.index));

    const textAfter = removeBackslash(
      text.substring(match.index + match.raw.length)
    );

    const obj = {};

    const result = [
      {
        type: "text",
        children: textBefore,
      },
      obj,
      ...convertToObject(textAfter),
    ];

    if (match.name === "image") {
      const [alt, width, height, render] = match.group[0]
        ? match.group[0].split(";")
        : "";
      const source = match.group[1];
      const title = match.group[2];
      if (width) obj.width = width;
      if (height) obj.height = height;
      if (render) obj.render = render;
      obj.type = "image";
      obj.title = title;
      obj.alt = alt;
      obj.source = source;
    } else if (match.name === "link") {
      obj.type = "link";
      obj.href = match.group[1];
      obj.title = match.group[2];
      obj.children = convertToObject(match.group[0].trim());
    } else if (match.name === "color") {
      obj.type = "color";
      obj.color = match.group[0];
      obj.children = convertToObject("#" + match.group[0].trim());
    } else {
      obj.type = match.name;
      obj.children =
        match.name === "code"
          ? removeBackslash(removeCodeBackslash(match.group[0]))
          : convertToObject(match.group[0]);
    }

    return result;
  }

  const createParagraph = (line) => {
    const paragraph = {
      type: "paragraph",
      children: convertToObject(line),
    };
    // const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    // const lastDiv = lastSection.children[lastSection.children.length - 1];
    const lastDiv = getLastDiv();
    lastDiv.children.push(paragraph);
  };

  const titleRegex = /^(#{1,6})\s(.+)/;
  function createTitle(line) {
    const match = line.match(titleRegex);
    const level = match[1].length;
    let content = match[2].trim();
    let id = null;
    const idRegExp = /(.*)(?:{#(.+)})$/g;
    const idMatch = idRegExp.exec(content) || null;
    if (idMatch) {
      content = idMatch[1];
      id = idMatch[2];
    }
    const title = {
      type: "title",
      level: level,
      children: convertToObject(content),
    };
    if (id) title.id = id;
    if (level == 2) addNewSection(":======");
    const lastDiv = getLastDiv();
    lastDiv.children.push(title);
  }

  const BlockCodeRegex = /^\s*`{3}(\w*)/;
  let isBlockCode = false;
  let blockCodeLanguage = "";
  let blockCodeContent = [];
  function createBlockCode(line) {
    const match = line.match(BlockCodeRegex);
    if (match[1]) blockCodeLanguage = match[1];
    // Si fin du block code
    if (isBlockCode) {
      isBlockCode = false;
      const blockCode = {
        type: "block-code",
        language: blockCodeLanguage,
        children: blockCodeContent,
      };
      const lastDiv = getLastDiv();
      lastDiv.children.push(blockCode);
      blockCodeContent = [];
      blockCodeLanguage = "";
    } else {
      // Si début du block code
      isBlockCode = true;
    }
  }
  function addBlockCodeContent(line) {
    blockCodeContent.push(line);
  }

  const tableRegExp = /^\s*\|(?:(?:[^\|]*|\\|)\|)*/;
  const globalTableRegExp = /((?:[^\|]|\\\|)*)(?<!\\)\|/g;
  const tableHeaderRegExp = /^\s*\|(?:\s*(?::)?-+(?::)?\s*\|)+\s*$/;
  let tableStatus = 0;
  let tableHeader = [];
  let tableAlign = [];
  let tableRows = [];
  function createTable(line, afterLine) {
    const matchs = [...line.matchAll(globalTableRegExp)].filter(
      (_, i) => i !== 0
    );
    if (tableStatus === 0) {
      tableHeader = matchs.map((arr) => {
        return {
          type: "table-header",
          children: convertToObject(arr[1].trim()),
        };
      });
      tableStatus = 1;
    } else if (tableStatus === 1) {
      tableAlign = matchs.map((arr) => arr[1].trim());
      const leftRegExp = /^-+:$/;
      const rightRegExp = /^:-+$/;
      const centerRegExp = /^:-+:$/;
      tableAlign = tableAlign.map((text) => {
        if (leftRegExp.test(text)) {
          return "left";
        } else if (rightRegExp.test(text)) {
          return "right";
        } else if (centerRegExp.test(text)) {
          return "center";
        } else {
          return "default";
        }
      });
      tableStatus++;
    } else {
      console.log(line);
      console.log(matchs);
      tableRows.push({
        type: "table-row",
        children: matchs.map((arr, i) => {
          return {
            type: "table-data",
            align: tableAlign[i],
            children: convertToObject(arr[1].trim()),
          };
        }),
      });
      if (!tableRegExp.test(afterLine)) {
        const table = {
          type: "table",
          align: tableAlign,
          headers: tableHeader,
          rows: tableRows,
        };
        const lastDiv = getLastDiv();
        lastDiv.children.push(table);
        tableStatus = 0;
        tableHeader = [];
        tableRows = [];
        tableAlign = [];
      }
    }
  }

  const citationRegExp =
    /^>([+\-i?!]|\s\[!(?:IMPORTANT|WARNING|NOTE)\])?\s+(.+)$/;
  moreAlertType = /\[!(?:IMPORTANT|WARNING|NOTE)\]/;
  let citation = {
    type: "idk",
    children: [],
  };
  function createCitation(line, afterLine) {
    const match = line.match(citationRegExp);
    let [_, type, content] = match;

    if (!type && moreAlertType.test(content)) {
      type = content;
      content = "";
    } else if (!type) {
      type = "citation";
    }

    const children = { type: "paragraph", children: convertToObject(content) };

    if (type) type = type.trim();

    if (citation.type === "idk") {
      citation = {
        type: "idk",
        children: [],
      };

      switch (type) {
        case "[!WARNING]":
        case "[!IMPORTANT]":
        case "!":
          citation.type = "alert";
          citation.variant = "warning";
          break;
        case "[!NOTE]":
        case "i":
          citation.type = "alert";
          citation.variant = "info";
          break;
        case "?":
          citation.type = "alert";
          citation.variant = "question";
          break;
        case "i":
          citation.type = "alert";
          citation.variant = "info";
          break;
        case "+":
          citation.type = "alert";
          citation.variant = "success";
          break;
        case "-":
          citation.type = "alert";
          citation.variant = "error";
          break;
        case "citation":
          citation.type = "citation";
          break;
      }

      if (citation.type !== "citation") {
        citation.title = convertToObject(content);
      } else {
        citation.children.push(children);
      }
    } else {
      citation.children.push(children);
    }

    if (!citationRegExp.test(afterLine)) {
      const lastDiv = getLastDiv();
      lastDiv.children.push(citation);
      citation = {
        type: "idk",
        children: [],
      };
    }
  }

  const listRegex = /^(\s*)(-|\*|(?:\d+\.?)+) (.+)/;
  let listRoot = {
    type: "idk",
    children: [],
    level: 0,
  };
  let stack = [];
  function createList(line, afterLine) {
    const match = line.match(listRegex);
    const listType =
      match[2] === "-" || match[2] === "*" ? "unordered" : "ordered";
    const checkRegExp = /^(?:\s*)(?:-|\*|(?:\d+\.?)+) (\[ \]|\[x\])(.+)/;
    const isTask = checkRegExp.exec(line);
    const listItemType = isTask ? "task-list-element" : "list-element";
    const content = match[3];

    // Mis a jour du niveau
    let level = match[1].length;
    if (level % 2 == 1) level--; // Changement de niveau tout les deux espaces uniquement
    level = level / 2;

    // Initialisation & mise a jour de la première liste
    if (stack.length === 0) {
      listRoot.type = listType + "-list";
      stack.push(listRoot);
    }

    // Mis a jour de la pile
    while (stack.length > level + 1) {
      stack.pop();
    }

    // Si nouvelle liste
    if (stack.length < level + 1 && stack.length > 0) {
      const list = {
        type: listType + "-list",
        children: [],
      };
      const parentList = stack[stack.length - 1];
      const parentElement = parentList.children[parentList.children.length - 1];
      if (parentElement) {
        parentElement.children.push(list);
        stack.push(list);
      }
    }

    // Création de l'élément
    let listItem = {
      type: listItemType,
      children: convertToObject(content),
    };

    if (isTask) {
      listItem.checked = isTask[1] === "[x]" ? true : false;
      listItem.children = convertToObject(isTask[2]);
    }

    // Ajout de l'élément
    const parent = stack[stack.length - 1];
    parent.children.push(listItem);

    // Si dernier élément
    if (!listRegex.test(afterLine)) {
      const lastDiv = getLastDiv();
      lastDiv.children.push({
        ...listRoot,
      });
      stack = [];
      listRoot = {
        type: "idk",
        children: [],
        level: 0,
      };
    }
  }

  const SectionRegExp = /^##$/g;
  function addNewSection() {
    const section = {
      type: "section",
      children: [
        {
          type: "div",
          children: [
            {
              type: "div",
              children: [],
            },
          ],
        },
      ],
    };
    syntaxTree.children.push(section);
  }

  const divRegExp =
    /^(------|------|------:|---:---|======|===:===|:======|======:|:======:|:===:===:|::===:===::)\s?$/;
  function addNewDiv(line) {
    const div = {
      type: "div",
      children: [
        {
          type: "div",
          children: [],
        },
      ],
    };
    switch (line) {
      case "------":
        div.display = "block";
        div.align = "left";
        break;
      case ":------":
        div.display = "block";
        div.align = "left";
        break;
      case "------:":
        div.display = "block";
        div.align = "right";
        break;
      case "---:---":
        div.display = "block";
        div.align = "center";
        break;
      case "======":
        div.display = "inline";
        div.align = "left";
        break;
      case ":======":
        div.display = "inline";
        div.align = "left";
        break;
      case "======:":
        div.display = "inline";
        div.align = "right";
        break;
        break;
      case "===:===":
        div.display = "inline";
        div.align = "center";
        break;
      case ":======:":
        div.display = "inline";
        div.align = "space-between";
        break;
      case ":===:===:":
        div.display = "inline";
        div.align = "space-around";
        break;
      case "::===:===::":
        div.display = "inline";
        div.align = "space-evenly";
        break;
    }

    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    let lastDiv = lastSection.children[lastSection.children.length - 1];
    if (lastDiv && lastDiv.children.length === 0) {
      lastSection.children[lastDiv.children.length - 1] = div;
    } else {
      lastSection.children.push(div);
    }
  }

  const subDivRegExp = /^===(\|)?(\d)?$/;
  function addNewSubDiv(line) {
    const [_, noGrow, grow] = subDivRegExp.exec(line);
    const div = {
      type: "div",
      children: [],
    };
    if (noGrow) div.size = "0";
    if (grow) div.size = grow;
    const lastSection = syntaxTree.children[syntaxTree.children.length - 1];
    let lastDiv = lastSection.children[lastSection.children.length - 1];
    let lastLastDiv = lastDiv.children[lastDiv.children.length - 1];
    if (lastLastDiv && lastLastDiv.children.length === 0) {
      lastDiv.children[lastDiv.children.length - 1] = div;
    } else {
      lastDiv.children.push(div);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const afterLine = lines[i + 1];

    const tableTest =
      afterLine &&
      [...line.matchAll(globalTableRegExp)].length ===
        [...afterLine.matchAll(globalTableRegExp)].length &&
      tableHeaderRegExp.test(afterLine);

    if (BlockCodeRegex.test(line)) {
      createBlockCode(line);
    } else if (isBlockCode) {
      addBlockCodeContent(line);
    } else if (citationRegExp.test(line)) {
      createCitation(line, afterLine);
    } else if (titleRegex.test(line)) {
      createTitle(line);
    } else if (listRegex.test(line)) {
      createList(line, afterLine);
    } else if (SectionRegExp.test(line)) {
      addNewSection(line);
    } else if (subDivRegExp.test(line)) {
      addNewSubDiv(line);
    } else if (divRegExp.test(line)) {
      addNewDiv(line);
    } else if (
      tableRegExp.test(line) &&
      (tableStatus === 0 ? tableTest : true)
    ) {
      createTable(line, afterLine);
    } else if (line !== "") {
      createParagraph(line);
    }
  }

  syntaxTree.children = syntaxTree.children.filter((el) => el.children !== "");
  console.table(syntaxTree.children);
  console.log(syntaxTree);
  return objectToHTML(syntaxTree);
}

function objectToHTML(obj) {
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
    div.style.flex = 1;
    if (obj.size !== undefined) {
      div.style.flex = obj.size;
    }
    div.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    const { display, align } = obj;
    if (display === "inline") div.style.display = "flex";
    if (align) div.style.justifyContent = align;
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
    alert.style.border = "1px solid " + color;
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
    console.log("🚀 ~ obj.checked:", obj.checked);
    check.style.margin = "0 .2em .25em -1.4em";
    check.style.verticalAlign = "middle";
    console.log(obj);
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
