/**
 * Backward-compatible wrapper for codex agents build.
 * Run: node scripts/sync-codex-agents-toml.mjs
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildScript = path.resolve(__dirname, "./build-targets.mjs");

const env = { ...process.env };
if (process.env.CODEX_AGENTS_DIR && !process.env.OUTPUT_DIR) {
  env.OUTPUT_DIR = process.env.CODEX_AGENTS_DIR;
}

const result = spawnSync(process.execPath, [buildScript, "--target", "codex"], {
  stdio: "inherit",
  env,
});

process.exit(result.status ?? 1);
