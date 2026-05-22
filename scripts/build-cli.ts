import { build } from "esbuild";
import { resolvePluginRoot } from "../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

await build({
  absWorkingDir: root,
  bundle: true,
  charset: "utf8",
  entryPoints: ["bin/frontend-craft.ts"],
  format: "esm",
  legalComments: "none",
  logLevel: "info",
  minify: true,
  outfile: "dist/bin/frontend-craft.js",
  platform: "node",
  sourcemap: false,
  sourcesContent: false,
  target: ["node22"],
});
