import parser from "./package/parser.js";
import htmlRender from "./package/html-render.js";

const updateDoc = () => {
  const data = document.getElementById("nodown-input").value;
  const syntaxTree = parser(data);
  const htmlResult = htmlRender(syntaxTree);
  const render = document.getElementById("nodown-render");
  render.innerHTML = htmlResult;
};

window.updateDoc = updateDoc;
