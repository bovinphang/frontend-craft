import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRuntimePromptText,
  createLanguagePromptState,
  createLocationPromptState,
  createRuntimePromptState,
  parseLanguageInput,
  parseLocationInput,
  parseRuntimeInput,
  renderSelectablePrompt,
} from "../../src/install/interactive.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const cli = path.join(root, "dist", "bin", "frontend-craft.js");

test("version prints semver", () => {
  const out = execFileSync(process.execPath, [cli, "version"], {
    encoding: "utf8",
  }).trim();
  assert.match(out, /^\d+\.\d+\.\d+/);
});

test("top-level version and help flags keep their command behavior", () => {
  const version = execFileSync(
    process.execPath,
    [cli, "--version", "--dry-run"],
    {
      encoding: "utf8",
    },
  ).trim();
  assert.match(version, /^\d+\.\d+\.\d+/);

  const help = execFileSync(process.execPath, [cli, "--help", "--dry-run"], {
    encoding: "utf8",
  });
  assert.match(help, /Usage:/);
  assert.doesNotMatch(help, /Installing frontend-craft/);
});

test("install help flag prints help without installing", () => {
  const help = execFileSync(
    process.execPath,
    [cli, "install", "--help", "--dry-run"],
    {
      encoding: "utf8",
    },
  );
  assert.match(help, /Usage:/);
  assert.match(help, /frontend-craft setup \[runtime\] \[options\]/);
  assert.match(help, /frontend-craft setup all \[options\]/);
  assert.match(help, /fec setup \[runtime\] \[options\]/);
  assert.match(help, /fec setup all \[options\]/);
  assert.match(help, /setup <runtime> and setup all install locally by default/);
  assert.match(help, /--lang <lang>/);
  assert.doesNotMatch(help, /Installing frontend-craft/);
});

test("setup defaults to local project installation", () => {
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-setup-default-home-"),
  );
  try {
    const out = execFileSync(
      process.execPath,
      [cli, "setup", "claude", "--dry-run"],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          CLAUDE_CONFIG_DIR: path.join(runtimeHome, "claude"),
        },
      },
    );

    assert.match(
      out,
      new RegExp(
        `Installing frontend-craft for "claude" -> ${escapeRegExp(path.join(root, ".claude"))}`,
      ),
    );
    assert.doesNotMatch(out, /\(global\)/);
  } finally {
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("setup uses local runtime directory unless global is explicit", () => {
  const local = execFileSync(
    process.execPath,
    [cli, "setup", "codex", "--dry-run"],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  assert.match(
    local,
    new RegExp(
      `Installing frontend-craft for "codex" -> ${escapeRegExp(path.join(root, ".codex"))}`,
    ),
  );
  assert.doesNotMatch(local, /\(global\)/);

  const global = execFileSync(
    process.execPath,
    [cli, "setup", "codex", "--global", "--dry-run"],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  assert.match(
    global,
    /Installing frontend-craft for "codex" -> .+\.codex \(global\)/,
  );
});

test("setup all installs every runtime locally by default", () => {
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-setup-all-local-home-"),
  );
  try {
    const out = execFileSync(
      process.execPath,
      [cli, "setup", "all", "--dry-run"],
      {
        cwd: root,
        encoding: "utf8",
        env: isolatedRuntimeEnv(runtimeHome),
      },
    );

    assert.match(
      out,
      new RegExp(
        `Installing frontend-craft for "claude" -> ${escapeRegExp(path.join(root, ".claude"))}`,
      ),
    );
    assert.match(
      out,
      new RegExp(
        `Installing frontend-craft for "codex" -> ${escapeRegExp(path.join(root, ".codex"))}`,
      ),
    );
    assert.match(
      out,
      new RegExp(
        `Installing frontend-craft for "qoder" -> ${escapeRegExp(path.join(root, ".qoder"))}`,
      ),
    );
    assert.doesNotMatch(out, /\(global\)/);
  } finally {
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("setup all can install every runtime globally when global is explicit", () => {
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-setup-all-global-home-"),
  );
  try {
    const out = execFileSync(
      process.execPath,
      [cli, "setup", "all", "--global", "--dry-run"],
      {
        cwd: root,
        encoding: "utf8",
        env: isolatedRuntimeEnv(runtimeHome),
      },
    );

    assert.match(
      out,
      new RegExp(
        `Installing frontend-craft for "claude" -> ${escapeRegExp(path.join(runtimeHome, "claude"))} \\(global\\)`,
      ),
    );
    assert.match(
      out,
      new RegExp(
        `Installing frontend-craft for "codex" -> ${escapeRegExp(path.join(runtimeHome, "codex"))} \\(global\\)`,
      ),
    );
    assert.match(
      out,
      new RegExp(
        `Installing frontend-craft for "qoder" -> ${escapeRegExp(path.join(runtimeHome, "qoder"))} \\(global\\)`,
      ),
    );
  } finally {
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("install all remains an unknown runtime", () => {
  assert.throws(
    () =>
      execFileSync(process.execPath, [cli, "install", "all", "--dry-run"], {
        cwd: root,
        encoding: "utf8",
        stdio: "pipe",
      }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 1);
      assert.match(
        String((error as { stderr?: Buffer | string }).stderr),
        /Unknown runtime: all/,
      );
      return true;
    },
  );
});

test("init is no longer a CLI command", () => {
  assert.throws(
    () =>
      execFileSync(process.execPath, [cli, "init", "claude", "--dry-run"], {
        cwd: root,
        encoding: "utf8",
        stdio: "pipe",
      }),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 1);
      assert.match(
        String((error as { stderr?: Buffer | string }).stderr),
        /Unknown command: init/,
      );
      return true;
    },
  );
});

test("list includes claude, openclaw, and qoder", () => {
  const out = execFileSync(process.execPath, [cli, "list"], {
    encoding: "utf8",
  });
  assert.match(out, /claude/);
  assert.match(out, /openclaw/);
  assert.match(out, /qoder/);
});

test("matrix prints runtime capability matrix", () => {
  const out = execFileSync(process.execPath, [cli, "matrix"], {
    encoding: "utf8",
  });
  assert.match(
    out,
    /Runtime\s+Tier\s+Skills\s+Agents\s+Commands\s+Hooks\s+Rules\s+Templates\s+MCP\s+Reports\s+Init/,
  );
  assert.match(
    out,
    /claude\s+full\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+native/,
  );
  assert.match(
    out,
    /codex\s+full\s+yes\s+yes\s+no\s+no\s+yes\s+yes\s+no\s+yes\s+native/,
  );
  assert.match(
    out,
    /qoder\s+full\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+no\s+yes\s+native/,
  );
  assert.match(
    out,
    /codebuddy\s+skills-rules-only\s+yes\s+no\s+no\s+no\s+no\s+no\s+no\s+yes\s+none/,
  );
});

test("sync-metadata check succeeds when public metadata is aligned", () => {
  const out = execFileSync(
    process.execPath,
    [cli, "sync-metadata", "--check"],
    { encoding: "utf8" },
  );
  assert.match(out, /metadata is synchronized/);
});

test("doctor reports local install health", () => {
  const out = execFileSync(process.execPath, [cli, "doctor", "claude"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.match(out, /frontend-craft doctor: claude/);
  assert.match(out, /skills:/);
  assert.match(out, /commands:/);
});

test("doctor reports qoder health fields", () => {
  const out = execFileSync(process.execPath, [cli, "doctor", "qoder"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.match(out, /frontend-craft doctor: qoder/);
  assert.match(out, /hooks:/);
  assert.match(out, /rules:/);
});

test("runtime prompt supports multiple selections and all shortcut", () => {
  assert.deepEqual(parseRuntimeInput("1"), ["claude"]);
  assert.deepEqual(parseRuntimeInput("1,6"), ["claude", "kilo"]);
  assert.deepEqual(parseRuntimeInput("1 6"), ["claude", "kilo"]);
  assert.deepEqual(parseRuntimeInput("1,1,6"), ["claude", "kilo"]);
  assert.deepEqual(parseRuntimeInput(""), ["claude"]);
  assert.deepEqual(parseRuntimeInput("abc"), ["claude"]);

  const all = parseRuntimeInput("16");
  assert.ok(all.includes("claude"));
  assert.ok(all.includes("openclaw"));
  assert.ok(all.includes("qoder"));
  assert.ok(all.length > 10);
});

test("location parser defaults to global and accepts local", () => {
  assert.equal(parseLocationInput(""), true);
  assert.equal(parseLocationInput("1"), true);
  assert.equal(parseLocationInput("2"), false);
  assert.equal(parseLocationInput("invalid"), true);
});

test("install rejects unsupported language", () => {
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [cli, "install", "claude", "--dry-run", "--lang", "fr"],
        {
          cwd: root,
          encoding: "utf8",
          stdio: "pipe",
        },
      ),
    (error: unknown) => {
      assert.equal((error as { status?: number }).status, 1);
      assert.match(
        String((error as { stderr?: Buffer | string }).stderr),
        /Unsupported language: fr/,
      );
      return true;
    },
  );
});

test("language parser defaults to English and accepts Simplified Chinese", () => {
  assert.equal(parseLanguageInput(""), "en");
  assert.equal(parseLanguageInput("1"), "en");
  assert.equal(parseLanguageInput("en"), "en");
  assert.equal(parseLanguageInput("2"), "zh-CN");
  assert.equal(parseLanguageInput("zh-CN"), "zh-CN");
  assert.equal(parseLanguageInput("invalid"), "en");
});

test("runtime prompt describes multi-select and all option", () => {
  const prompt = buildRuntimePromptText();
  assert.match(prompt, /Which runtime\(s\) would you like to install for\?/);
  assert.match(prompt, /Selected:\s+Claude Code/);
  assert.match(prompt, /Search: \[type to filter\]/);
  assert.match(
    prompt,
    /Up\/Down navigate - Space toggle - Backspace remove - Enter confirm/,
  );
  assert.match(prompt, /\[x\] Claude Code \(selected\)/);
  assert.match(prompt, /\[ \] Codex/);
  assert.match(prompt, /Claude Code/);
  assert.match(prompt, /OpenClaw/);
  assert.match(prompt, /Qoder/);
  assert.doesNotMatch(prompt, /\b1\)/);
});

test("runtime selectable prompt toggles, removes, filters, and confirms multiple values", () => {
  const state = createRuntimePromptState();
  assert.deepEqual(state.selected, ["claude"]);

  state.move(1);
  state.toggle();
  assert.deepEqual(state.selected, ["claude", "codex"]);

  state.backspace();
  assert.deepEqual(state.selected, ["claude"]);

  state.type("open");
  assert.equal(state.visibleOptions()[0].value, "opencode");
  state.toggle();
  assert.deepEqual(state.confirm(), ["claude", "opencode"]);
});

test("location selectable prompt remains single-select", () => {
  const state = createLocationPromptState(["claude"]);
  assert.deepEqual(state.selected, ["global"]);

  state.move(1);
  state.toggle();
  assert.deepEqual(state.selected, ["local"]);
  assert.equal(state.confirm(), false);

  state.move(-1);
  state.toggle();
  assert.deepEqual(state.selected, ["global"]);
  assert.equal(state.confirm(), true);
});

test("language selectable prompt remains single-select and defaults to English", () => {
  const state = createLanguagePromptState();
  assert.deepEqual(state.selected, ["en"]);

  state.move(1);
  state.toggle();
  assert.deepEqual(state.selected, ["zh-CN"]);
  assert.equal(state.confirm(), "zh-CN");
});

test("selectable prompt render includes selected summary, search, controls, and pagination", () => {
  const state = createRuntimePromptState({ pageSize: 2 });
  const rendered = renderSelectablePrompt(state);
  assert.match(rendered, /Selected:\s+Claude Code/);
  assert.match(rendered, /Search: \[type to filter\]/);
  assert.match(
    rendered,
    /Up\/Down navigate - Space toggle - Backspace remove - Enter confirm/,
  );
  assert.match(rendered, /> \[x\] Claude Code \(selected\)/);
  assert.match(rendered, /\(1\/\d+\)/);
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isolatedRuntimeEnv(runtimeHome: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    CLAUDE_CONFIG_DIR: path.join(runtimeHome, "claude"),
    CURSOR_CONFIG_DIR: path.join(runtimeHome, "cursor"),
    GEMINI_CONFIG_DIR: path.join(runtimeHome, "gemini"),
    CODEX_HOME: path.join(runtimeHome, "codex"),
    COPILOT_CONFIG_DIR: path.join(runtimeHome, "copilot"),
    ANTIGRAVITY_CONFIG_DIR: path.join(runtimeHome, "antigravity"),
    WINDSURF_CONFIG_DIR: path.join(runtimeHome, "windsurf"),
    AUGMENT_CONFIG_DIR: path.join(runtimeHome, "augment"),
    TRAE_CONFIG_DIR: path.join(runtimeHome, "trae"),
    CODEBUDDY_CONFIG_DIR: path.join(runtimeHome, "codebuddy"),
    CLINE_CONFIG_DIR: path.join(runtimeHome, "cline"),
    OPENCODE_CONFIG_DIR: path.join(runtimeHome, "opencode"),
    KILO_CONFIG_DIR: path.join(runtimeHome, "kilo"),
    OPENCLAW_CONFIG_DIR: path.join(runtimeHome, "openclaw"),
    QODER_CONFIG_DIR: path.join(runtimeHome, "qoder"),
  };
}
