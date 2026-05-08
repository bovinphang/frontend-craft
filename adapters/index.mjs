import { buildClaude } from "./claude.mjs";
import { buildCodex } from "./codex.mjs";
import { buildOpenclaw } from "./openclaw.mjs";

const adapters = {
  claude: buildClaude,
  codex: buildCodex,
  openclaw: buildOpenclaw,
};

export function buildTarget(targetName, sourceBundle) {
  const adapter = adapters[targetName];
  if (!adapter) {
    throw new Error(`Unsupported target: ${targetName}`);
  }
  return adapter(sourceBundle);
}
