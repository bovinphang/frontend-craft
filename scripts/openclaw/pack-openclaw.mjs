/**
 * Prepare npm-packages/openclaw for publishing frontend-craft-openclaw tarball.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packRoot = path.join(root, "npm-packages", "openclaw");
const sourceDist = path.join(root, "dist", "openclaw");

rmSync(packRoot, { recursive: true, force: true });
mkdirSync(packRoot, { recursive: true });

const mainPkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

const pkg = {
  name: "frontend-craft-openclaw",
  version: mainPkg.version,
  description: "OpenClaw native plugin build for Frontend Craft (skills, hooks, workspace init).",
  type: "module",
  license: "MIT",
  author: mainPkg.author,
  repository: mainPkg.repository,
  engines: { node: ">=22.0.0" },
  main: "./dist/index.js",
  exports: { ".": { default: "./dist/index.js" } },
  files: ["dist", "skills", "commands", "templates", ".mcp.json", "openclaw.plugin.json", "README.md", "README.zh-CN.md", "LICENSE"],
  openclaw: {
    extensions: ["./dist/index.js"],
    compat: { pluginApi: ">=2026.4.20" },
    build: { openclawVersion: "2026.4.20", pluginSdkVersion: "2026.4.20" },
  },
  peerDependencies: { openclaw: ">=2026.4.20" },
  dependencies: { "@sinclair/typebox": "^0.34.49" },
  optionalDependencies: { prettier: "^3.5.0" },
  publishConfig: { access: "public" },
};

cpSync(sourceDist, path.join(packRoot, "dist"), { recursive: true });
cpSync(path.join(root, "skills"), path.join(packRoot, "skills"), { recursive: true });
cpSync(path.join(root, "commands"), path.join(packRoot, "commands"), { recursive: true });
mkdirSync(path.join(packRoot, "templates"), { recursive: true });
cpSync(path.join(root, "templates", "openclaw"), path.join(packRoot, "templates", "openclaw"), { recursive: true });
cpSync(path.join(root, "templates", "shared"), path.join(packRoot, "templates", "shared"), { recursive: true });
cpSync(path.join(root, ".mcp.json"), path.join(packRoot, ".mcp.json"));
cpSync(path.join(root, "openclaw.plugin.json"), path.join(packRoot, "openclaw.plugin.json"));
cpSync(path.join(root, "README.openclaw.md"), path.join(packRoot, "README.md"));
cpSync(path.join(root, "README.openclaw.zh-CN.md"), path.join(packRoot, "README.zh-CN.md"));
cpSync(path.join(root, "LICENSE"), path.join(packRoot, "LICENSE"));

writeFileSync(path.join(packRoot, "package.json"), JSON.stringify(pkg, null, 2), "utf8");

execSync(`npm pack --pack-destination "${root}"`, { cwd: packRoot, stdio: "inherit" });

console.log("Packed frontend-craft-openclaw from", packRoot, "to", root);
