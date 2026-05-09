/**
 * Regenerate frontend-craft-codex `.codex/agents/*.toml` from this repo `agents/*.md`.
 * Run: node scripts/sync-codex-agents-toml.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const agentsDir = path.resolve(__dirname, "../agents");
const outDir = process.env.CODEX_AGENTS_DIR ?? path.resolve(__dirname, "../dist/codex/.codex/agents");

function escTomlBasic(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));

fs.mkdirSync(outDir, { recursive: true });

for (const f of files) {
  const raw = fs.readFileSync(path.join(agentsDir, f), "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    console.error("no frontmatter:", f);
    process.exit(1);
  }
  const fm = m[1];
  const body = m[2]
    .trim()
    .replace(/\.claude\/rules/g, ".codex/rules")
    .replace(/\bCLAUDE\.md\b/g, "AGENTS.md");
  const name = fm.match(/^name:\s*(.+)$/m)[1].trim();
  const dm = fm.match(/^description:\s*(.+)$/m);
  const desc = dm ? dm[1].trim() : "";
  const tom =
    `name = "${name}"\n` +
    `description = "${escTomlBasic(desc)}"\n\n` +
    `model = "gpt-5.4"\n` +
    `model_reasoning_effort = "high"\n\n` +
    `developer_instructions = """\n` +
    body +
    `\n"""\n`;
  const out = path.join(outDir, f.replace(/\.md$/, ".toml"));
  fs.writeFileSync(out, tom, "utf8");
  console.log("wrote", out);
}
