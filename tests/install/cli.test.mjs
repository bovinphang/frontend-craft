import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRuntimePromptText,
  parseLocationInput,
  parseRuntimeInput,
} from "../../src/install/interactive.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "bin", "frontend-craft.mjs");

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

test("list includes claude and openclaw", () => {
  const out = execFileSync(process.execPath, [cli, "list"], { encoding: "utf8" });
  assert.match(out, /claude/);
  assert.match(out, /openclaw/);
});

test("runtime prompt supports multiple selections and all shortcut", () => {
  assert.deepEqual(parseRuntimeInput("1"), ["claude"]);
  assert.deepEqual(parseRuntimeInput("1,6"), ["claude", "kilo"]);
  assert.deepEqual(parseRuntimeInput("1 6"), ["claude", "kilo"]);
  assert.deepEqual(parseRuntimeInput("1,1,6"), ["claude", "kilo"]);
  assert.deepEqual(parseRuntimeInput(""), ["claude"]);
  assert.deepEqual(parseRuntimeInput("abc"), ["claude"]);

  const all = parseRuntimeInput("15");
  assert.ok(all.includes("claude"));
  assert.ok(all.includes("openclaw"));
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
  assert.match(prompt, /Select multiple: 1,2,6 or 1 2 6/);
  assert.match(prompt, /Claude Code/);
  assert.match(prompt, /OpenClaw/);
  assert.match(prompt, /All/);
});
