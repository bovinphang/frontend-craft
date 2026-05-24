import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "dist", "bin", "frontend-craft.js");

test("install writes a frontend-craft manifest for the runtime scope", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-manifest-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });

    const manifestPath = path.join(dir, ".claude", "frontend-craft.manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      packageVersion?: string;
      runtime?: string;
      scope?: string;
      files?: Array<{ path: string; hash: string }>;
    };

    assert.match(manifest.packageVersion ?? "", /^\d+\.\d+\.\d+/);
    assert.equal(manifest.runtime, "claude");
    assert.equal(manifest.scope, "local");
    assert.ok(manifest.files?.some((file) => file.path === "skills/fec-react-project-standard/SKILL.md"));
    assert.ok(manifest.files?.some((file) => file.path === "agents/fec-frontend-code-reviewer.md"));
    assert.ok(manifest.files?.some((file) => file.path === "hooks.json"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("update and upgrade aliases refresh an existing local install", () => {
  for (const command of ["update", "upgrade"]) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fc-${command}-`));
    try {
      execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env },
      });

      const skillPath = path.join(dir, ".claude", "skills", "fec-react-project-standard", "SKILL.md");
      const original = fs.readFileSync(skillPath, "utf8");

      const out = execFileSync(process.execPath, [cli, command, "claude", "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env },
      });

      assert.match(out, new RegExp(`Updating frontend-craft for "claude"`));
      assert.equal(fs.readFileSync(skillPath, "utf8"), original);
      assert.ok(fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")));
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

test("update skips files modified since the previous manifest", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-conflict-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });

    const commandPath = path.join(dir, ".claude", "commands", "fec-init.md");
    fs.appendFileSync(commandPath, "\nUSER CUSTOMIZATION\n", "utf8");

    const out = execFileSync(process.execPath, [cli, "update", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });

    assert.match(out, /Skipped modified file: commands[/\\]fec-init\.md/);
    assert.match(fs.readFileSync(commandPath, "utf8"), /USER CUSTOMIZATION/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("update dry-run does not write files or manifests", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-dry-"));
  try {
    const out = execFileSync(process.execPath, [cli, "update", "claude", "--local", "--dry-run"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });

    assert.match(out, /Updating frontend-craft for "claude"/);
    assert.ok(!fs.existsSync(path.join(dir, ".claude")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
