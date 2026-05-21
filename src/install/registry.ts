import { installClaude } from "./converters/claude.js";
import { installCodex } from "./converters/codex.js";
import { installCursor } from "./converters/cursor.js";
import { installWindsurf } from "./converters/windsurf.js";
import { installOpencode } from "./converters/opencode.js";
import { installKilo } from "./converters/kilo.js";
import { installGemini } from "./converters/gemini.js";
import { installCopilot } from "./converters/copilot.js";
import { installAntigravity, installAugment, installCodebuddy } from "./converters/generic-skills.js";
import { installTrae } from "./converters/trae.js";
import { installCline } from "./converters/cline.js";
import { installOpenclaw } from "./converters/openclaw.js";
import { installQoder } from "./converters/qoder.js";
import type { InstallContext } from "./types.js";

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
  "qoder",
];

export const INSTALLERS: Record<string, (ctx: InstallContext) => Promise<void>> = {
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
  qoder: installQoder,
};
