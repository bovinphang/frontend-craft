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
  const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-manifest-claude-home-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
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
    assert.ok(manifest.files?.some((file) => file.path === "agents/fec-code-reviewer.md"));
    assert.ok(manifest.files?.some((file) => file.path === "hooks.json"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("update and upgrade aliases refresh an existing local install", () => {
  for (const command of ["update", "upgrade"]) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fc-${command}-`));
    const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), `fc-${command}-claude-home-`));
    try {
      execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      });

      const skillPath = path.join(dir, ".claude", "skills", "fec-react-project-standard", "SKILL.md");
      const original = fs.readFileSync(skillPath, "utf8");

      const out = execFileSync(process.execPath, [cli, command, "claude", "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      });

      assert.match(out, new RegExp(`Updating frontend-craft for "claude"`));
      assert.equal(fs.readFileSync(skillPath, "utf8"), original);
      assert.ok(fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")));
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(claudeHome, { recursive: true, force: true });
    }
  }
});

test("update skips files modified since the previous manifest", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-conflict-"));
  const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-conflict-claude-home-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const commandPath = path.join(dir, ".claude", "commands", "fec-init.md");
    fs.appendFileSync(commandPath, "\nUSER CUSTOMIZATION\n", "utf8");

    const out = execFileSync(process.execPath, [cli, "update", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    assert.match(out, /Skipped modified file: commands[/\\]fec-init\.md/);
    assert.match(fs.readFileSync(commandPath, "utf8"), /USER CUSTOMIZATION/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
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

test("update without a runtime refreshes discovered local installs", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-discover-"));
  const runtimeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-discover-home-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: isolatedRuntimeEnv(runtimeHome),
    });

    const out = execFileSync(process.execPath, [cli, "update"], {
      cwd: dir,
      encoding: "utf8",
      env: isolatedRuntimeEnv(runtimeHome),
    });

    assert.match(out, /Updating frontend-craft for "claude"/);
    assert.doesNotMatch(out, /Non-interactive terminal detected/);
    assert.ok(fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("update without a discovered install prints a clear no-op message", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-none-"));
  const runtimeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-none-home-"));
  try {
    const out = execFileSync(process.execPath, [cli, "update"], {
      cwd: dir,
      encoding: "utf8",
      env: isolatedRuntimeEnv(runtimeHome),
    });

    assert.match(out, /No frontend-craft installs found/);
    assert.ok(!fs.existsSync(path.join(dir, ".claude")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("uninstall removes unchanged manifest-managed files and manifest", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-uninstall-"));
  const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-uninstall-claude-home-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const out = execFileSync(process.execPath, [cli, "uninstall", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    assert.match(out, /Uninstalling frontend-craft for "claude"/);
    assert.ok(!fs.existsSync(path.join(dir, ".claude", "skills", "fec-react-project-standard", "SKILL.md")));
    assert.ok(!fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("uninstall skips modified files unless force is provided", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-uninstall-modified-"));
  const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-uninstall-modified-claude-home-"));
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const commandPath = path.join(dir, ".claude", "commands", "fec-init.md");
    fs.appendFileSync(commandPath, "\nUSER CUSTOMIZATION\n", "utf8");

    const skipped = execFileSync(process.execPath, [cli, "remove", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    assert.match(skipped, /Skipped modified file: commands[/\\]fec-init\.md/);
    assert.match(fs.readFileSync(commandPath, "utf8"), /USER CUSTOMIZATION/);

    const forced = execFileSync(process.execPath, [cli, "uninstall", "claude", "--local", "--force"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    assert.match(forced, /Removed modified file: commands[/\\]fec-init\.md/);
    assert.ok(!fs.existsSync(commandPath));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("codex local manifest tracks project-level agent skills for uninstall", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-uninstall-codex-"));
  try {
    execFileSync(process.execPath, [cli, "install", "codex", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });

    const manifestPath = path.join(dir, ".codex", "frontend-craft.manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      files?: Array<{ path: string; root?: string }>;
    };
    assert.ok(manifest.files?.some((file) => file.root === "cwd" && file.path === ".agents/skills/fec-react-project-standard/SKILL.md"));

    execFileSync(process.execPath, [cli, "uninstall", "codex", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });

    assert.ok(!fs.existsSync(path.join(dir, ".agents", "skills", "fec-react-project-standard", "SKILL.md")));
    assert.ok(!fs.existsSync(manifestPath));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

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
