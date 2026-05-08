/**
 * Build target agent files from this repo `agents/*.md`.
 * Run: node scripts/sync-codex-agents-toml.mjs
 */
import fs from "fs";
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
