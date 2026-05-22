import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_RUNTIMES } from "../../src/install/registry.js";
import { getInstallBaseDir } from "../../src/install/runtime-homes.js";
import { RUNTIME_CAPABILITIES } from "../../src/install/runtime-capabilities.js";
import { ensureDir } from "../../src/install/shared/fs.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "dist", "bin", "frontend-craft.js");

test("ensureDir is a no-op for an existing filesystem root", () => {
  assert.doesNotThrow(() => ensureDir(path.parse(process.cwd()).root));
});

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
    assert.ok(fs.existsSync(path.join(dir, ".claude", "skills", "fec-react-project-standard", "SKILL.md")));
    assert.ok(
      fs.existsSync(
        path.join(dir, ".claude", "skills", "fec-react-project-standard", "references", "react-project-details.md"),
      ),
    );
    const securitySkill = fs.readFileSync(
      path.join(dir, ".claude", "skills", "fec-security-review", "SKILL.md"),
      "utf8",
    );
    assert.match(securitySkill, /^name:\s*fec-security-review$/m, "skill frontmatter uses fec- prefix");
    assert.doesNotMatch(securitySkill, /^version:/m, "skill frontmatter must not include version");
    assert.ok(fs.existsSync(path.join(dir, ".claude", "commands", "fec-init.md")));
    assert.ok(fs.existsSync(path.join(dir, ".claude", "commands", "fec-tdd.md")));
    assert.ok(fs.existsSync(path.join(dir, ".claude", "rules", "agent-workflow.md")));
    assert.ok(fs.existsSync(path.join(dir, ".claude", "rules", "working-modes.md")));
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
    ["qoder", ".qoder", "commands"],
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
      if (runtime === "opencode" || runtime === "kilo") {
        assert.ok(
          fs.existsSync(path.join(dir, baseDir, "skills", "fec-react-project-standard", "SKILL.md")),
          `${runtime} installs fec-prefixed skill directories`,
        );
        assert.ok(
          !fs.existsSync(path.join(dir, baseDir, "skills", "frontend-craft-fec-react-project-standard")),
          `${runtime} does not add a second skill directory prefix`,
        );
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

test("all runtime local installs match declared capabilities", () => {
  for (const runtime of ALL_RUNTIMES) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fc-${runtime}-cap-`));
    try {
      execFileSync(process.execPath, [cli, "install", runtime, "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env },
      });

      const cap = RUNTIME_CAPABILITIES[runtime];
      assert.ok(cap, `${runtime} has a capability declaration`);
      const baseDir = getInstallBaseDir({ runtime, isGlobal: false, cwd: dir });

      if (cap.skills) {
        const expectedSkillsRoot =
          runtime === "codex"
            ? path.join(dir, ".agents", "skills")
            : runtime === "gemini"
              ? path.join(baseDir, "extensions", "frontend-craft", "skills")
              : path.join(baseDir, "skills");
        assert.ok(
          fs.existsSync(path.join(expectedSkillsRoot, "fec-react-project-standard", "SKILL.md")),
          `${runtime} installs skills`,
        );
      }
      if (cap.agents) {
        const agentDir = runtime === "codex" ? path.join(baseDir, "agents") : path.join(baseDir, "agents");
        assert.ok(fs.existsSync(agentDir), `${runtime} installs agents`);
      }
      if (cap.commands) {
        const commandDir =
          runtime === "windsurf"
            ? path.join(baseDir, "workflows")
            : runtime === "opencode" || runtime === "kilo"
              ? path.join(baseDir, "command")
              : runtime === "copilot"
                ? path.join(baseDir, "prompts")
                : path.join(baseDir, "commands");
        assert.ok(fs.existsSync(path.join(commandDir, "fec-init.md")), `${runtime} installs fec commands`);
        assert.ok(!fs.existsSync(path.join(commandDir, "init.md")), `${runtime} does not install unprefixed commands`);
      }
      if (runtime === "qoder") {
        assert.ok(
          fs.existsSync(path.join(baseDir, "agents", "frontend-code-reviewer.md")),
          "qoder installs markdown agents",
        );
        assert.ok(fs.existsSync(path.join(baseDir, "rules", "react.md")), "qoder installs shared rules");
        assert.ok(fs.existsSync(path.join(baseDir, "hooks", "security-check.js")), "qoder installs security hook script");
        assert.ok(fs.existsSync(path.join(baseDir, "hooks", "notify.js")), "qoder installs notification hook script");
        const settings = JSON.parse(fs.readFileSync(path.join(baseDir, "settings.json"), "utf8")) as {
          hooks?: unknown;
        };
        assert.ok(settings.hooks, "qoder settings include hooks");
        assert.ok(JSON.stringify(settings.hooks).includes(".qoder/hooks/security-check.js"));
      }
      if (cap.rules) {
        const rulesDir =
          runtime === "copilot"
            ? path.join(baseDir, "instructions")
            : runtime === "cline"
              ? baseDir
              : path.join(baseDir, "rules");
        assert.ok(fs.existsSync(rulesDir), `${runtime} installs rules or instructions`);
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
