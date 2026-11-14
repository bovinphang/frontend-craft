import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { build, type BuildOptions } from "esbuild";
import { resolveSourceRoot } from "../src/install/shared/resolve-plugin-root.js";
import { syncCommonContent } from "./sync-common.js";
import { fileURLToPath } from "node:url";

const root = resolveSourceRoot(import.meta.url);
syncCommonContent({
  productRoot: path.join(root, "dist/package"),
  commonRoot: path.resolve(
    path.dirname(
      fileURLToPath(import.meta.resolve("@bovinphang/craft-common")),
    ),
    "..",
  ),
  check: true,
});
const outputRoot = path.join(root, "dist/package");
const cliOutfile = path.join(outputRoot, "dist", "bin", "frontend-craft.js");

const hookEntries = [
  [
    "src/hooks/cleanup-claude-cache.ts",
    "dist/hooks/fec-cleanup-claude-cache.js",
  ],
  ["src/hooks/format-changed-file.ts", "dist/hooks/fec-format-changed-file.js"],
  ["src/hooks/notify.ts", "dist/hooks/fec-notify.js"],
  ["src/hooks/run-tests.ts", "dist/hooks/fec-run-tests.js"],
  ["src/hooks/security-check.ts", "dist/hooks/fec-security-check.js"],
  ["src/hooks/session-start.ts", "dist/hooks/fec-session-start.js"],
] as const;

await mkdir(path.join(outputRoot, "dist", "bin"), { recursive: true });
await rm(path.join(outputRoot, "dist", "hooks"), {
  recursive: true,
  force: true,
});
await mkdir(path.join(outputRoot, "dist", "hooks"), { recursive: true });

await bundle({
  entryPoint: "bin/frontend-craft.ts",
  outfile: "dist/bin/frontend-craft.js",
});

if (!existsSync(cliOutfile)) {
  throw new Error(`[build-dist] CLI bundle missing after build: ${cliOutfile}`);
}

for (const [entryPoint, outfile] of hookEntries) {
  await bundle({ entryPoint, outfile });
}

console.log(
  `[build-dist] bundled ${hookEntries.length + 1} JavaScript entry points`,
);

async function bundle({
  entryPoint,
  outfile,
}: {
  entryPoint: string;
  outfile: string;
}): Promise<void> {
  const options: BuildOptions = {
    absWorkingDir: root,
    bundle: true,
    charset: "utf8",
    entryPoints: [entryPoint],
    format: "esm",
    legalComments: "none",
    logLevel: "silent",
    minify: true,
    outfile: path.join(outputRoot, outfile),
    packages: entryPoint === "bin/frontend-craft.ts" ? "bundle" : "external",
    banner:
      entryPoint === "bin/frontend-craft.ts"
        ? {
            js: 'import { createRequire as __fecCreateRequire } from "node:module"; const require = __fecCreateRequire(import.meta.url);',
          }
        : undefined,
    platform: "node",
    sourcemap: false,
    sourcesContent: false,
    target: ["node22"],
  };

  await build(options);
}
