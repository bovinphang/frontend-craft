/**
 * Build target agent files from this repo `agents/*.md`.
 * Backward-compatible wrapper for codex agents build.
 * Run: node scripts/sync-codex-agents-toml.mjs
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { buildTarget } from "../adapters/index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsDir = path.resolve(__dirname, "../agents");
const target = process.env.AGENT_TARGET ?? "codex";
const outDir =
  process.env.AGENTS_OUT_DIR ??
  (target === "codex" ? "D:/code/frontend-craft-codex/.codex/agents" : path.resolve(__dirname, `../dist/${target}`));

const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));
fs.mkdirSync(outDir, { recursive: true });

for (const fileName of files) {
  const sourceBundle = {
    fileName,
    outputDir: outDir,
    raw: fs.readFileSync(path.join(agentsDir, fileName), "utf8"),
  };

  const built = buildTarget(target, sourceBundle);
  fs.writeFileSync(built.outputPath, built.content, "utf8");
  console.log("wrote", built.outputPath);
}
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
