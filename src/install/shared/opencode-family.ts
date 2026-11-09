import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { createFileTools, readUtf8 } from "../shared/fs.js";
/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installOpencodeFamily(
  ctx: InstallContext,
): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  const cmdDest = path.join(baseDir, "commands");
  if (dryRun && !ctx.session) {
    (ctx.log ?? console.log)(`[dry-run] opencode/kilo commands -> ${cmdDest}`);
    return;
  }
  const {
    ensureDir,
    readUtf8,
    writeUtf8,
    retireManagedFile,
    copyProductSkills,
  } = createFileTools(ctx);
  ensureDir(cmdDest);
  const cmdDir = path.join(contentRoot, "commands");
  for (const f of fs.readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    const raw = readUtf8(path.join(cmdDir, f));
    writeUtf8(path.join(cmdDest, f), raw);
    retireManagedFile(path.join(baseDir, "command", f));
  }
  const skillsDest = path.join(baseDir, "skills");
  ensureDir(skillsDest);
  copyProductSkills(path.join(contentRoot, "skills"), skillsDest);
  const jsoncPath = path.join(baseDir, "opencode.jsonc");
  const legacy = isLegacyTemplate(jsoncPath);
  if (ctx.runtime === "opencode" && (!fs.existsSync(jsoncPath) || legacy)) {
    const content = `{
  "$schema": "https://opencode.ai/config.json",
  "permission": { "bash": "allow" }
}
`;
    // Only the exact historical product template is eligible for adoption.
    if (legacy) ctx.session!.stage(jsoncPath, Buffer.from(content));
    else writeUtf8(jsoncPath, content);
  }
}
function isLegacyTemplate(file: string): boolean {
  try {
    const value = JSON.parse(readUtf8(file));
    return (
      value.$schema === "https://opencode.ai/config.json" &&
      Object.keys(value).length === 2 &&
      JSON.stringify(value.permissions) === '{"bash":"allow"}'
    );
  } catch {
    return false;
  }
}
