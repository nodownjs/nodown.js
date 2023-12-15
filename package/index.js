import parser from "./parser";
import objectToHTML from "./html-render";

// function getThemeStyles(theme) {
//   let path = "./styles/dark.scss";
//   if (theme === "light") path = "./styles/light.scss";
//   const themeStyles = sass.compile(path);
//   console.log(path);
//   return themeStyles.css.toString();
// }

// function getStyles() {
//   let path = "./styles/index.scss";
//   const styles = sass.compile(path);
//   console.log(path);
//   return styles.css.toString();
// }

export { parser, objectToHTML };
