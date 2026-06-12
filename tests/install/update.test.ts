import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const cli = path.join(root, "dist", "bin", "frontend-craft.js");

test("install writes a frontend-craft manifest for the runtime scope", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-manifest-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-manifest-claude-home-"),
  );
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const manifestPath = path.join(
      dir,
      ".claude",
      "frontend-craft.manifest.json",
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      packageVersion?: string;
      runtime?: string;
      scope?: string;
      language?: string;
      files?: Array<{ path: string; hash: string }>;
    };

    assert.match(manifest.packageVersion ?? "", /^\d+\.\d+\.\d+/);
    assert.equal(manifest.runtime, "claude");
    assert.equal(manifest.scope, "local");
    assert.equal(manifest.language, "en");
    assert.ok(
      manifest.files?.some(
        (file) => file.path === "skills/fec-react-project-standard/SKILL.md",
      ),
    );
    assert.ok(
      manifest.files?.some(
        (file) => file.path === "agents/fec-code-reviewer.md",
      ),
    );
    assert.ok(manifest.files?.some((file) => file.path === "hooks.json"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("install with Simplified Chinese writes localized content and manifest language", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-lang-zh-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-lang-zh-claude-home-"),
  );
  try {
    execFileSync(
      process.execPath,
      [cli, "install", "claude", "--local", "--lang", "zh-CN"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

    const commandPath = path.join(dir, ".claude", "commands", "fec-init.md");
    const skillPath = path.join(
      dir,
      ".claude",
      "skills",
      "fec-react-project-standard",
      "SKILL.md",
    );
    const imageGenerationScriptsDir = path.join(
      dir,
      ".claude",
      "skills",
      "fec-image-generation",
      "scripts",
    );
    const manifestPath = path.join(
      dir,
      ".claude",
      "frontend-craft.manifest.json",
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      language?: string;
    };

    assert.match(fs.readFileSync(commandPath, "utf8"), /检测 runtime/);
    assert.match(fs.readFileSync(skillPath, "utf8"), /React 项目规范/);
    assert.ok(fs.existsSync(path.join(imageGenerationScriptsDir, "png-qa.mjs")));
    assert.ok(
      fs.existsSync(
        path.join(imageGenerationScriptsDir, "tech-diagram-render.mjs"),
      ),
    );
    assert.equal(manifest.language, "zh-CN");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("Simplified Chinese image generation scripts match English script filenames", () => {
  const sourceScripts = listMjsFiles(
    path.join(root, "skills", "fec-image-generation", "scripts"),
  );
  const localizedScripts = listMjsFiles(
    path.join(
      root,
      "localized",
      "zh-CN",
      "skills",
      "fec-image-generation",
      "scripts",
    ),
  );

  assert.deepEqual(localizedScripts, sourceScripts);
});

test("update reuses manifest language when --lang is omitted", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-lang-update-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-lang-update-claude-home-"),
  );
  try {
    execFileSync(
      process.execPath,
      [cli, "install", "claude", "--local", "--lang", "zh-CN"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

    execFileSync(process.execPath, [cli, "update", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const commandPath = path.join(dir, ".claude", "commands", "fec-init.md");
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(dir, ".claude", "frontend-craft.manifest.json"),
        "utf8",
      ),
    ) as { language?: string };
    assert.match(fs.readFileSync(commandPath, "utf8"), /检测 runtime/);
    assert.equal(manifest.language, "zh-CN");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("update and upgrade aliases refresh an existing local install", () => {
  for (const command of ["update", "upgrade"]) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fc-${command}-`));
    const claudeHome = fs.mkdtempSync(
      path.join(os.tmpdir(), `fc-${command}-claude-home-`),
    );
    try {
      execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      });

      const skillPath = path.join(
        dir,
        ".claude",
        "skills",
        "fec-react-project-standard",
        "SKILL.md",
      );
      const original = fs.readFileSync(skillPath, "utf8");

      const out = execFileSync(
        process.execPath,
        [cli, command, "claude", "--local"],
        {
          cwd: dir,
          encoding: "utf8",
          env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
        },
      );

      assert.match(out, new RegExp(`Updating frontend-craft for "claude"`));
      assert.equal(fs.readFileSync(skillPath, "utf8"), original);
      assert.ok(
        fs.existsSync(
          path.join(dir, ".claude", "frontend-craft.manifest.json"),
        ),
      );
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.rmSync(claudeHome, { recursive: true, force: true });
    }
  }
});

test("update skips files modified since the previous manifest", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-conflict-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-update-conflict-claude-home-"),
  );
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const commandPath = path.join(dir, ".claude", "commands", "fec-init.md");
    fs.appendFileSync(commandPath, "\nUSER CUSTOMIZATION\n", "utf8");

    const out = execFileSync(
      process.execPath,
      [cli, "update", "claude", "--local"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

    assert.match(out, /Skipped modified file: commands[/\\]fec-init\.md/);
    assert.match(fs.readFileSync(commandPath, "utf8"), /USER CUSTOMIZATION/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("update dry-run does not write files or manifests", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-dry-"));
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-update-dry-home-"),
  );
  try {
    const out = execFileSync(
      process.execPath,
      [cli, "update", "claude", "--local", "--dry-run"],
      {
        cwd: dir,
        encoding: "utf8",
        env: isolatedRuntimeEnv(runtimeHome),
      },
    );

    assert.match(out, /Updating frontend-craft for "claude"/);
    assert.ok(!fs.existsSync(path.join(dir, ".claude")));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("Claude Marketplace install blocks CLI install even with force", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-marketplace-block-"));
  const claudeHome = makeClaudeMarketplaceHome("2.4.0");
  try {
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
      (error: unknown) => {
        const output = String(
          (error as { stdout?: Buffer | string }).stdout ?? "",
        );
        assert.match(output, /Claude Code Marketplace install detected/);
        assert.match(
          output,
          /Update frontend-craft through Claude Code Marketplace/,
        );
        assert.doesNotMatch(output, /Continuing because --force was provided/);
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

test("Claude Marketplace install blocks explicit CLI update", () => {
  const dir = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-marketplace-update-block-"),
  );
  const claudeHome = makeClaudeMarketplaceHome("2.4.0");
  try {
    assert.throws(
      () =>
        execFileSync(process.execPath, [cli, "update", "claude", "--global"], {
          cwd: dir,
          encoding: "utf8",
          env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
          stdio: "pipe",
        }),
      (error: unknown) => {
        const output = String(
          (error as { stdout?: Buffer | string }).stdout ?? "",
        );
        assert.match(output, /Claude Code Marketplace install detected/);
        assert.match(
          output,
          /Update frontend-craft through Claude Code Marketplace/,
        );
        return true;
      },
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("Claude CLI scope conflict fails non-interactively with update and uninstall guidance", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-cli-scope-conflict-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-cli-scope-conflict-home-"),
  );
  try {
    fs.mkdirSync(claudeHome, { recursive: true });
    fs.writeFileSync(
      path.join(claudeHome, "frontend-craft.manifest.json"),
      `${JSON.stringify({ packageVersion: "2.3.1", runtime: "claude", scope: "global", files: [] }, null, 2)}\n`,
      "utf8",
    );

    assert.throws(
      () =>
        execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
          cwd: dir,
          encoding: "utf8",
          env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
          stdio: "pipe",
        }),
      (error: unknown) => {
        const output = String(
          (error as { stdout?: Buffer | string }).stdout ?? "",
        );
        assert.match(output, /Claude CLI global install detected/);
        assert.match(output, /frontend-craft update claude --global/);
        assert.match(output, /frontend-craft uninstall claude --global/);
        assert.match(output, /frontend-craft install claude --local/);
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

test("Claude CLI scope conflict can keep the existing source and update it interactively", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-cli-scope-keep-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-cli-scope-keep-home-"),
  );
  try {
    fs.mkdirSync(claudeHome, { recursive: true });
    fs.writeFileSync(
      path.join(claudeHome, "frontend-craft.manifest.json"),
      `${JSON.stringify({ packageVersion: "2.3.1", runtime: "claude", scope: "global", files: [] }, null, 2)}\n`,
      "utf8",
    );

    const out = execFileSync(
      process.execPath,
      [cli, "install", "claude", "--local", "--lang", "en"],
      {
        cwd: dir,
        encoding: "utf8",
        env: {
          ...process.env,
          CLAUDE_CONFIG_DIR: claudeHome,
          FRONTEND_CRAFT_FORCE_INTERACTIVE: "1",
        },
        input: "\n",
      },
    );

    assert.match(out, /Keep Claude CLI global and update it/);
    assert.match(out, /Updating frontend-craft for "claude" -> .+ \(global\)/);
    assert.ok(
      fs.existsSync(path.join(claudeHome, "frontend-craft.manifest.json")),
    );
    assert.ok(
      !fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("Claude CLI scope conflict can uninstall the existing source and install the requested source interactively", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-cli-scope-switch-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-cli-scope-switch-home-"),
  );
  try {
    fs.mkdirSync(claudeHome, { recursive: true });
    fs.writeFileSync(
      path.join(claudeHome, "frontend-craft.manifest.json"),
      `${JSON.stringify({ packageVersion: "2.3.1", runtime: "claude", scope: "global", files: [] }, null, 2)}\n`,
      "utf8",
    );

    const out = execFileSync(
      process.execPath,
      [cli, "install", "claude", "--local", "--lang", "en"],
      {
        cwd: dir,
        encoding: "utf8",
        env: {
          ...process.env,
          CLAUDE_CONFIG_DIR: claudeHome,
          FRONTEND_CRAFT_FORCE_INTERACTIVE: "1",
        },
        input: "2\n",
      },
    );

    assert.match(
      out,
      /Uninstalling existing Claude CLI global install before switching source/,
    );
    assert.match(out, /Installing frontend-craft for "claude"/);
    assert.ok(
      !fs.existsSync(path.join(claudeHome, "frontend-craft.manifest.json")),
    );
    assert.ok(
      fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("update without a runtime refreshes discovered local installs", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-discover-"));
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-update-discover-home-"),
  );
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
    assert.ok(
      fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(runtimeHome, { recursive: true, force: true });
  }
});

test("update without a discovered install prints a clear no-op message", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-update-none-"));
  const runtimeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-update-none-home-"),
  );
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
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-uninstall-claude-home-"),
  );
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const out = execFileSync(
      process.execPath,
      [cli, "uninstall", "claude", "--local"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

    assert.match(out, /Uninstalling frontend-craft for "claude"/);
    assert.ok(
      !fs.existsSync(
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
      !fs.existsSync(path.join(dir, ".claude", "frontend-craft.manifest.json")),
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("uninstall does not remove Claude Marketplace installs without a CLI manifest", () => {
  const dir = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-marketplace-uninstall-"),
  );
  const claudeHome = makeClaudeMarketplaceHome("2.4.0");
  const marketplaceMetadataPath = path.join(
    claudeHome,
    "plugins",
    "installed_plugins.json",
  );
  try {
    const out = execFileSync(
      process.execPath,
      [cli, "uninstall", "claude", "--global"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

    assert.match(out, /No frontend-craft installs found/);
    assert.ok(fs.existsSync(marketplaceMetadataPath));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("uninstall skips modified files unless force is provided", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-uninstall-modified-"));
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-uninstall-modified-claude-home-"),
  );
  try {
    execFileSync(process.execPath, [cli, "install", "claude", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    const commandPath = path.join(dir, ".claude", "commands", "fec-init.md");
    fs.appendFileSync(commandPath, "\nUSER CUSTOMIZATION\n", "utf8");

    const skipped = execFileSync(
      process.execPath,
      [cli, "remove", "claude", "--local"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

    assert.match(skipped, /Skipped modified file: commands[/\\]fec-init\.md/);
    assert.match(fs.readFileSync(commandPath, "utf8"), /USER CUSTOMIZATION/);

    const forced = execFileSync(
      process.execPath,
      [cli, "uninstall", "claude", "--local", "--force"],
      {
        cwd: dir,
        encoding: "utf8",
        env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
      },
    );

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

    const manifestPath = path.join(
      dir,
      ".codex",
      "frontend-craft.manifest.json",
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      files?: Array<{ path: string; root?: string }>;
    };
    assert.ok(
      manifest.files?.some(
        (file) =>
          file.root === "cwd" &&
          file.path === ".agents/skills/fec-react-project-standard/SKILL.md",
      ),
    );

    execFileSync(process.execPath, [cli, "uninstall", "codex", "--local"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });

    assert.ok(
      !fs.existsSync(
        path.join(
          dir,
          ".agents",
          "skills",
          "fec-react-project-standard",
          "SKILL.md",
        ),
      ),
    );
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

function makeClaudeMarketplaceHome(currentVersion: string): string {
  const claudeHome = fs.mkdtempSync(
    path.join(os.tmpdir(), "fc-claude-marketplace-"),
  );
  const installPath = path.join(
    claudeHome,
    "plugins",
    "cache",
    "frontend-craft",
    "frontend-craft",
    currentVersion,
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
              version: currentVersion,
            },
          ],
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  return claudeHome;
}

function listMjsFiles(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mjs"))
    .map((entry) => entry.name)
    .sort();
}
