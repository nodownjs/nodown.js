function update() {
  const data = document.getElementById("nodown-input").value;
  const resultText = noDown(data);
  const render = document.getElementById("nodown-render");
  render.innerHTML = resultText;
}

function noDown(text) {
  const lines = text.split("\n");
  const syntaxTree = {
    type: "root",
    children: [],
  };

  const boldRegExp = /(?<!\*|\\)\*{2}((?:[^*]|\\\*)+)(?<!\\)\*{2}(?!\*)/g;
  const italicRegExp = /(?<!\*|\\)\*{1}((?:[^*]|\\\*)+)(?<!\\)\*{1}(?!\*)/g;
  const boldAndItalicRegExp =
    /(?<!\*|\\)\*{3}((?:[^*]|\\\*)+)(?<!\\)\*{3}(?!\*)/g;
  const strikethroughRegExp = /(?<!~|\\)~{2}((?:[^~]|\\~)+)(?<!\\)~{2}(?!~)/g;
  const underlineRegExp = /(?<!_|\\)_{2}((?:[^_]|\\_)+)(?<!\\)_{2}(?!_)/g;
  const codeRegExp = /(?<!`|\\)`{1}((?:[^`]|\\`)+)(?<!\\)`{1}(?!`)/g;

  const imageRegExp = /(?<!\\)!\[([^\]\\]+)\]\(([^)\\]+)\)/g;

  const regExps = [
    { name: "italic", regexp: italicRegExp },
    { name: "bold", regexp: boldRegExp },
    { name: "strikethrough", regexp: strikethroughRegExp },
    { name: "boldAndItalic", regexp: boldAndItalicRegExp },
    { name: "underline", regexp: underlineRegExp },
    { name: "code", regexp: codeRegExp },
  ];

  const globalRegExp = new RegExp(
    "(" + regExps.map((e) => e.regexp.source).join(")|(") + ")"
  );

  function convertToObject(text) {
    function removeBackslash(text) {
      const regexp = /\\(\*|_|~)+/g;
      return text.replace(regexp, "$1");
    }

    const matches = text.match(globalRegExp);
    if (!matches) {
      return [
        {
          type: "text",
          children: removeBackslash(text),
        },
      ];
    }
    const index = matches.index;

    const matchesArray = matches.slice(1, regExps.length * 2 + 1);
    const typeIndex = matchesArray.findIndex((m) => m !== undefined);
    const type = regExps[typeIndex / 2].name;

    const textBefore = text.substring(0, index);
    const m = matchesArray[typeIndex + 1];
    const textAfter = text.substring(index + matchesArray[typeIndex].length);

    return [
      {
        type: "text",
        children: removeBackslash(textBefore),
      },
      {
        type: type,
        children: type === "code" ? m : convertToObject(m),
      },
      ...convertToObject(textAfter),
    ];
  }

  const titleRegex = /^(#{1,6})\s(.+)/;
  const createTitle = (line) => {
    const match = line.match(titleRegex);
    const level = match[1].length;
    const content = match[2].trim();
    const title = {
      type: "title",
      level: level,
      children: convertToObject(content),
    };
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

  const listRegex = /^(\s*)(-|\d+\.) (.+)/;
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
  } else if (obj.type === "text" && obj.children) {
    container.textContent = obj.children;
  }

  return container.innerHTML;
}
