declare module "nodown" {
  export function parser(input: string): object;
  export function renderToHTML(input: object, options: object): string;
  export function renderToText(input: object): string;
}
