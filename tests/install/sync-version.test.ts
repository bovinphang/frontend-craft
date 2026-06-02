import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

interface VersionedObject {
  version: string;
}

interface MarketplaceFixture {
  plugins: [
    VersionedObject & {
      source?: {
        source?: string;
        package?: string;
        version?: string;
      };
    },
    ...VersionedObject[],
  ];
}

interface SkillFixture extends VersionedObject {
  id?: string;
}

test("sync-version updates public metadata from package.json", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "frontend-craft-sync-version-"));
  try {
    copyFixture("package.json", tempRoot);
    copyFixture("openclaw.plugin.json", tempRoot);
    fs.mkdirSync(path.join(tempRoot, ".claude-plugin"), { recursive: true });
    fs.mkdirSync(path.join(tempRoot, "skills"), { recursive: true });
    copyFixture(path.join(".claude-plugin", "plugin.json"), tempRoot);
    copyFixture(path.join(".claude-plugin", "marketplace.json"), tempRoot);
    copyFixture(path.join("skills", "metadata.json"), tempRoot);

    const nextVersion = "9.8.7";
    updateJson(path.join(tempRoot, "package.json"), assertVersionedObject, (pkg) => {
      pkg.version = nextVersion;
    });
    updateJson(path.join(tempRoot, ".claude-plugin", "plugin.json"), assertVersionedObject, (plugin) => {
      plugin.version = "0.0.0";
    });
    updateJson(path.join(tempRoot, ".claude-plugin", "marketplace.json"), assertMarketplaceFixture, (marketplace) => {
      marketplace.plugins[0].version = "0.0.0";
      if (marketplace.plugins[0].source?.source === "npm") {
        marketplace.plugins[0].source.version = "0.0.0";
      }
    });
    updateJson(path.join(tempRoot, "openclaw.plugin.json"), assertVersionedObject, (openclaw) => {
      openclaw.version = "0.0.0";
    });
    updateJson(path.join(tempRoot, "skills", "metadata.json"), assertSkillMetadataFixture, (skills) => {
      for (const skill of skills) skill.version = "0.0.0";
    });

    execFileSync(
      process.execPath,
      [path.join(root, "node_modules", "tsx", "dist", "cli.mjs"), path.join(root, "scripts", "sync-version.ts"), "--root", tempRoot],
      { encoding: "utf8" },
    );

    const plugin = readJson(path.join(tempRoot, ".claude-plugin", "plugin.json"));
    const marketplace = readJson(path.join(tempRoot, ".claude-plugin", "marketplace.json"));
    const openclaw = readJson(path.join(tempRoot, "openclaw.plugin.json"));
    const skills = readJson(path.join(tempRoot, "skills", "metadata.json"));
    assertVersionedObject(plugin);
    assertMarketplaceFixture(marketplace);
    assertVersionedObject(openclaw);
    assertSkillMetadataFixture(skills);

    assert.equal(plugin.version, nextVersion);
    assert.equal(marketplace.plugins[0].version, nextVersion);
    assert.deepEqual(marketplace.plugins[0].source, {
      source: "npm",
      package: "@bovinphang/frontend-craft",
      version: nextVersion,
    });
    assert.equal(openclaw.version, nextVersion);
    for (const skill of skills) assert.equal(skill.version, nextVersion, skill.id);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

function copyFixture(relativePath: string, tempRoot: string): void {
  const source = path.join(root, relativePath);
  const dest = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
}

function updateJson<T>(file: string, assertShape: (value: unknown) => asserts value is T, mutate: (value: T) => void): void {
  const value = readJson(file);
  assertShape(value);
  mutate(value);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function assertVersionedObject(value: unknown): asserts value is VersionedObject {
  assert.ok(isObject(value), "expected an object");
  assert.equal(typeof value.version, "string");
}

function assertMarketplaceFixture(value: unknown): asserts value is MarketplaceFixture {
  assert.ok(isObject(value), "expected marketplace to be an object");
  assert.ok(Array.isArray(value.plugins), "expected marketplace plugins to be an array");
  assert.ok(value.plugins.length > 0, "expected marketplace to include at least one plugin");
  for (const plugin of value.plugins) assertVersionedObject(plugin);
}

function assertSkillMetadataFixture(value: unknown): asserts value is SkillFixture[] {
  assert.ok(Array.isArray(value), "expected skills metadata to be an array");
  for (const skill of value) assertVersionedObject(skill);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
