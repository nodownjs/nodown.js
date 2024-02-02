import { parser, renderToHTML } from "../../../dist/main.js";
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

  var startTime = performance.now();
  const syntaxTree = parser(data);
  var endTime = performance.now();

  const htmlResult = renderToHTML(syntaxTree, {
    link: (obj) => {
      const strong = document.createElement("strong");
      strong.innerHTML = `${obj.children} - ${obj.url}`;
      return strong;
    },
  });

  console.log(`Took ${endTime - startTime} milliseconds`);

  const render = document.getElementById("nodown-output");
  render.innerHTML = htmlResult;
};

function switchPls() {
  var theme = document.body.classList[0];
  if (theme == "theme-light") {
    updateTheme("dark");
  } else {
    updateTheme("light");
  }
}

window.updateDoc = updateDoc;
window.switchPls = switchPls;
