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

  // const italicRegex = /^\*{1}(.+)\*{1}/;
  // const createItalic = (line) => {
  //   const match = line.match(italicRegex);
  //   const content = match[1];
  //   const italic = {
  //     type: "italic",
  //     children: content,
  //   };
  //   return italic;
  // };

  // const boldRegex = /^\*{2}(.*)\*{2}/;
  // const createBold = (line) => {
  //   const match = line.match(boldRegex);
  //   const content = match[1];
  //   const bold = {
  //     type: "bold",
  //     children: content,
  //   };
  //   return bold;
  // };

  // const createText = (text) => {
  //   const words = text.split(" ");

  //   for (let i = 0; i < words.length; i++) {
  //     const word = words[i];
  //   }

  //   return [
  //     {
  //       type: "text",
  //       children: text,
  //     },
  //   ];
  // };

  const titleRegex = /^(#{1,6})\s(.+)/;
  const createTitle = (line) => {
    const match = line.match(titleRegex);
    const level = match[1].length;
    const content = match[2].trim();
    const title = {
      type: "title",
      level: level,
      children: [content],
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
      children: [{ type: "text", children: content }],
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

  let html = "";

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
  } else if (obj.type === "text" && obj.children) {
    html += obj.children;
  }

  return html;
}
