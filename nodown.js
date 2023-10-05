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
  const boldAndItalicRegExp = /(?<!\*|\\)\*{3}((?:[^*]|\\\*)+)(?<!\\)\*{3}(?!\*)/g;
  const strikethroughRegExp = /(?<!~|\\)~{2}((?:[^~]|\\~)+)(?<!\\)~{2}(?!~)/g;
  const underlineRegExp = /(?<!_|\\)_{2}((?:[^_]|\\_)+)(?<!\\)_{2}(?!_)/g;
  const codeRegExp = /(?<!`|\\)`{1}((?:[^`]|\\`)+)(?<!\\)`{1}(?!`)/g;

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
  console.log(obj);
  if (!obj || typeof obj !== "object") {
    return obj ? obj.toString() : "";
  }

  let html = "";
  console.log(obj.type);

  if (obj.type === "root" && obj.children) {
    html += obj.children.map((child) => objectToHTML(child)).join("");
  } else if (obj.type === "unordered-list" && obj.children) {
    html += "<ul>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</ul>";
  } else if (obj.type === "ordered-list" && obj.children) {
    html += "<ol>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</ol>";
  } else if (obj.type === "block-code" && obj.children) {
    html += '<pre class="' + obj.language + '"><code>';
    html += obj.children.map((child) => objectToHTML(child)).join("\n");
    html += "</code></pre>";
  } else if (obj.type === "list-element" && obj.children) {
    html += "<li>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</li>";
  } else if (obj.type === "title" && obj.children) {
    html += "<h" + obj.level + ">";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</h" + obj.level + ">";
  } else if (obj.type === "code" && obj.children) {
    html += "<code>";
    html += obj.children;
    html += "</code>";
  } else if (obj.type === "boldAndItalic" && obj.children) {
    html += "<strong><em>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</em></strong>";
  } else if (obj.type === "strikethrough" && obj.children) {
    html += "<del>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</del>";
  } else if (obj.type === "italic" && obj.children) {
    html += "<em>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</em>";
  } else if (obj.type === "bold" && obj.children) {
    html += "<strong>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</strong>";
  } else if (obj.type === "underline" && obj.children) {
    html += "<u>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</u>";
  } else if (obj.type === "text" && obj.children) {
    html += obj.children;
  }

  return html;
}
