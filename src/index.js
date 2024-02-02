import parser from "./parser";
import renderToHTML from "./renders/html/render";
import renderToText from "./renders/text-render";

const nodown = {
  parser,
  renderToHTML,
  renderToText,
};
export default nodown;
export { parser, renderToHTML, renderToText };
