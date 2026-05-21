import { mkdir } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

async function main() {
  const outDir = path.join(root, "dist", "openclaw");
  const outfile = path.join(outDir, "index.js");
  await mkdir(outDir, { recursive: true });

  await build({
    absWorkingDir: root,
    entryPoints: [path.join(root, "src/openclaw/index.ts")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    target: ["node22"],
    minify: true,
    sourcemap: false,
    sourcesContent: false,
    legalComments: "none",
    charset: "utf8",
    logLevel: "info",
    external: ["openclaw"],
  });
}

main().catch((error) => {
  console.error("[build:openclaw] failed");
  console.error(error);
  process.exit(1);
});
