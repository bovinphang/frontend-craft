import test from "node:test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_RUNTIMES } from "../../src/install/registry.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const cli = path.join(root, "dist", "bin", "frontend-craft.js");

for (const rt of ALL_RUNTIMES) {
  test(`dry-run install ${rt}`, () => {
    const runtimeHome = fs.mkdtempSync(
      path.join(os.tmpdir(), `fc-dry-${rt}-home-`),
    );
    try {
      execFileSync(process.execPath, [cli, "install", rt, "--dry-run"], {
        cwd: root,
        encoding: "utf8",
        env: isolatedRuntimeEnv(runtimeHome),
      });
    } finally {
      fs.rmSync(runtimeHome, { recursive: true, force: true });
    }
  });
}

function isolatedRuntimeEnv(runtimeHome: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    CLAUDE_CONFIG_DIR: path.join(runtimeHome, "claude"),
    CURSOR_CONFIG_DIR: path.join(runtimeHome, "cursor"),
    GEMINI_CONFIG_DIR: path.join(runtimeHome, "gemini"),
    CODEX_HOME: path.join(runtimeHome, "codex"),
    COPILOT_CONFIG_DIR: path.join(runtimeHome, "copilot"),
    ANTIGRAVITY_CONFIG_DIR: path.join(runtimeHome, "antigravity"),
    WINDSURF_CONFIG_DIR: path.join(runtimeHome, "windsurf"),
    AUGMENT_CONFIG_DIR: path.join(runtimeHome, "augment"),
    TRAE_CONFIG_DIR: path.join(runtimeHome, "trae"),
    CODEBUDDY_CONFIG_DIR: path.join(runtimeHome, "codebuddy"),
    CLINE_CONFIG_DIR: path.join(runtimeHome, "cline"),
    OPENCODE_CONFIG_DIR: path.join(runtimeHome, "opencode"),
    KILO_CONFIG_DIR: path.join(runtimeHome, "kilo"),
    OPENCLAW_CONFIG_DIR: path.join(runtimeHome, "openclaw"),
    QODER_CONFIG_DIR: path.join(runtimeHome, "qoder"),
  };
}
