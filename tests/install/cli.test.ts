import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRuntimePromptText,
  createLocationPromptState,
  createRuntimePromptState,
  parseLocationInput,
  parseRuntimeInput,
  renderSelectablePrompt,
} from "../../src/install/interactive.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "bin", "frontend-craft.js");

test("version prints semver", () => {
  const out = execFileSync(process.execPath, [cli, "version"], { encoding: "utf8" }).trim();
  assert.match(out, /^\d+\.\d+\.\d+/);
});

test("top-level version and help flags keep their command behavior", () => {
  const version = execFileSync(process.execPath, [cli, "--version", "--dry-run"], {
    encoding: "utf8",
  }).trim();
  assert.match(version, /^\d+\.\d+\.\d+/);

  const help = execFileSync(process.execPath, [cli, "--help", "--dry-run"], {
    encoding: "utf8",
  });
  assert.match(help, /Usage:/);
  assert.doesNotMatch(help, /Installing frontend-craft/);
});

test("install help flag prints help without installing", () => {
  const help = execFileSync(process.execPath, [cli, "install", "--help", "--dry-run"], {
    encoding: "utf8",
  });
  assert.match(help, /Usage:/);
  assert.doesNotMatch(help, /Installing frontend-craft/);
});

test("list includes claude, openclaw, and qoder", () => {
  const out = execFileSync(process.execPath, [cli, "list"], { encoding: "utf8" });
  assert.match(out, /claude/);
  assert.match(out, /openclaw/);
  assert.match(out, /qoder/);
});

test("matrix prints runtime capability matrix", () => {
  const out = execFileSync(process.execPath, [cli, "matrix"], { encoding: "utf8" });
  assert.match(out, /Runtime\s+Tier\s+Skills\s+Agents\s+Commands\s+Hooks\s+Rules\s+Templates\s+MCP\s+Reports\s+Init/);
  assert.match(out, /claude\s+full\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+native/);
  assert.match(out, /codex\s+full\s+yes\s+yes\s+no\s+no\s+yes\s+yes\s+no\s+yes\s+native/);
  assert.match(out, /qoder\s+full\s+yes\s+yes\s+yes\s+yes\s+yes\s+yes\s+no\s+yes\s+native/);
  assert.match(out, /codebuddy\s+skills-rules-only\s+yes\s+no\s+no\s+no\s+no\s+no\s+no\s+yes\s+none/);
});

test("sync-metadata check succeeds when public metadata is aligned", () => {
  const out = execFileSync(process.execPath, [cli, "sync-metadata", "--check"], { encoding: "utf8" });
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

test("runtime prompt describes multi-select and all option", () => {
  const prompt = buildRuntimePromptText();
  assert.match(prompt, /Which runtime\(s\) would you like to install for\?/);
  assert.match(prompt, /Selected:\s+Claude Code/);
  assert.match(prompt, /Search: \[type to filter\]/);
  assert.match(prompt, /Up\/Down navigate - Space toggle - Backspace remove - Enter confirm/);
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

test("selectable prompt render includes selected summary, search, controls, and pagination", () => {
  const state = createRuntimePromptState({ pageSize: 2 });
  const rendered = renderSelectablePrompt(state);
  assert.match(rendered, /Selected:\s+Claude Code/);
  assert.match(rendered, /Search: \[type to filter\]/);
  assert.match(rendered, /Up\/Down navigate - Space toggle - Backspace remove - Enter confirm/);
  assert.match(rendered, /> \[x\] Claude Code \(selected\)/);
  assert.match(rendered, /\(1\/\d+\)/);
});
