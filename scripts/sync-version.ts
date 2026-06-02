#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

interface PackageJson {
  version: string;
}

interface ClaudePluginManifest {
  version: string;
}

interface MarketplacePlugin {
  version: string;
  source?: unknown;
}

interface MarketplaceNpmSource {
  source: "npm";
  package: string;
  version: string;
}

interface MarketplaceManifest {
  plugins: [MarketplacePlugin, ...MarketplacePlugin[]];
}

interface OpenClawManifest {
  version: string;
}

interface SkillMetadataEntry {
  version: string;
}

const root = resolveRoot(process.argv.slice(2));
const packageJson = readPackageJson(path.join(root, "package.json"));
const version = packageJson.version;

syncJson<ClaudePluginManifest>(path.join(root, ".claude-plugin", "plugin.json"), 4, isVersionedObject, (plugin) => {
  plugin.version = version;
});

syncJson<MarketplaceManifest>(
  path.join(root, ".claude-plugin", "marketplace.json"),
  4,
  isMarketplaceManifest,
  (marketplace) => {
    marketplace.plugins[0].version = version;
    if (isMarketplaceNpmSource(marketplace.plugins[0].source)) {
      marketplace.plugins[0].source.version = version;
    }
  },
);

syncJson<OpenClawManifest>(path.join(root, "openclaw.plugin.json"), 4, isVersionedObject, (openclaw) => {
  openclaw.version = version;
});

syncJson<SkillMetadataEntry[]>(path.join(root, "skills", "metadata.json"), 2, isSkillMetadata, (skills) => {
  for (const skill of skills) skill.version = version;
});

console.log(`[sync-version] public metadata now follows package.json version ${version}`);

function resolveRoot(args: string[]): string {
  const rootFlagIndex = args.indexOf("--root");
  if (rootFlagIndex === -1) return process.cwd();

  const rootValue = args[rootFlagIndex + 1];
  if (typeof rootValue !== "string" || rootValue.length === 0) {
    throw new Error("--root requires a directory");
  }

  return path.resolve(rootValue);
}

function readPackageJson(file: string): PackageJson {
  const value = readJson(file);
  if (!isObject(value) || typeof value.version !== "string" || value.version.length === 0) {
    throw new Error("package.json must include a non-empty version");
  }

  return { version: value.version };
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
}

function syncJson<T>(
  file: string,
  spaces: number,
  isExpectedShape: (value: unknown) => value is T,
  mutate: (value: T) => void,
): void {
  const value = readJson(file);
  if (!isExpectedShape(value)) {
    throw new Error(`${path.relative(root, file)} has an unsupported JSON shape`);
  }

  mutate(value);
  fs.writeFileSync(file, `${JSON.stringify(value, null, spaces)}\n`, "utf8");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isVersionedObject(value: unknown): value is ClaudePluginManifest | OpenClawManifest {
  return isObject(value) && typeof value.version === "string";
}

function isMarketplaceManifest(value: unknown): value is MarketplaceManifest {
  if (!isObject(value) || !Array.isArray(value.plugins) || value.plugins.length === 0) {
    return false;
  }

  return value.plugins.every(isVersionedObject);
}

function isMarketplaceNpmSource(value: unknown): value is MarketplaceNpmSource {
  return (
    isObject(value) &&
    value.source === "npm" &&
    typeof value.package === "string" &&
    typeof value.version === "string"
  );
}

function isSkillMetadata(value: unknown): value is SkillMetadataEntry[] {
  return Array.isArray(value) && value.every(isVersionedObject);
}
