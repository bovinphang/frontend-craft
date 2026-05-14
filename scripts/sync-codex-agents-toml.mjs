/**
 * Regenerate Codex agent TOML files from `agents/*.md` (optional dev helper).
 * Usage: CODEX_AGENTS_DIR=/path/to/out node scripts/sync-codex-agents-toml.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { agentMdToToml } from "../src/install/codex-agents.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsDir = path.resolve(__dirname, "../agents");
const outDir = process.env.CODEX_AGENTS_DIR;

if (!outDir) {
  console.error("Set CODEX_AGENTS_DIR to the target directory for .toml files (e.g. a temp dir).");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));

for (const f of files) {
  const raw = fs.readFileSync(path.join(agentsDir, f), "utf8");
  const tom = agentMdToToml(raw, f);
  const out = path.join(outDir, f.replace(/\.md$/, ".toml"));
  fs.writeFileSync(out, tom, "utf8");
  console.log("wrote", out);
}
