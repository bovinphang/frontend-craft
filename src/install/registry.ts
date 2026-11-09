import { installClaude } from "./converters/claude.js";
import { installCodex } from "./converters/codex.js";
import { installCursor } from "./converters/cursor.js";
import { installWindsurf } from "./converters/windsurf.js";
import { installOpencode } from "./converters/opencode.js";
import { installKilo } from "./converters/kilo.js";
import { installGemini } from "./converters/gemini.js";
import { installCopilot } from "./converters/copilot.js";
import {
  installAntigravity,
  installAugment,
  installCodebuddy,
} from "./converters/generic-skills.js";
import { installTrae } from "./converters/trae.js";
import { installCline } from "./converters/cline.js";
import { installOpenclaw } from "./converters/openclaw.js";
import { installQoder } from "./converters/qoder.js";
import type { InstallContext } from "./types.js";
import path from "node:path";
import { runProductLifecycle } from "@bovinphang/craft-common";
import { PRODUCT_DEFINITION, toProductContext } from "./product-definition.js";
import { MANIFEST_CODEC } from "./manifest-codec.js";

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

const PRODUCT_INSTALLERS: Record<
  string,
  (ctx: InstallContext) => Promise<void>
> = {
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

export const INSTALLERS: typeof PRODUCT_INSTALLERS = Object.fromEntries(
  Object.entries(PRODUCT_INSTALLERS).map(([id, install]) => [
    id,
    async (ctx: InstallContext): Promise<void> => {
      if (ctx.session) return install(ctx);
      const context = toProductContext(ctx);
      await runProductLifecycle({
        action: ctx.mode,
        definition: PRODUCT_DEFINITION,
        context,
        codec: MANIFEST_CODEC,
        adapter: {
          configurationFiles: () => [
            path.join(ctx.baseDir, "settings.json"),
            path.join(ctx.isGlobal ? ctx.baseDir : ctx.cwd, "AGENTS.md"),
            path.join(ctx.isGlobal ? ctx.baseDir : ctx.cwd, "GEMINI.md"),
          ],
          async plan(_context, session) {
            await install({ ...ctx, session });
          },
        },
      });
    },
  ]),
);
