import test from "node:test";
import assert from "node:assert/strict";
import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

test("published CLI installs parsed content without repository node_modules", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-published-"));
  try {
    const packageRoot = path.join(temp, "package");
    const packed = JSON.parse(
      execSync("npm pack --dry-run --json --ignore-scripts", {
        cwd: root,
        encoding: "utf8",
      }),
    ) as Array<{ files: Array<{ path: string }> }>;
    for (const file of packed[0].files) {
      const dest = path.join(packageRoot, file.path);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(root, file.path), dest);
    }
    assert.equal(fs.existsSync(path.join(packageRoot, "node_modules")), false);
    const home = path.join(temp, "home");
    fs.mkdirSync(home);
    for (const runtime of ["codex", "openclaw"]) {
      const project = path.join(temp, runtime);
      fs.mkdirSync(project);
      const result = spawnSync(
        process.execPath,
        [
          path.join(packageRoot, "dist/bin/frontend-craft.js"),
          "install",
          runtime,
          "--local",
        ],
        {
          cwd: project,
          encoding: "utf8",
          env: {
            ...process.env,
            HOME: home,
            USERPROFILE: home,
            CODEX_HOME: path.join(home, ".codex"),
            OPENCLAW_STATE_DIR: path.join(home, ".openclaw"),
          },
        },
      );
      assert.equal(result.status, 0, result.stderr || result.stdout);
      if (runtime === "codex") {
        const toml = fs.readFileSync(
          path.join(project, ".codex/agents/fec-debugger.toml"),
          "utf8",
        );
        assert.match(
          toml,
          /description = "Front-end diagnostic and repair subagent:/,
        );
      } else {
        const skill = fs.readFileSync(
          path.join(project, "skills/fec-debug/SKILL.md"),
          "utf8",
        );
        assert.match(
          skill,
          /description: "Front-end problem diagnosis and repair:/,
        );
        assert.ok(!skill.includes('description: "\\"'));
      }
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test("npm pack publishes compiled runtime files without TypeScript sources", () => {
  const output = execSync("npm pack --dry-run --json --ignore-scripts", {
    cwd: root,
    encoding: "utf8",
  });
  const pack = JSON.parse(output) as Array<{ files: Array<{ path: string }> }>;
  const files = pack[0]?.files.map((file) => file.path).sort() ?? [];

  assert.ok(files.includes("dist/bin/frontend-craft.js"));
  assert.ok(
    !files.some((file) => file.startsWith("dist/src/")),
    "npm package should not publish dist/src",
  );
  assert.ok(
    !files.some((file) => file.startsWith("dist/scripts/")),
    "npm package should not publish dist/scripts",
  );
  assert.ok(files.includes("skills/metadata.json"));
  assert.ok(files.includes("localized/zh-CN/commands/fec-init.md"));
  assert.ok(
    files.includes(
      "localized/zh-CN/skills/fec-react-project-standard/SKILL.md",
    ),
  );

  const leakedSources = files.filter((file) =>
    /^(bin|src|scripts)\/.*\.ts$/.test(file),
  );
  assert.deepEqual(leakedSources, []);

  const hookRuntimes = [
    "fec-cleanup-claude-cache.js",
    "fec-format-changed-file.js",
    "fec-notify.js",
    "fec-run-tests.js",
    "fec-security-check.js",
    "fec-session-start.js",
  ];
  for (const hookRuntime of hookRuntimes) {
    assert.ok(
      files.includes(`dist/hooks/${hookRuntime}`),
      `npm package should publish dist/hooks/${hookRuntime}`,
    );
    assert.ok(
      !files.includes(`dist/scripts/${hookRuntime}`),
      `runtime hook should not be published in dist/scripts`,
    );
  }
  for (const unprefixedHookRuntime of hookRuntimes.map((hookRuntime) =>
    hookRuntime.replace(/^fec-/, ""),
  )) {
    assert.ok(
      !files.includes(`dist/hooks/${unprefixedHookRuntime}`),
      `npm package should not publish unprefixed dist/hooks/${unprefixedHookRuntime}`,
    );
  }

  const staleCompiledFiles = files
    .filter((file) => /^dist\/(bin|src|scripts|hooks)\/.*\.js$/.test(file))
    .filter((file) => {
      const sourcePath = file.startsWith("dist/hooks/")
        ? file
            .replace(/^dist\/hooks\/fec-/, "src/hooks/")
            .replace(/\.js$/, ".ts")
        : file.replace(/^dist\//, "").replace(/\.js$/, ".ts");
      return !fs.existsSync(path.join(root, sourcePath));
    });
  assert.deepEqual(staleCompiledFiles, []);
});

test("package exposes frontend-craft and fec bin commands", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  ) as {
    bin?: Record<string, string>;
  };

  assert.equal(pkg.bin?.["frontend-craft"], "dist/bin/frontend-craft.js");
  assert.equal(pkg.bin?.fec, "dist/bin/frontend-craft.js");
});

test("build output only contains bundled publish runtime directories", () => {
  assert.ok(
    !fs.existsSync(path.join(root, "dist", "src")),
    "build should not emit dist/src",
  );
  assert.ok(
    !fs.existsSync(path.join(root, "dist", "tests")),
    "build should not emit dist/tests",
  );
  assert.ok(
    fs.existsSync(path.join(root, "dist", "bin", "frontend-craft.js")),
    "build should emit bundled CLI",
  );
  assert.ok(
    fs.existsSync(path.join(root, "dist", "hooks", "fec-security-check.js")),
    "build should emit bundled hooks",
  );
  assert.ok(
    !fs.existsSync(path.join(root, "dist", "scripts")),
    "build should not emit maintenance scripts",
  );
});

test("OpenClaw dist check does not clean the bundle it verifies", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  );
  assert.equal(
    pkg.scripts["check:openclaw-dist"],
    "tsx scripts/openclaw/verify-openclaw-dist.ts",
  );
});

test("build minifies compiled JavaScript while preserving CLI shebang", () => {
  const cliRuntime = fs.readFileSync(
    path.join(root, "dist", "bin", "frontend-craft.js"),
    "utf8",
  );

  assert.ok(
    !cliRuntime.includes("function printHelp"),
    "dist/bin/frontend-craft.js should minify local names",
  );
  assert.ok(
    !cliRuntime.includes("../src/install/cli.js"),
    "CLI should be bundled instead of importing dist/src",
  );
  assert.ok(
    cliRuntime.startsWith("#!/usr/bin/env node\n"),
    "bin shebang should stay intact",
  );
  assert.equal(
    cliRuntime.match(/^#!\/usr\/bin\/env node$/gm)?.length,
    1,
    "bin should include one shebang",
  );
});
