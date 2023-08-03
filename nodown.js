function update() {
  const data = document.getElementById("nodown-input").value;
  const resultText = noDown(data);
  // console.log(resultText);

  const render = document.getElementById("nodown-render");
  render.innerHTML = resultText;
}

function noDown(text) {
  const lines = text.split("\n");
  const syntaxTree = {
    type: "root",
    children: [],
  };

  const createText = (text) => {
    return [
      {
        type: "text",
        children: text,
      },
    ];
  };

  const titleRegex = /^(#{1,6})\s(.+)/;
  const createTitle = (line) => {
    const match = line.match(titleRegex);
    const level = match[1].length;
    const content = match[2].trim();
    const title = {
      type: "title",
      level: level,
      children: createText(content),
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
      console.log(blockCode);
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
  let lastListLevel = -1;
  let activeList = {};
  let listRoot = {
    type: "idk",
    children: [],
    level: 0,
  };
  const createList = (line, afterLine) => {
    // Récupération des donnée de l'élément de la liste
    const match = line.match(listRegex);
    const listType = match[2] === "-" ? "unordered" : "ordered";
    const listContent = match[3];

    // Mis a jour de son niveau
    let listLevel = match[1].length;
    if (listLevel % 2 == 1) listLevel--; // Changement de niveau tout les deux espaces uniquement
    listLevel = listLevel / 2;

    // Création de l'élément
    const listElement = {
      type: "list-element",
      level: listLevel,
      children: [listContent],
    };

    // Initialisation de la liste
    if (lastListLevel === -1) {
      activeList = listRoot;
      activeList.type = listType + "-list";
      activeList.children.push(listElement);
    }

    // Si nouvelle sous liste
    else if (lastListLevel < listLevel) {
      console.log("New list");
      const newList = {
        type: listType + "-list",
        level: listLevel + 1,
        children: [listElement],
      };
      activeList.children[activeList.children.length - 1].children.push(
        newList
      );
      activeList = newList;
    }

    // Si ancienne liste
    else if (lastListLevel > listLevel) {
      console.log("Old list");
      activeList = listRoot;
      for (index = 0; index < listLevel + 1; index++) {
        activeList = activeList.children[activeList.children.length - 1];
      }
      console.log({ ...activeList });
      activeList.children.push(listElement);
    }

    // Si juste nouveau élément
    else if (lastListLevel === listLevel) {
      console.log("Just new item");
      activeList.children.push(listElement);
    }

    lastListLevel = listLevel;

    // Si dernier élément
    if (!listRegex.test(afterLine)) {
      syntaxTree.children.push({ ...listRoot });
      lastListLevel = -1;
      listRoot = {
        type: "idk",
        children: [],
        level: 0,
      };
      activeList = {};
    }
  };

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
  return objectToHTML(syntaxTree);
}

function objectToHTML(obj) {
  if (!obj || typeof obj !== "object") {
    return obj ? obj.toString() : "";
  }

  let html = "";

  if (obj.type === "root" && obj.children) {
    html += obj.children.map((child) => objectToHTML(child)).join("");
  } 
  else if (obj.type === "unordered-list" && obj.children) {
    html += "<ul>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</ul>";
  }
   else if (obj.type === "ordered-list" && obj.children) {
    html += "<ol>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</ol>";
  }
   else if (obj.type === "block-code" && obj.children) {
    html += "<pre class=\"" + obj.language + "\"><code>";
    html += obj.children.map((child) => objectToHTML(child)).join("\n");
    html += "</code></pre>";
  }
   else if (obj.type === "list-element" && obj.children) {
    html += "<li>";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</li>";
  }
   else if (obj.type === "title" && obj.children) {
    html += "<h" + obj.level + ">";
    html += obj.children.map((child) => objectToHTML(child)).join("");
    html += "</h" + obj.level + ">";
  }
   else if (obj.type === "text" && obj.children) {
    html += obj.children;
  }

  return html;
}
