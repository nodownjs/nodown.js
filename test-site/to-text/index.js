import { parser, renderToText } from "../../../dist/main.js";
const packagePath = "../../";

let theme = localStorage.getItem("theme") || "dark";
updateTheme(theme);

const linkElement = createLinkElement("base");
linkElement.href = packagePath + "styles/index.css";

function updateTheme(theme) {
  const linkElement =
    document.getElementById("theme") || createLinkElement("theme");
  linkElement.href = `${packagePath}styles/theme-${theme}.css`;
  document.body.className = `theme-${theme}`;
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function createLinkElement(id) {
  const linkElement = document.createElement("link");
  linkElement.id = id;
  linkElement.rel = "stylesheet";
  document.head.appendChild(linkElement);
  return linkElement;
}

const updateDoc = () => {
  const data = document.getElementById("nodown-input").value;
  const syntaxTree = parser(data);
  const textResult = renderToText(syntaxTree);
  // const htmlResult = objectToHTML(syntaxTree);
  const render = document.getElementById("nodown-render");
  // render.innerHTML = htmlResult;

  const p = document.createElement("p");
  p.style = "font-family: 'JetBrains Mono' !important";

  const lines = textResult.split("\n");
  for (const line of lines) {
    const lineElement = document.createTextNode(line);
    p.appendChild(lineElement);

    if (line !== lines[lines.length - 1]) {
      p.appendChild(document.createElement("br"));
    }
  }

  // p.textContent = textResult.split("\n").join("\n\n");
  render.innerHTML = "";
  render.appendChild(p);
  // render.textContent = "<p style=\"font-family: 'JetBrains Mono' !important\">" + textResult.split("\n").join("<br/>") + "</p>";
};

function switchPls() {
  var theme = document.body.classList[0];
  if (theme == "theme-light") {
    updateTheme("dark");
  } else {
    updateTheme("light");
  }
}

function prettier() {
  const div = document.getElementById("nodown-input");
  const data = div.value;
  const syntaxTree = parser(data);
  const textResult = renderToText(syntaxTree);
  div.value = textResult;
}

window.updateDoc = updateDoc;
window.switchPls = switchPls;
window.prettier = prettier;
