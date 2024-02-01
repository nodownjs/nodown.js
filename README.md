![nodown thumbnail](https://raw.githubusercontent.com/nodownjs/brand-assets/main/thumbnail/thumbnail.svg)

# Nodown

![npm package version](https://badgen.net/npm/v/nodown) ![npm bundle size](https://img.shields.io/bundlephobia/min/nodown) ![npm dependencies count](https://badgen.net/bundlephobia/dependency-count/nodown) ![npm types](https://badgen.net/npm/types/nodown) ![github commits count](https://badgen.net/github/commits/nodownjs/nodown.js) ![github last commit](https://badgen.net/github/last-commit/nodownjs/nodown.js)

A new experimental lightweight markup language written in javascript ~

## Little overview of what Nodown can do

![Capture d’écran 2024-02-02 à 00 11 51](https://github.com/nodownjs/nodown.js/assets/90503814/2c17be1f-88c5-45d8-af56-9611d89c546c)


## Usage

```js
import { parser, renderToHTML } from "nodown";

// Parse the text into a tree
const tree = parser(text);
// Render the tree to HTML
const doc = renderToHTML(tree);

// Display the HTML in your document
document.getElementById("nodown-output").innerHTML = doc;
```

You can incorporate predefined styles located in the following directory structure:

```arduino
node_modules/
  nodown/
    styles/
      index.css        // Base styles
      theme.dark.css   // Styles for dark theme
      theme.light.css  // Styles for light theme
```

For the theme styles to take effect, make sure to link the appropriate stylesheet based on the [data-theme="..."] attribute of your body element. You can include all styles, but only one will be applied depending on the specified theme.

## Introduction

The Nodown project emerged from a desire to improve Markdown, by incorporating additional features and resolving certain perceptible limitations. One of the main motivations is to bring together the various iterations of Markdown, created to overcome its initial shortcomings, such as the native absence of features like tables.

This initiative has its origins in specific situations, such as the difficulty of adjusting the size of images in standard Markdown.

The vision of centralization stems from the realization that many services and software use modified versions of Markdown creating a proliferation of variants and confusion as to the exact definition of Markdown.

My ambition is to clarify this situation by offering a new, centralized solution geared towards listening and continuous improvement.

## Objectives

- Address perceived limitations in standard Markdown.
- Adding new syntax features.
- Centralize various Markdown iterations.

## Key Features

- **Parser**: Converts raw text into an object (syntax tree).
- **RenderTo**:
  - **HTML**: Converts text into an HTML document.
  - **Text**: Converts text into an formatted Text (experimental).
  - Other renders will be available later.

All these features are currently bundled in the same package, with a possible split into multiple packages if needed.

## Technology

### Language:

- NodeJS https://github.com/nodejs/node

### Development Dependencies

- Git https://github.com/git/git
- esbuild https://github.com/evanw/esbuild
- Sass https://github.com/sass/dart-sass

## Compatibility

- Not 100% compatible with other _Markdown_ versions.
- Syntax specialization (e.g., one syntax per element).

## Testing and Validation

Not yet explored.

## Documentation

Not yet started.

## Links

Not links available yet.

## Future Enhancements

- Lots of room for improvement.
- Addition of features.
- Integration of new renders.
- Introduction of additional tools.
