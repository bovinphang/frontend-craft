import os from "node:os";
import path from "node:path";

/**
 * @param {string} p
 */
function expandTilde(p) {
  if (!p) return p;
  if (p.startsWith("~/") || p === "~") return path.join(os.homedir(), p.slice(1));
  return p;
}

/**
 * Global config base directory (aligned with get-shit-done runtime-homes + openclaw).
 * @param {string} runtime
 */
export function getGlobalConfigDir(runtime) {
  const home = os.homedir();
  const env = process.env;

  switch (runtime) {
    case "claude":
      return env.CLAUDE_CONFIG_DIR ? expandTilde(env.CLAUDE_CONFIG_DIR) : path.join(home, ".claude");
    case "cursor":
      return env.CURSOR_CONFIG_DIR ? expandTilde(env.CURSOR_CONFIG_DIR) : path.join(home, ".cursor");
    case "gemini":
      return env.GEMINI_CONFIG_DIR ? expandTilde(env.GEMINI_CONFIG_DIR) : path.join(home, ".gemini");
    case "codex":
      return env.CODEX_HOME ? expandTilde(env.CODEX_HOME) : path.join(home, ".codex");
    case "copilot":
      return env.COPILOT_CONFIG_DIR ? expandTilde(env.COPILOT_CONFIG_DIR) : path.join(home, ".copilot");
    case "antigravity":
      return env.ANTIGRAVITY_CONFIG_DIR
        ? expandTilde(env.ANTIGRAVITY_CONFIG_DIR)
        : path.join(home, ".gemini", "antigravity");
    case "windsurf":
      return env.WINDSURF_CONFIG_DIR
        ? expandTilde(env.WINDSURF_CONFIG_DIR)
        : path.join(home, ".codeium", "windsurf");
    case "augment":
      return env.AUGMENT_CONFIG_DIR ? expandTilde(env.AUGMENT_CONFIG_DIR) : path.join(home, ".augment");
    case "trae":
      return env.TRAE_CONFIG_DIR ? expandTilde(env.TRAE_CONFIG_DIR) : path.join(home, ".trae");
    case "codebuddy":
      return env.CODEBUDDY_CONFIG_DIR ? expandTilde(env.CODEBUDDY_CONFIG_DIR) : path.join(home, ".codebuddy");
    case "cline":
      return env.CLINE_CONFIG_DIR ? expandTilde(env.CLINE_CONFIG_DIR) : path.join(home, ".cline");
    case "opencode": {
      if (env.OPENCODE_CONFIG_DIR) return expandTilde(env.OPENCODE_CONFIG_DIR);
      if (env.XDG_CONFIG_HOME) return path.join(expandTilde(env.XDG_CONFIG_HOME), "opencode");
      return path.join(home, ".config", "opencode");
    }
    case "kilo": {
      if (env.KILO_CONFIG_DIR) return expandTilde(env.KILO_CONFIG_DIR);
      if (env.XDG_CONFIG_HOME) return path.join(expandTilde(env.XDG_CONFIG_HOME), "kilo");
      return path.join(home, ".config", "kilo");
    }
    case "openclaw":
      return env.OPENCLAW_CONFIG_DIR ? expandTilde(env.OPENCLAW_CONFIG_DIR) : path.join(home, ".openclaw");
    default:
      return env.CLAUDE_CONFIG_DIR ? expandTilde(env.CLAUDE_CONFIG_DIR) : path.join(home, ".claude");
  }
}

/** @type {Record<string, string>} project-relative directory; empty = project root files only */
export const LOCAL_DIR = {
  claude: ".claude",
  codex: ".codex",
  cursor: ".cursor",
  windsurf: ".windsurf",
  opencode: ".opencode",
  kilo: ".kilo",
  gemini: ".gemini",
  copilot: ".github",
  antigravity: ".agent",
  augment: ".augment",
  trae: ".trae",
  codebuddy: ".codebuddy",
  cline: "",
  openclaw: ".openclaw",
};

/**
 * @param {{ runtime: string; isGlobal: boolean; cwd: string }} p
 */
export function getInstallBaseDir({ runtime, isGlobal, cwd }) {
  if (isGlobal) return getGlobalConfigDir(runtime);
  if (runtime === "cline") return cwd;
  const sub = LOCAL_DIR[runtime] ?? ".claude";
  return path.join(cwd, sub);
}
