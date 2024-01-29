declare module "nodown" {
  export function parser(input: string): object;
  export function renderToHTML(input: object): string;
  export function renderToText(input: object): string;
}
