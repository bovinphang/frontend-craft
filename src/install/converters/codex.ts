import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import type { InstallContext } from "../types.js";
import { copyDir, copyFile, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";
import { agentMdToToml } from "../codex-agents.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installCodex(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, cwd, dryRun, isGlobal } = ctx;
  const agentsSrc = path.join(contentRoot, "agents");
  const codexAgents = path.join(baseDir, "agents");
  const codexRules = path.join(baseDir, "rules");
  const agentsDestGlobal = isGlobal
    ? path.join(os.homedir(), ".agents", "skills")
    : path.join(cwd, ".agents", "skills");

  if (dryRun) {
    console.log(`[dry-run] codex: ${baseDir}, agents -> ${codexAgents}, skills -> ${agentsDestGlobal}`);
    return;
  }

  ensureDir(codexAgents);
  ensureDir(agentsDestGlobal);

  for (const f of fs.readdirSync(agentsSrc)) {
    if (!f.endsWith(".md")) continue;
    const raw = readUtf8(path.join(agentsSrc, f));
    const tom = agentMdToToml(raw, f);
    writeUtf8(path.join(codexAgents, f.replace(/\.md$/, ".toml")), tom);
  }

  copyDir(path.join(contentRoot, "skills"), agentsDestGlobal);

  const rulesShared = path.join(contentRoot, "templates", "shared", "rules");
  if (!isGlobal && fs.existsSync(rulesShared)) copyDir(rulesShared, codexRules);

  const tmplAgents = path.join(contentRoot, "templates", "codex", "AGENTS.md");
  const tmplCfg = path.join(contentRoot, "templates", "codex", "config.toml");
  if (!isGlobal && fs.existsSync(tmplAgents)) {
    const dest = path.join(cwd, "AGENTS.md");
    if (!fs.existsSync(dest)) copyFile(tmplAgents, dest);
  }
  if (fs.existsSync(tmplCfg)) copyFile(tmplCfg, path.join(baseDir, "config.toml"));
}
