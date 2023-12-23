import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.js"],
  bundle: true,
  outfile: "main.js",
  minify: true,
  target: "es2015",
  format: "esm",
});
