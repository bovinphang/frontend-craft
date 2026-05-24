import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  cleanupClaudeFrontendCraftCache,
  getClaudeFrontendCraftCacheReport,
} from "../../src/install/claude-cache.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "dist", "bin", "frontend-craft.js");

test("Claude cache report selects only stale frontend-craft native plugin versions", () => {
  const claudeHome = makeClaudeHome("2.3.1");
  try {
    makeCacheVersion(claudeHome, "1.2.0", { orphaned: true });
    makeCacheVersion(claudeHome, "2.0.1", { packageVersion: "2.0.1" });
    makeCacheVersion(claudeHome, "2.1.2", { missingDist: true, packageVersion: "2.1.2" });
    makeCacheVersion(claudeHome, "2.3.1", { packageVersion: "2.3.1" });
    fs.mkdirSync(path.join(claudeHome, "plugins", "cache", "other-market", "frontend-craft", "0.1.0"), {
      recursive: true,
    });

    const report = getClaudeFrontendCraftCacheReport({ claudeConfigDir: claudeHome, currentVersion: "2.3.1" });

    assert.deepEqual(
      report.entries.filter((entry) => entry.shouldDelete).map((entry) => entry.version).sort(),
      ["1.2.0", "2.0.1", "2.1.2"],
    );
    assert.equal(report.entries.find((entry) => entry.version === "2.3.1")?.shouldDelete, false);
    assert.ok(report.entries.find((entry) => entry.version === "2.1.2")?.reasons.includes("missing dist"));
    assert.ok(report.entries.find((entry) => entry.version === "1.2.0")?.reasons.includes("orphaned"));
  } finally {
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("Claude cache cleanup preserves the current installed version and removes stale versions", () => {
  const claudeHome = makeClaudeHome("2.3.1");
  try {
    makeCacheVersion(claudeHome, "2.1.2", { missingDist: true, packageVersion: "2.1.2" });
    makeCacheVersion(claudeHome, "2.3.1", { packageVersion: "2.3.1" });

    const dryRun = cleanupClaudeFrontendCraftCache({
      claudeConfigDir: claudeHome,
      currentVersion: "2.3.1",
      dryRun: true,
    });
    assert.equal(dryRun.deleted.length, 0);
    assert.ok(fs.existsSync(cacheVersionPath(claudeHome, "2.1.2")));

    const result = cleanupClaudeFrontendCraftCache({ claudeConfigDir: claudeHome, currentVersion: "2.3.1" });
    assert.deepEqual(result.deleted.map((entry) => entry.version), ["2.1.2"]);
    assert.ok(!fs.existsSync(cacheVersionPath(claudeHome, "2.1.2")));
    assert.ok(fs.existsSync(cacheVersionPath(claudeHome, "2.3.1")));
  } finally {
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("Claude cache report is read-only when installed plugin metadata is missing or invalid", () => {
  const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-claude-cache-invalid-"));
  try {
    makeCacheVersion(claudeHome, "2.1.2", { missingDist: true, packageVersion: "2.1.2" });
    fs.mkdirSync(path.join(claudeHome, "plugins"), { recursive: true });
    fs.writeFileSync(path.join(claudeHome, "plugins", "installed_plugins.json"), "{not json", "utf8");

    const report = getClaudeFrontendCraftCacheReport({ claudeConfigDir: claudeHome, currentVersion: "2.3.1" });

    assert.equal(report.canDelete, false);
    assert.match(report.warning ?? "", /installed_plugins\.json/);
    assert.equal(report.entries[0]?.shouldDelete, false);
  } finally {
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("doctor claude --fix-cache previews and removes stale native plugin cache versions", () => {
  const claudeHome = makeClaudeHome("2.3.1");
  try {
    makeCacheVersion(claudeHome, "2.1.2", { missingDist: true, packageVersion: "2.1.2" });
    makeCacheVersion(claudeHome, "2.3.1", { packageVersion: "2.3.1" });

    const report = execFileSync(process.execPath, [cli, "doctor", "claude"], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });
    assert.match(report, /native cache:/);
    assert.ok(fs.existsSync(cacheVersionPath(claudeHome, "2.1.2")));

    const dryRun = execFileSync(process.execPath, [cli, "doctor", "claude", "--fix-cache", "--dry-run"], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });
    assert.match(dryRun, /would delete 2\.1\.2/);
    assert.ok(fs.existsSync(cacheVersionPath(claudeHome, "2.1.2")));

    const fixed = execFileSync(process.execPath, [cli, "doctor", "claude", "--fix-cache"], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });
    assert.match(fixed, /deleted 2\.1\.2/);
    assert.ok(!fs.existsSync(cacheVersionPath(claudeHome, "2.1.2")));
    assert.ok(fs.existsSync(cacheVersionPath(claudeHome, "2.3.1")));
  } finally {
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("doctor claude reports native and CLI sources without deleting CLI manifests", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-cli-source-cwd-"));
  const claudeHome = makeClaudeHome("2.3.1");
  try {
    makeCacheVersion(claudeHome, "2.1.2", { missingDist: true, packageVersion: "2.1.2" });
    makeCacheVersion(claudeHome, "2.3.1", { packageVersion: "2.3.1" });
    fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
    const manifestPath = path.join(dir, ".claude", "frontend-craft.manifest.json");
    fs.writeFileSync(
      manifestPath,
      `${JSON.stringify({ packageVersion: "2.3.1", runtime: "claude", scope: "local", files: [] }, null, 2)}\n`,
      "utf8",
    );

    const fixed = execFileSync(process.execPath, [cli, "doctor", "claude", "--fix-cache"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    assert.match(fixed, /install sources:/);
    assert.match(fixed, /native plugin: 2\.3\.1/);
    assert.match(fixed, /local CLI: 2\.3\.1/);
    assert.match(fixed, /multiple active sources detected/);
    assert.ok(!fs.existsSync(cacheVersionPath(claudeHome, "2.1.2")));
    assert.ok(fs.existsSync(manifestPath));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

test("doctor claude reports local and global CLI sources when both manifests exist", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fc-cli-dual-cwd-"));
  const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-cli-dual-home-"));
  try {
    fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
    fs.mkdirSync(claudeHome, { recursive: true });
    fs.writeFileSync(
      path.join(dir, ".claude", "frontend-craft.manifest.json"),
      `${JSON.stringify({ packageVersion: "2.3.1", runtime: "claude", scope: "local", files: [] }, null, 2)}\n`,
      "utf8",
    );
    fs.writeFileSync(
      path.join(claudeHome, "frontend-craft.manifest.json"),
      `${JSON.stringify({ packageVersion: "2.2.0", runtime: "claude", scope: "global", files: [] }, null, 2)}\n`,
      "utf8",
    );

    const report = execFileSync(process.execPath, [cli, "doctor", "claude"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, CLAUDE_CONFIG_DIR: claudeHome },
    });

    assert.match(report, /install sources:/);
    assert.match(report, /local CLI: 2\.3\.1/);
    assert.match(report, /global CLI: 2\.2\.0/);
    assert.match(report, /multiple active sources detected/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(claudeHome, { recursive: true, force: true });
  }
});

function makeClaudeHome(currentVersion: string): string {
  const claudeHome = fs.mkdtempSync(path.join(os.tmpdir(), "fc-claude-cache-"));
  const installPath = cacheVersionPath(claudeHome, currentVersion);
  fs.mkdirSync(path.dirname(installPath), { recursive: true });
  fs.mkdirSync(path.join(claudeHome, "plugins"), { recursive: true });
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

function makeCacheVersion(
  claudeHome: string,
  version: string,
  opts: { orphaned?: boolean; missingDist?: boolean; packageVersion?: string } = {},
): void {
  const dir = cacheVersionPath(claudeHome, version);
  fs.mkdirSync(dir, { recursive: true });
  if (!opts.missingDist) fs.mkdirSync(path.join(dir, "dist"), { recursive: true });
  if (opts.orphaned) fs.writeFileSync(path.join(dir, ".orphaned_at"), new Date().toISOString(), "utf8");
  if (opts.packageVersion) {
    fs.writeFileSync(path.join(dir, "package.json"), `${JSON.stringify({ version: opts.packageVersion })}\n`, "utf8");
  }
}

function cacheVersionPath(claudeHome: string, version: string): string {
  return path.join(claudeHome, "plugins", "cache", "frontend-craft", "frontend-craft", version);
}
