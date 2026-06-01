import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { build, type BuildOptions } from "esbuild";
import { resolvePluginRoot } from "../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);
const cliOutfile = path.join(root, "dist", "bin", "frontend-craft.js");

const hookEntries = [
  ["src/hooks/cleanup-claude-cache.ts", "dist/hooks/fec-cleanup-claude-cache.js"],
  ["src/hooks/format-changed-file.ts", "dist/hooks/fec-format-changed-file.js"],
  ["src/hooks/notify.ts", "dist/hooks/fec-notify.js"],
  ["src/hooks/run-tests.ts", "dist/hooks/fec-run-tests.js"],
  ["src/hooks/security-check.ts", "dist/hooks/fec-security-check.js"],
  ["src/hooks/session-start.ts", "dist/hooks/fec-session-start.js"],
] as const;

await mkdir(path.join(root, "dist", "bin"), { recursive: true });
await rm(path.join(root, "dist", "hooks"), { recursive: true, force: true });
await mkdir(path.join(root, "dist", "hooks"), { recursive: true });

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

console.log(`[build-dist] bundled ${hookEntries.length + 1} JavaScript entry points`);

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
    outfile,
    packages: "external",
    platform: "node",
    sourcemap: false,
    sourcesContent: false,
    target: ["node22"],
  };

  await build(options);
}
