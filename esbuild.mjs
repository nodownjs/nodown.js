import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/index.js"],
  bundle: true,
  outfile: "dist/main.js",
  minify: true,
  target: "es2015",
  format: "esm",
});
