import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "bin", "frontend-craft.mjs");

test("dry-run install claude does not throw", () => {
  execFileSync(process.execPath, [cli, "install", "claude", "--dry-run"], {
    cwd: root,
    encoding: "utf8",
  });
});

test("interactive install selects runtime and local location", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-interactive-local-"));
  try {
    const out = execFileSync(process.execPath, [cli, "install", "--dry-run"], {
      cwd: dir,
      encoding: "utf8",
      input: "1\n2\n",
      env: { ...process.env, FRONTEND_CRAFT_FORCE_INTERACTIVE: "1" },
    });
    assert.match(out, /Which runtime\(s\) would you like to install for\?/);
    assert.match(out, /Where would you like to install\?/);
    assert.match(out, /Installing frontend-craft for "claude"/);
    assert.match(out, new RegExp(`fc-interactive-local-.*${escapeRegExp(`${path.sep}.claude`)}`));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("top-level command enters interactive dry-run installer", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-interactive-top-"));
  try {
    const out = execFileSync(process.execPath, [cli, "--dry-run"], {
      cwd: dir,
      encoding: "utf8",
      input: "1,6\n1\n",
      env: { ...process.env, FRONTEND_CRAFT_FORCE_INTERACTIVE: "1" },
    });
    assert.match(out, /Which runtime\(s\) would you like to install for\?/);
    assert.match(out, /Installing frontend-craft for "claude"/);
    assert.match(out, /Installing frontend-craft for "kilo"/);
    assert.match(out, /\(global\)/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("specified runtime prompts for install location", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-interactive-location-"));
  try {
    const out = execFileSync(process.execPath, [cli, "install", "claude", "--dry-run"], {
      cwd: dir,
      encoding: "utf8",
      input: "2\n",
      env: { ...process.env, FRONTEND_CRAFT_FORCE_INTERACTIVE: "1" },
    });
    assert.match(out, /Where would you like to install\?/);
    assert.match(out, new RegExp(`fc-interactive-location-.*${escapeRegExp(`${path.sep}.claude`)}`));
    assert.doesNotMatch(out, /\(global\)/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("non-interactive install defaults to claude global dry-run", () => {
  const out = execFileSync(process.execPath, [cli, "install", "--dry-run"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.match(out, /Non-interactive terminal detected/);
  assert.match(out, /Installing frontend-craft for "claude"/);
  assert.match(out, /\(global\)/);
});

test("install claude into temp dir creates hooks and skills", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-test-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });
    assert.ok(fs.existsSync(path.join(dir, ".claude", "hooks.json")));
    assert.ok(fs.existsSync(path.join(dir, ".claude", "skills", "react-project-standard", "SKILL.md")));
    const securitySkill = fs.readFileSync(
      path.join(dir, ".claude", "skills", "security-review", "SKILL.md"),
      "utf8",
    );
    assert.match(securitySkill, /^name:\s*fec-security-review$/m, "skill frontmatter uses fec- prefix");
    assert.doesNotMatch(securitySkill, /^name:\s*security-review$/m, "skill frontmatter must not use unprefixed name");
    assert.ok(fs.existsSync(path.join(dir, ".claude", "commands", "fec-init.md")));
    assert.ok(!fs.existsSync(path.join(dir, ".claude", "commands", "init.md")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("runtime command installers keep fec command names", () => {
  const cases = [
    ["windsurf", ".windsurf", "workflows"],
    ["copilot", ".github", "prompts"],
    ["opencode", ".opencode", "command"],
    ["kilo", ".kilo", "command"],
    ["openclaw", ".openclaw", "commands"],
  ];

  for (const [runtime, baseDir, commandDir] of cases) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fc-${runtime}-`));
    try {
      execFileSync(process.execPath, [cli, "install", runtime, "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env },
      });

      const commandsPath = path.join(dir, baseDir, commandDir);
      assert.ok(fs.existsSync(path.join(commandsPath, "fec-init.md")), `${runtime} installs fec-init.md`);
      assert.ok(!fs.existsSync(path.join(commandsPath, "init.md")), `${runtime} does not install init.md`);
      assert.ok(
        !fs.existsSync(path.join(commandsPath, "frontend-craft-fec-init.md")),
        `${runtime} does not add a second command prefix`,
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
