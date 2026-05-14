import { installClaude } from "./converters/claude.mjs";
import { installCodex } from "./converters/codex.mjs";
import { installCursor } from "./converters/cursor.mjs";
import { installWindsurf } from "./converters/windsurf.mjs";
import { installOpencode } from "./converters/opencode.mjs";
import { installKilo } from "./converters/kilo.mjs";
import { installGemini } from "./converters/gemini.mjs";
import { installCopilot } from "./converters/copilot.mjs";
import { installAntigravity, installAugment, installCodebuddy } from "./converters/generic-skills.mjs";
import { installTrae } from "./converters/trae.mjs";
import { installCline } from "./converters/cline.mjs";
import { installOpenclaw } from "./converters/openclaw.mjs";

export const ALL_RUNTIMES = [
  "claude",
  "codex",
  "cursor",
  "windsurf",
  "opencode",
  "kilo",
  "gemini",
  "copilot",
  "antigravity",
  "augment",
  "trae",
  "codebuddy",
  "cline",
  "openclaw",
];

/** @type {Record<string, (ctx: import('./types.mjs').InstallContext) => Promise<void>>} */
export const INSTALLERS = {
  claude: installClaude,
  codex: installCodex,
  cursor: installCursor,
  windsurf: installWindsurf,
  opencode: installOpencode,
  kilo: installKilo,
  gemini: installGemini,
  copilot: installCopilot,
  antigravity: installAntigravity,
  augment: installAugment,
  trae: installTrae,
  codebuddy: installCodebuddy,
  cline: installCline,
  openclaw: installOpenclaw,
};
