function update() {
  const data = document.getElementById("nodown-input").value;
  const resultText = noDown(data);
  const render = document.getElementById("nodown-render");
  render.innerHTML = resultText;
}

function noDown(text) {
  const ndRegExpA = /\\(\*|_|~|`|\\)/g;
  const lines = text.replace(ndRegExpA, "{_█\\$1█_}").split("\n");
  const syntaxTree = {
    type: "root",
    children: [],
  };

  const regexConfig = [
    {
      name: "image",
      regexp:
        /(?<!\\)!\[([^\]]*)(?:;([\d%]*))?(?:;([\d%]*))?\]\(([-a-zA-Z0-9@\/:%._\+~#=]+)(?:;([^\(\)]*))?\)/g,
    },
    {
      name: "link",
      regexp: /(?<![\\!])\[(.*)\]\(([-a-zA-Z0-9@\/:%._\+~#=]+)\)/g,
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
    { name: "code", regexp: /(?<!`|\\)`{1}((?:[^`]|\\`)+)(?<!\\)`{1}(?!`)/g },
  ];

  function removeBackslash(text) {
    // const regexp = /\\(\*|_|~|\\)/g;
    // return text.replace(regexp, "$1");
    // return text;
    const ndRegExpB = /{_█\\(\*|_|~|`|\\)█_}/g;
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
        if (match && match[1].trim() !== "") {
          config.index = match.index;
          config.raw = match[0];
          config.group = [...match].filter(
            (match, index) => index > 0 && match
          );
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
      const [alt, width, height, render] = match.group[0].split(";");
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
      obj.children = convertToObject(match.group[0].trim());
    } else {
      obj.type = match.name;
      obj.children =
        match.name === "code"
          ? removeCodeBackslash(match.group[0])
          : convertToObject(match.group[0]);
    }

    return result;
  }

  const createParagraph = (line) => {
    const paragraph = {
      type: "paragraph",
      children: convertToObject(line),
    };
    syntaxTree.children.push(paragraph);
  };

  const titleRegex = /^(#{1,6})\s(.+)/;
  const createTitle = (line) => {
    console.log();
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
    syntaxTree.children.push(title);
  };

  const BlockCodeRegex = /^`{3}(\w*)/;
  let isBlockCode = false;
  let blockCodeLanguage = "";
  let blockCodeContent = [];
  const createBlockCode = (line) => {
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
      syntaxTree.children.push(blockCode);
      blockCodeContent = [];
      blockCodeLanguage = "";
    } else {
      // Si début du block code
      isBlockCode = true;
    }
  };
  const addBlockCodeContent = (line) => {
    blockCodeContent.push(line);
  };

  const listRegex = /^(\s*)(-|(?:\d+\.?)+) (.+)/;
  let listRoot = {
    type: "idk",
    children: [],
    level: 0,
  };
  let stack = [];
  function createList(line, afterLine) {
    const match = line.match(listRegex);
    const listType = match[2] === "-" ? "unordered" : "ordered";
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
    if (stack.length < level + 1) {
      const list = {
        type: listType + "-list",
        children: [],
      };
      const parentList = stack[stack.length - 1];
      const parentElement = parentList.children[parentList.children.length - 1];
      parentElement.children.push(list);
      stack.push(list);
    }

    // Création de l'élément
    let listItem = {
      type: "list-element",
      children: convertToObject(content),
    };

    // Ajout de l'élément
    const parent = stack[stack.length - 1];
    parent.children.push(listItem);

    // Si dernier élément
    if (!listRegex.test(afterLine)) {
      syntaxTree.children.push({ ...listRoot });
      stack = [];
      listRoot = {
        type: "idk",
        children: [],
        level: 0,
      };
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (BlockCodeRegex.test(line)) {
      createBlockCode(line);
    } else if (isBlockCode) {
      addBlockCodeContent(line);
    } else if (titleRegex.test(line)) {
      createTitle(line);
    } else if (listRegex.test(line)) {
      createList(line, lines[i + 1]);
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
  } else if (obj.type === "underline" && obj.children) {
    const u = document.createElement("u");
    u.innerHTML = obj.children.map((child) => objectToHTML(child)).join("");
    container.appendChild(u);
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
      } else {
        img.width = width;
      }
    }
    if (height) {
      if (height.endsWith("%")) {
        img.style.height = height;
      } else {
        img.height = height;
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
    let text = obj.children.map((child) => objectToHTML(child)).join("");
    if (text.trim() === "") text = obj.href;
    a.innerHTML = text;
    container.appendChild(a);
  } else if (obj.type === "text" && obj.children) {
    container.textContent = obj.children;
  }

  return container.innerHTML;
}
