import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { InstallContext } from "../../src/install/types.js";
import { INSTALLERS } from "../../src/install/registry.js";
import {
  getInstallBaseDir,
  getGlobalConfigDir,
} from "../../src/install/runtime-homes.js";
import { agentMdToToml } from "../../src/install/codex-agents.js";
import { initFrontendCraftWorkspace } from "../../src/openclaw/init-workspace.js";
import {
  beginManifestSession,
  endManifestSession,
  readInstallManifest,
  writeUtf8,
} from "../../src/install/shared/fs.js";
import {
  uninstallManagedInstall,
  copyInstallToNewBase,
} from "../../src/install/manifest-installs.js";

function fixture(runtime: string, isGlobal = false) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-compat-"));
  const root = path.join(dir, "package with spaces");
  const cwd = path.join(dir, "project");
  const baseDir = isGlobal
    ? path.join(dir, "user-config")
    : getInstallBaseDir({ runtime, isGlobal, cwd });
  const put = (file: string, body: string) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  };
  fs.mkdirSync(cwd, { recursive: true });
  fs.mkdirSync(baseDir, { recursive: true });
  put(
    path.join(root, "skills/fec-example/SKILL.md"),
    "---\nname: fec-example\ndescription: Example skill\n---\nExample\n",
  );
  put(
    path.join(root, "commands/fec-init.md"),
    "---\nname: fec-init\ndescription: Initialize a project\nargument-hint: project\n---\nInitialize $ARGUMENTS\n",
  );
  put(
    path.join(root, "agents/fec-review.md"),
    "---\nname: fec-review\ndescription: Review\n---\nReview code\n",
  );
  put(
    path.join(root, "templates/shared/rules/fec-testing.md"),
    "Run the project tests.\n",
  );
  put(
    path.join(root, "templates/claude/CLAUDE.md"),
    "# Project\n@./rules/fec-testing.md\n",
  );
  put(
    path.join(root, "templates/claude/settings.json"),
    '{"permissions":{"allow":[]}}',
  );
  put(path.join(root, "templates/codex/config.toml"), "# Template\n");
  put(path.join(root, "templates/openclaw/AGENTS.md"), "# Workspace\n");
  put(
    path.join(root, "hooks/hooks.json"),
    JSON.stringify({
      hooks: {
        Stop: [
          {
            hooks: [
              {
                type: "command",
                command:
                  'node "${CLAUDE_PLUGIN_ROOT}/dist/hooks/fec-run-tests.js"',
              },
            ],
          },
        ],
      },
    }),
  );
  for (const name of [
    "fec-security-check.js",
    "fec-format-changed-file.js",
    "fec-run-tests.js",
    "fec-notify.js",
  ]) {
    put(path.join(root, "dist/hooks", name), "// hook\n");
  }
  const ctx: InstallContext = {
    pluginRoot: root,
    contentRoot: root,
    cwd,
    baseDir,
    runtime,
    isGlobal,
    dryRun: false,
    mode: "install",
    language: "en",
  };
  return {
    root,
    cwd,
    baseDir,
    ctx,
    put,
    read: (file: string) => fs.readFileSync(file, "utf8"),
    cleanup: () => fs.rmSync(dir, { recursive: true, force: true }),
  };
}

test("Codex installation preserves an existing user config", async () => {
  const f = fixture("codex");
  try {
    const dest = path.join(f.baseDir, "config.toml");
    f.put(
      dest,
      'model = "user-model"\n[mcp_servers.custom]\nurl = "https://example.com/mcp"\n',
    );
    const before = f.read(dest);
    await INSTALLERS.codex(f.ctx);
    assert.equal(f.read(dest), before);
  } finally {
    f.cleanup();
  }
});

test("Codex agents inherit the selected model and reasoning effort", () => {
  const toml = agentMdToToml(
    "---\nname: review\ndescription: Review\n---\nReview code",
    "review.md",
  );
  assert.doesNotMatch(toml, /^model\s*=|^model_reasoning_effort\s*=/m);
});

for (const runtime of ["claude", "qoder"]) {
  test(`${runtime} merges hooks into settings, preserving unrelated settings and avoiding duplicates`, async () => {
    const f = fixture(runtime, true);
    try {
      const dest = path.join(f.baseDir, "settings.json");
      const custom = {
        matcher: "custom",
        hooks: [{ type: "command", command: "echo custom" }],
      };
      f.put(
        dest,
        JSON.stringify({
          permissions: { allow: ["custom"] },
          hooks: { Stop: [custom] },
        }),
      );
      await INSTALLERS[runtime](f.ctx);
      await INSTALLERS[runtime](f.ctx);
      const settings = JSON.parse(f.read(dest));
      assert.deepEqual(settings.permissions, { allow: ["custom"] });
      assert.equal(settings.hooks.Stop.length, 2);
      assert.deepEqual(settings.hooks.Stop[0], custom);
      const command = settings.hooks.Stop[1].hooks[0].command as string;
      const match = /node "([^"]+)"/.exec(command);
      assert.ok(match);
      assert.ok(path.isAbsolute(match[1]));
      assert.ok(fs.existsSync(match[1]), `hook script resolves: ${match[1]}`);
    } finally {
      f.cleanup();
    }
  });
  test(`${runtime} refuses to overwrite malformed existing settings`, async () => {
    const f = fixture(runtime);
    try {
      const dest = path.join(f.baseDir, "settings.json");
      f.put(dest, "{broken");
      await assert.rejects(INSTALLERS[runtime](f.ctx), /settings|JSON/i);
      assert.equal(f.read(dest), "{broken");
    } finally {
      f.cleanup();
    }
  });
}

test("Qoder upgrades duplicate legacy global hook paths to one resolvable hook", async () => {
  const f = fixture("qoder", true);
  try {
    const dest = path.join(f.baseDir, "settings.json");
    const legacy = {
      matcher: ".*",
      hooks: [
        {
          type: "command",
          command: 'node ".qoder/hooks/fec-run-tests.js"',
          statusMessage: "Running final validation...",
        },
      ],
    };
    f.put(dest, JSON.stringify({ hooks: { Stop: [legacy, legacy] } }));
    await INSTALLERS.qoder(f.ctx);
    const entries = JSON.parse(f.read(dest)).hooks.Stop;
    assert.equal(entries.length, 1);
    assert.ok(!entries[0].hooks[0].command.includes('".qoder/'));
  } finally {
    f.cleanup();
  }
});

for (const isGlobal of [false, true]) {
  test(`Gemini discovers skills and context imports (${isGlobal ? "global" : "local"})`, async () => {
    const f = fixture("gemini", isGlobal);
    try {
      await INSTALLERS.gemini(f.ctx);
      assert.ok(
        fs.existsSync(path.join(f.baseDir, "skills/fec-example/SKILL.md")),
      );
      const context = path.join(isGlobal ? f.baseDir : f.cwd, "GEMINI.md");
      const imports = [...f.read(context).matchAll(/^@(.+)$/gm)];
      assert.ok(imports.length > 0);
      for (const entry of imports)
        assert.ok(
          fs.existsSync(path.resolve(path.dirname(context), entry[1].trim())),
        );
    } finally {
      f.cleanup();
    }
  });
  test(`Windsurf workflows use the discovery path (${isGlobal ? "global" : "local"})`, async () => {
    const f = fixture("windsurf", isGlobal);
    try {
      await INSTALLERS.windsurf(f.ctx);
      assert.ok(
        fs.existsSync(
          path.join(
            f.baseDir,
            isGlobal ? "global_workflows" : "workflows",
            "fec-init.md",
          ),
        ),
      );
    } finally {
      f.cleanup();
    }
  });
  test(`Trae installs explicitly activated rules (${isGlobal ? "global" : "local"})`, async () => {
    const f = fixture("trae", isGlobal);
    try {
      await INSTALLERS.trae(f.ctx);
      const rules = f.read(
        path.join(
          f.baseDir,
          isGlobal ? "user_rules" : "rules",
          "frontend-craft.md",
        ),
      );
      assert.match(rules, /^---\nalwaysApply: true\n---/);
    } finally {
      f.cleanup();
    }
  });
  test(`OpenClaw skills and commands have SKILL.md (${isGlobal ? "global" : "local"})`, async () => {
    const f = fixture("openclaw", isGlobal);
    try {
      await INSTALLERS.openclaw(f.ctx);
      const skills = path.join(isGlobal ? f.baseDir : f.cwd, "skills");
      assert.ok(fs.existsSync(path.join(skills, "fec-example/SKILL.md")));
      assert.match(
        f.read(path.join(skills, "fec-init/SKILL.md")),
        /^---\nname: fec-init\n/,
      );
      if (isGlobal) assert.ok(!fs.existsSync(path.join(f.cwd, "AGENTS.md")));
    } finally {
      f.cleanup();
    }
  });
}

test("Copilot project prompts have the required suffix and rules have applyTo", async () => {
  const f = fixture("copilot");
  try {
    await INSTALLERS.copilot(f.ctx);
    assert.match(
      f.read(path.join(f.baseDir, "prompts/fec-init.prompt.md")),
      /Initialize/,
    );
    assert.match(
      f.read(
        path.join(f.baseDir, "instructions/frontend-craft.instructions.md"),
      ),
      /^---\napplyTo: "\*\*"\n---/,
    );
  } finally {
    f.cleanup();
  }
});

test("Copilot global context is installed without claiming IDE global prompts", async () => {
  const f = fixture("copilot", true);
  try {
    await INSTALLERS.copilot(f.ctx);
    assert.match(
      f.read(path.join(f.baseDir, "copilot-instructions.md")),
      /Run the project tests/,
    );
    assert.ok(!fs.existsSync(path.join(f.baseDir, "prompts")));
  } finally {
    f.cleanup();
  }
});

test("OpenCode emits schema-compatible permissions and canonical commands", async () => {
  const f = fixture("opencode");
  try {
    await INSTALLERS.opencode(f.ctx);
    const config = JSON.parse(f.read(path.join(f.baseDir, "opencode.jsonc")));
    assert.ok(!("permissions" in config));
    assert.ok(fs.existsSync(path.join(f.baseDir, "commands/fec-init.md")));
  } finally {
    f.cleanup();
  }
});

test("OpenCode upgrades the exact legacy template without changing user config", async () => {
  const f = fixture("opencode");
  try {
    const dest = path.join(f.baseDir, "opencode.jsonc");
    f.put(
      dest,
      JSON.stringify({
        $schema: "https://opencode.ai/config.json",
        permissions: { bash: "allow" },
      }),
    );
    await INSTALLERS.opencode(f.ctx);
    assert.ok(!("permissions" in JSON.parse(f.read(dest))));
    const custom = '{"permission":{"bash":"ask"},"model":"custom"}';
    f.put(dest, custom);
    await INSTALLERS.opencode(f.ctx);
    assert.equal(f.read(dest), custom);
  } finally {
    f.cleanup();
  }
});

test("OpenCode update retires unchanged legacy commands but preserves user edits", async () => {
  const f = fixture("opencode");
  try {
    const legacy = path.join(f.baseDir, "command/fec-init.md");
    const custom = path.join(f.baseDir, "command/custom.md");
    beginManifestSession({ ...f.ctx, packageVersion: "2.9.0" });
    writeUtf8(legacy, "old command");
    writeUtf8(custom, "original");
    endManifestSession();
    f.put(custom, "user edit");
    f.ctx.mode = "update";
    beginManifestSession({ ...f.ctx, packageVersion: "2.9.0" });
    await INSTALLERS.opencode(f.ctx);
    endManifestSession();
    assert.ok(!fs.existsSync(legacy));
    assert.equal(f.read(custom), "user edit");
    assert.ok(
      readInstallManifest(
        path.join(f.baseDir, "frontend-craft.manifest.json"),
      )?.files.some((file) => file.path === "command/custom.md"),
    );
  } finally {
    f.cleanup();
  }
});

for (const runtime of ["claude", "qoder"]) {
  test(`${runtime} uninstall removes its hook entries but retains user settings`, async () => {
    const f = fixture(runtime);
    try {
      const dest = path.join(f.baseDir, "settings.json");
      const before = {
        permissions: { allow: ["custom"] },
        hooks: {
          Stop: [{ hooks: [{ type: "command", command: "echo custom" }] }],
        },
      };
      f.put(dest, JSON.stringify(before));
      beginManifestSession({ ...f.ctx, packageVersion: "2.9.0" });
      await INSTALLERS[runtime](f.ctx);
      endManifestSession();
      const manifestPath = path.join(f.baseDir, "frontend-craft.manifest.json");
      const manifest = readInstallManifest(manifestPath)!;
      uninstallManagedInstall({
        install: {
          runtime,
          scope: "local",
          baseDir: f.baseDir,
          manifestPath,
          manifest,
        },
        cwd: f.cwd,
        dryRun: false,
        force: false,
      });
      assert.deepEqual(JSON.parse(f.read(dest)), before);
    } finally {
      f.cleanup();
    }
  });
}

test("Cline coexists with an existing modern rules directory", async () => {
  const f = fixture("cline");
  try {
    f.put(path.join(f.cwd, ".clinerules/custom.md"), "User rule\n");
    await INSTALLERS.cline(f.ctx);
    assert.equal(
      f.read(path.join(f.cwd, ".clinerules/custom.md")),
      "User rule\n",
    );
    assert.match(
      f.read(path.join(f.cwd, ".clinerules/frontend-craft.md")),
      /Run the project tests/,
    );
  } finally {
    f.cleanup();
  }
});

test("Cline migrates a legacy rules file without losing user content", async () => {
  const f = fixture("cline");
  try {
    f.put(path.join(f.cwd, ".clinerules"), "User rule\n");
    await INSTALLERS.cline(f.ctx);
    assert.equal(
      f.read(path.join(f.cwd, ".clinerules/legacy.md")),
      "User rule\n",
    );
    assert.equal(
      f.read(path.join(f.cwd, ".clinerules.frontend-craft-backup")),
      "User rule\n",
    );
    assert.match(
      f.read(path.join(f.cwd, ".clinerules/frontend-craft.md")),
      /Run the project tests/,
    );
  } finally {
    f.cleanup();
  }
});

test("Cline global rules are installed into the configured rules directory", async () => {
  const f = fixture("cline", true);
  try {
    await INSTALLERS.cline(f.ctx);
    assert.match(
      f.read(path.join(f.baseDir, "Rules/frontend-craft.md")),
      /Run the project tests/,
    );
  } finally {
    f.cleanup();
  }
});

test("OpenClaw workspace initialization emits a discoverable rules skill", () => {
  const f = fixture("openclaw");
  try {
    const result = initFrontendCraftWorkspace(f.root, f.cwd, {});
    assert.ok(result.ok);
    assert.match(
      f.read(path.join(f.cwd, "skills/frontend-craft-rules/SKILL.md")),
      /^---\nname: frontend-craft-rules\n/,
    );
  } finally {
    f.cleanup();
  }
});

test("Antigravity defaults to the current IDE global skills base", () => {
  const previous = process.env.ANTIGRAVITY_CONFIG_DIR;
  delete process.env.ANTIGRAVITY_CONFIG_DIR;
  try {
    assert.equal(
      getGlobalConfigDir("antigravity"),
      path.join(os.homedir(), ".gemini/config"),
    );
  } finally {
    if (previous !== undefined) process.env.ANTIGRAVITY_CONFIG_DIR = previous;
  }
});

test("global directory migration carries edited skills with their original ownership hashes", () => {
  const f = fixture("antigravity", true);
  try {
    const source = path.join(f.baseDir, "old");
    const target = path.join(f.baseDir, "new");
    const file = "skills/fec-example/SKILL.md";
    beginManifestSession({
      ...f.ctx,
      baseDir: source,
      packageVersion: "2.9.0",
    });
    writeUtf8(path.join(source, file), "original");
    endManifestSession();
    f.put(path.join(source, file), "user edit");
    const manifestPath = path.join(source, "frontend-craft.manifest.json");
    const manifest = readInstallManifest(manifestPath)!;
    copyInstallToNewBase(
      {
        runtime: "antigravity",
        scope: "global",
        baseDir: source,
        manifestPath,
        manifest,
      },
      target,
      false,
    );
    assert.equal(f.read(path.join(target, file)), "user edit");
    assert.deepEqual(
      readInstallManifest(path.join(target, "frontend-craft.manifest.json"))
        ?.files,
      manifest.files,
    );
    assert.equal(f.read(path.join(source, file)), "user edit");
  } finally {
    f.cleanup();
  }
});

test("OpenClaw respects its official state directory environment variable", () => {
  const previous = process.env.OPENCLAW_STATE_DIR;
  process.env.OPENCLAW_STATE_DIR = path.join(os.tmpdir(), "fec-official-state");
  try {
    assert.equal(
      getGlobalConfigDir("openclaw"),
      process.env.OPENCLAW_STATE_DIR,
    );
  } finally {
    if (previous === undefined) delete process.env.OPENCLAW_STATE_DIR;
    else process.env.OPENCLAW_STATE_DIR = previous;
  }
});

test("OpenClaw preserves full same-name skills and quotes command descriptions", async () => {
  const f = fixture("openclaw");
  try {
    f.put(
      path.join(f.root, "commands/fec-example.md"),
      "---\ndescription: Short command\n---\nShort\n",
    );
    f.put(
      path.join(f.root, "commands/fec-colon.md"),
      '---\nname: fec-colon\ndescription: "Debug: inspect errors"\n---\nDebug\n',
    );
    await INSTALLERS.openclaw(f.ctx);
    assert.match(
      f.read(path.join(f.cwd, "skills/fec-example/SKILL.md")),
      /Example skill/,
    );
    assert.match(
      f.read(path.join(f.cwd, "skills/fec-colon/SKILL.md")),
      /description: "Debug: inspect errors"/,
    );
  } finally {
    f.cleanup();
  }
});

for (const runtime of ["gemini", "openclaw"]) {
  test(`${runtime} retires only unchanged owned legacy skills`, async () => {
    const f = fixture(runtime);
    try {
      const oldRoot =
        runtime === "gemini"
          ? path.join(f.baseDir, "extensions/frontend-craft/skills")
          : path.join(f.baseDir, "skills");
      const generated = path.join(oldRoot, "fec-example/SKILL.md");
      const edited = path.join(oldRoot, "custom/SKILL.md");
      beginManifestSession({ ...f.ctx, packageVersion: "2.9.0" });
      writeUtf8(generated, "generated");
      writeUtf8(edited, "original");
      endManifestSession();
      f.put(edited, "user edit");
      f.ctx.mode = "update";
      beginManifestSession({ ...f.ctx, packageVersion: "2.9.0" });
      await INSTALLERS[runtime](f.ctx);
      endManifestSession();
      assert.ok(!fs.existsSync(generated));
      assert.equal(f.read(edited), "user edit");
      const newRoot = runtime === "gemini" ? f.baseDir : f.cwd;
      assert.ok(
        fs.existsSync(path.join(newRoot, "skills/fec-example/SKILL.md")),
      );
    } finally {
      f.cleanup();
    }
  });
}
