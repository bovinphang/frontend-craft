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

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const cli = path.join(root, "dist", "bin", "frontend-craft.js");

test("ensureDir is a no-op for an existing filesystem root", () => {
  assert.doesNotThrow(() => ensureDir(path.parse(process.cwd()).root));
});

test("dry-run install claude does not throw", () => {
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-dry-claude-home-"),
  );
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--dry-run"], {
      cwd: root,
      encoding: "utf8",
      env: isolatedRuntimeEnv(runtimeHome),
    });
  } finally {
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("interactive install selects runtime and local location", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-interactive-local-"));
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-interactive-local-home-"),
  );
  try {
    const out = execFileSync(process.execPath, [cli, "install", "--dry-run"], {
      cwd: dir,
      encoding: "utf8",
      input: "1\n2\n",
      env: {
        ...isolatedRuntimeEnv(runtimeHome),
        FRONTEND_CRAFT_FORCE_INTERACTIVE: "1",
      },
    });
    assert.match(out, /Which runtime\(s\) would you like to install for\?/);
    assert.match(out, /Where would you like to install\?/);
    assert.match(out, /Installing frontend-craft for "claude"/);
    assert.match(
      out,
      new RegExp(
        `fc-interactive-local-.*${escapeRegExp(`${path.sep}.claude`)}`,
      ),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("top-level command enters interactive dry-run installer", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-interactive-top-"));
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-interactive-top-home-"),
  );
  try {
    const out = execFileSync(process.execPath, [cli, "--dry-run"], {
      cwd: dir,
      encoding: "utf8",
      input: "1,6\n1\n",
      env: {
        ...isolatedRuntimeEnv(runtimeHome),
        FRONTEND_CRAFT_FORCE_INTERACTIVE: "1",
      },
    });
    assert.match(out, /Which runtime\(s\) would you like to install for\?/);
    assert.match(out, /Installing frontend-craft for "claude"/);
    assert.match(out, /Installing frontend-craft for "kilo"/);
    assert.match(out, /\(global\)/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("specified runtime prompts for install location", () => {
  const dir = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-interactive-location-"),
  );
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-interactive-location-home-"),
  );
  try {
    const out = execFileSync(
      process.execPath,
      [cli, "install", "claude", "--dry-run"],
      {
        cwd: dir,
        encoding: "utf8",
        input: "2\n",
        env: {
          ...isolatedRuntimeEnv(runtimeHome),
          FRONTEND_CRAFT_FORCE_INTERACTIVE: "1",
        },
      },
    );
    assert.match(out, /Where would you like to install\?/);
    assert.match(
      out,
      new RegExp(
        `fc-interactive-location-.*${escapeRegExp(`${path.sep}.claude`)}`,
      ),
    );
    assert.doesNotMatch(out, /\(global\)/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("non-interactive install defaults to claude global dry-run", () => {
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-non-interactive-home-"),
  );
  try {
    const out = execFileSync(process.execPath, [cli, "install", "--dry-run"], {
      cwd: root,
      encoding: "utf8",
      env: isolatedRuntimeEnv(runtimeHome),
    });
    assert.match(out, /Non-interactive terminal detected/);
    assert.match(out, /Installing frontend-craft for "claude"/);
    assert.match(out, /\(global\)/);
  } finally {
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("install claude into temp dir creates hooks and skills", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-test-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-test-claude-home-"),
  );
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });
    assert.ok(fs.existsSync(path.join(dir, ".claude", "hooks.json")));
    assert.ok(
      fs.existsSync(
        path.join(
          dir,
          ".claude",
          "skills",
          "fec-react-project-standard",
          "SKILL.md",
        ),
      ),
    );
    assert.ok(
      fs.existsSync(
        path.join(
          dir,
          ".claude",
          "skills",
          "fec-react-project-standard",
          "references",
          "react-project-details.md",
        ),
      ),
    );
    const securitySkill = fs.readFileSync(
      path.join(dir, ".claude", "skills", "fec-security-review", "SKILL.md"),
      "utf8",
    );
    assert.match(
      securitySkill,
      /^name:\s*fec-security-review$/m,
      "skill frontmatter uses fec- prefix",
    );
    assert.doesNotMatch(
      securitySkill,
      /^version:/m,
      "skill frontmatter must not include version",
    );
    assert.ok(
      fs.existsSync(path.join(dir, ".claude", "commands", "fec-init.md")),
    );
    assert.ok(
      fs.existsSync(path.join(dir, ".claude", "commands", "fec-tdd.md")),
    );
    assert.ok(
      fs.existsSync(
        path.join(dir, ".claude", "rules", "fec-agent-workflow.md"),
      ),
    );
    assert.ok(
      fs.existsSync(path.join(dir, ".claude", "rules", "fec-working-modes.md")),
    );
    assert.ok(fs.existsSync(path.join(dir, ".mcp.json")));
    assert.ok(fs.existsSync(path.join(dir, ".claude-plugin", "plugin.json")));
    assert.ok(!fs.existsSync(path.join(dir, ".claude", "commands", "init.md")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("global claude install does not write project sidecar files into cwd", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-global-cwd-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-global-claude-"),
  );
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--global"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    assert.ok(fs.existsSync(path.join(claudeHome, "hooks.json")));
    assert.ok(
      fs.existsSync(
        path.join(
          claudeHome,
          "skills",
          "fec-react-project-standard",
          "SKILL.md",
        ),
      ),
    );
    assert.ok(!fs.existsSync(path.join(claudeHome, "rules")));
    assert.ok(!fs.existsSync(path.join(dir, ".mcp.json")));
    assert.ok(!fs.existsSync(path.join(dir, ".claude-plugin")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("global installs do not write shared rules into runtime config dirs", () => {
  const cases = [
    ["claude", "CLAUDE_CONFIG_DIR"],
    ["codex", "CODEX_HOME"],
    ["qoder", "QODER_CONFIG_DIR"],
    ["cursor", "CURSOR_CONFIG_DIR"],
  ] as const;

  for (const [runtime, envName] of cases) {
    const dir = fs.mkdtempSync(
      path.join(os.tmpdir(), `fc-global-${runtime}-cwd-`),
    );
    const runtimeHome = fs.mkdtempSync(
      path.join(os.tmpdir(), `fc-global-${runtime}-home-`),
    );
    try {
      execFileSync(process.execPath, [cli, "install", runtime, "--global"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, [envName]: runtimeHome },
      });

      assert.ok(
        !fs.existsSync(path.join(runtimeHome, "rules")),
        `${runtime} global install does not create rules dir`,
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(runtimeHome, { recursive: true, force: true });
    }
  }
});

test("doctor global reports rules as not expected", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-doctor-global-cwd-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-doctor-global-claude-"),
  );
  try {
    const out = execFileSync(
      process.execPath,
      [cli, "doctor", "claude", "--global"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

    assert.match(out, /rules: not expected/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("claude install warns and exits when native plugin is already installed", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-native-conflict-cwd-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-native-conflict-home-"),
  );
  try {
    writeNativeInstallMetadata(claudeHome, "2.3.1");

    assert.throws(
      () =>
        execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
          cwd: dir,
          encoding: "utf8",
          env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
          stdio: "pipe",
        }),
      (err: unknown) => {
        const error = err as { stdout?: Buffer | string; status?: number };
        assert.equal(error.status, 1);
        const out = String(error.stdout ?? "");
        assert.match(out, /Claude Code Marketplace install detected/);
        assert.match(
          out,
          /Update frontend-craft through Claude Code Marketplace/,
        );
        return true;
      },
    );
    assert.ok(
      !fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("claude install --force still exits when native plugin is already installed", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-native-force-cwd-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-native-force-home-"),
  );
  try {
    writeNativeInstallMetadata(claudeHome, "2.3.1");

    assert.throws(
      () =>
        execFileSync(
          process.execPath,
          [cli, "install", "claude", "--local", "--force"],
          {
            cwd: dir,
            encoding: "utf8",
            env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
            stdio: "pipe",
          },
        ),
      (err: unknown) => {
        const error = err as { stdout?: Buffer | string; status?: number };
        assert.equal(error.status, 1);
        const out = String(error.stdout ?? "");
        assert.match(out, /Claude Code Marketplace install detected/);
        assert.match(
          out,
          /Update frontend-craft through Claude Code Marketplace/,
        );
        assert.doesNotMatch(out, /Continuing because --force was provided/);
        return true;
      },
    );
    assert.ok(
      !fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
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
      assert.ok(
        fs.existsSync(path.join(commandsPath, "fec-init.md")),
        `${runtime} installs fec-init.md`,
      );
      assert.ok(
        !fs.existsSync(path.join(commandsPath, "init.md")),
        `${runtime} does not install init.md`,
      );
      assert.ok(
        !fs.existsSync(path.join(commandsPath, "frontend-craft-fec-init.md")),
        `${runtime} does not add a second command prefix`,
      );
      if (runtime === "opencode" || runtime === "kilo") {
        assert.ok(
          fs.existsSync(
            path.join(
              dir,
              baseDir,
              "skills",
              "fec-react-project-standard",
              "SKILL.md",
            ),
          ),
          `${runtime} installs fec-prefixed skill directories`,
        );
        assert.ok(
          !fs.existsSync(
            path.join(
              dir,
              baseDir,
              "skills",
              "frontend-craft-fec-react-project-standard",
            ),
          ),
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
    const claudeHome = fs.mkdtempSync(
      path.join(os.tmpdir(), `fc-${runtime}-cap-claude-home-`),
    );
    try {
      execFileSync(process.execPath, [cli, "install", runtime, "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
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
          fs.existsSync(
            path.join(
              expectedSkillsRoot,
              "fec-react-project-standard",
              "SKILL.md",
            ),
          ),
          `${runtime} installs skills`,
        );
      }
      if (cap.agents) {
        const agentDir =
          runtime === "codex"
            ? path.join(baseDir, "agents")
            : path.join(baseDir, "agents");
        assert.ok(fs.existsSync(agentDir), `${runtime} installs agents`);
        const expectedAgent =
          runtime === "codex"
            ? "fec-code-reviewer.toml"
            : "fec-code-reviewer.md";
        const oldAgent =
          runtime === "codex"
            ? `frontend-${"code-reviewer"}.toml`
            : `frontend-${"code-reviewer"}.md`;
        assert.ok(
          fs.existsSync(path.join(agentDir, expectedAgent)),
          `${runtime} installs fec-prefixed agents`,
        );
        assert.ok(
          !fs.existsSync(path.join(agentDir, oldAgent)),
          `${runtime} does not install unprefixed agents`,
        );
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
        assert.ok(
          fs.existsSync(path.join(commandDir, "fec-init.md")),
          `${runtime} installs fec commands`,
        );
        assert.ok(
          !fs.existsSync(path.join(commandDir, "init.md")),
          `${runtime} does not install unprefixed commands`,
        );
      }
      if (runtime === "qoder") {
        assert.ok(
          fs.existsSync(path.join(baseDir, "agents", "fec-code-reviewer.md")),
          "qoder installs fec-prefixed markdown agents",
        );
        assert.ok(
          fs.existsSync(path.join(baseDir, "rules", "fec-react.md")),
          "qoder installs fec-prefixed shared rules",
        );
        assert.ok(
          !fs.existsSync(path.join(baseDir, "rules", "react.md")),
          "qoder does not install unprefixed rules",
        );
        assert.ok(
          fs.existsSync(path.join(baseDir, "hooks", "fec-security-check.js")),
          "qoder installs security hook script",
        );
        assert.ok(
          fs.existsSync(path.join(baseDir, "hooks", "fec-notify.js")),
          "qoder installs notification hook script",
        );
        const settings = JSON.parse(
          fs.readFileSync(path.join(baseDir, "settings.json"), "utf8"),
        ) as {
          hooks?: unknown;
        };
        assert.ok(settings.hooks, "qoder settings include hooks");
        assert.ok(
          JSON.stringify(settings.hooks).includes(
            ".qoder/hooks/fec-security-check.js",
          ),
        );
      }
      if (cap.rules) {
        const rulesDir =
          runtime === "copilot"
            ? path.join(baseDir, "instructions")
            : runtime === "cline"
              ? baseDir
              : path.join(baseDir, "rules");
        assert.ok(
          fs.existsSync(rulesDir),
          `${runtime} installs rules or instructions`,
        );
        if (runtime === "cursor") {
          assert.ok(
            fs.existsSync(path.join(rulesDir, "fec-react.mdc")),
            `${runtime} installs fec-prefixed rules`,
          );
          assert.ok(
            !fs.existsSync(path.join(rulesDir, "react.mdc")),
            `${runtime} does not install unprefixed rules`,
          );
        } else if (!["copilot", "cline", "trae"].includes(runtime)) {
          assert.ok(
            fs.existsSync(path.join(rulesDir, "fec-react.md")),
            `${runtime} installs fec-prefixed rules`,
          );
          assert.ok(
            !fs.existsSync(path.join(rulesDir, "react.md")),
            `${runtime} does not install unprefixed rules`,
          );
        }
      }
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(claudeHome, { recursive: true, force: true });
    }
  }
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function writeNativeInstallMetadata(claudeHome: string, version: string): void {
  const installPath = path.join(
    claudeHome,
    "plugins",
    "cache",
    "frontend-craft",
    "frontend-craft",
    version,
  );
  fs.mkdirSync(path.join(claudeHome, "plugins"), { recursive: true });
  fs.mkdirSync(installPath, { recursive: true });
  fs.writeFileSync(
    path.join(claudeHome, "plugins", "installed_plugins.json"),
    `${JSON.stringify(
      {
        version: 2,
        plugins: {
          "frontend-craft@frontend-craft": [
            {
              scope: "user",
              installPath,
              version,
            },
          ],
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
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
