import path from "node:path";
import {
  runProductLifecycle,
  resolveSharedIdentity,
  currentProductHash,
  type SharedRequest,
  type ProductInstallationSeed,
} from "@bovinphang/craft-common";
import type { InstallContext } from "../types.js";
import { PRODUCT_DEFINITION, toProductContext } from "../product-definition.js";
import { MANIFEST_CODEC, resolveOwnedReference } from "../manifest-codec.js";
import { getRuntimeSkillsTarget } from "../runtime-skill-targets.js";
import { readProductCommonCatalog } from "./common-content.js";
import { getManifestPath, type InstallManifest } from "./fs.js";
import { inspectLegacyCommonInstall } from "../migration.js";
import {
  pruneEmptyDirs,
  type UninstallOptions,
  type UninstallResult,
} from "../manifest-installs.js";
export interface FrontendInstallationSeed extends ProductInstallationSeed {
  legacyManifest?: InstallManifest;
}
export type BeforeManifest = (
  dryRun?: boolean,
) => FrontendInstallationSeed | void;
export function commonRequest(ctx: InstallContext): SharedRequest | undefined {
  const skillsDir = getRuntimeSkillsTarget(ctx);
  if (!skillsDir) return;
  return {
    action: ctx.mode,
    skillsDir,
    consumer: {
      product: PRODUCT_DEFINITION.consumerProduct,
      manifestPath: getManifestPath(ctx.baseDir),
      scope: ctx.isGlobal ? "global" : "local",
    },
    catalog: readProductCommonCatalog(ctx.pluginRoot, ctx.language),
  };
}
function configurationFiles(ctx: InstallContext): string[] {
  if (ctx.runtime === "qoder") return [path.join(ctx.baseDir, "settings.json")];
  if (ctx.runtime === "claude")
    return [
      path.join(ctx.baseDir, "settings.json"),
      path.join(ctx.baseDir, "CLAUDE.md"),
    ];
  if (ctx.runtime === "codex")
    return [
      path.join(ctx.baseDir, "config.toml"),
      path.join(ctx.isGlobal ? ctx.baseDir : ctx.cwd, "AGENTS.md"),
    ];
  if (ctx.runtime === "gemini")
    return [path.join(ctx.isGlobal ? ctx.baseDir : ctx.cwd, "GEMINI.md")];
  if (ctx.runtime === "copilot" && ctx.isGlobal)
    return [path.join(ctx.baseDir, "copilot-instructions.md")];
  if (ctx.runtime === "opencode")
    return [path.join(ctx.baseDir, "opencode.jsonc")];
  return [];
}
export async function runCommonAwareInstall(
  ctx: InstallContext,
  installProduct: (planning: InstallContext) => Promise<void>,
  beforeManifest?: BeforeManifest,
): Promise<void> {
  const seed = beforeManifest?.(ctx.dryRun) || undefined;
  const request = commonRequest(ctx);
  const preflightLegacy = () => {
    const legacy = request
      ? inspectLegacyCommonInstall({
          cwd: ctx.cwd,
          baseDir: ctx.baseDir,
          skillsDir: request.skillsDir,
          manifest: seed?.legacyManifest,
          pending: seed?.mutations,
        })
      : { findings: [], retiredFiles: [] };
    const conflicts = legacy.findings.filter(
      (item) => item.kind === "conflict",
    );
    if (conflicts.length)
      throw new Error(
        conflicts.map((item) => item.file + ": " + item.message).join("\n"),
      );
    return legacy;
  };
  preflightLegacy();
  const result = await runProductLifecycle({
    action: ctx.mode,
    definition: PRODUCT_DEFINITION,
    context: toProductContext(ctx),
    codec: MANIFEST_CODEC,
    ...(request ? { common: request } : {}),
    ...(seed ? { seed } : {}),
    adapter: {
      configurationFiles: () => configurationFiles(ctx),
      plan: async (_context, session) => {
        const legacy = preflightLegacy();
        for (const file of legacy.retiredFiles) session.retireTree(file);
        await installProduct({ ...ctx, session });
      },
    },
  });
  if (ctx.dryRun)
    (ctx.log ?? console.log)(
      `[dry-run] ${ctx.runtime}: ${ctx.baseDir}, ${result.changed.length} planned file changes`,
    );
  for (const file of result.preserved)
    (ctx.log ?? console.log)(
      "Skipped modified file: " + path.relative(ctx.baseDir, file),
    );
}
export async function uninstallCommonAwareInstall(
  options: UninstallOptions,
): Promise<UninstallResult> {
  const { install, cwd, dryRun, force } = options;
  const ctx: InstallContext = {
    log: options.log,
    pluginRoot: "",
    contentRoot: "",
    cwd,
    baseDir: install.baseDir,
    runtime: install.runtime,
    isGlobal: install.scope === "global",
    dryRun,
    mode: "update",
    language: install.manifest.language ?? "en",
  };
  const context = toProductContext(ctx),
    state = MANIFEST_CODEC.decode(
      Buffer.from(JSON.stringify(install.manifest)),
      context,
    );
  const target = install.manifest.common
    ? getRuntimeSkillsTarget(ctx)
    : undefined;
  if (install.manifest.common) {
    if (!target)
      throw new Error("安装清单声明了当前 Runtime 不支持的公共 Skill 依赖");
    const identity = resolveSharedIdentity(target);
    if (
      identity.target !== install.manifest.common.target ||
      identity.ledgerDir !== install.manifest.common.ledgerDir
    )
      throw new Error("公共依赖指针不匹配当前 Runtime 的真实目标，保留安装");
  }
  const missing: string[] = [],
    removed: Array<{ path: string; modified: boolean }> = [],
    skipped: string[] = [];
  for (const owned of install.manifest.files) {
    const file = resolveOwnedReference(
      context,
      owned.root ?? "baseDir",
      owned.path,
    );
    if (!state.files.some((entry) => entry.path === file)) continue;
    const current = currentProductHash(file);
    if (current === null) missing.push(owned.path);
    else if (current !== owned.hash && !force) skipped.push(owned.path);
    else removed.push({ path: owned.path, modified: current !== owned.hash });
  }
  const result = await runProductLifecycle({
    action: "uninstall",
    definition: PRODUCT_DEFINITION,
    context,
    codec: MANIFEST_CODEC,
    forceOwnedRemoval: force,
    ...(target
      ? {
          common: {
            action: "uninstall",
            skillsDir: target,
            consumer: {
              product: PRODUCT_DEFINITION.consumerProduct,
              manifestPath: install.manifestPath,
              scope: install.scope,
            },
          },
        }
      : {}),
    adapter: {
      configurationFiles: () => configurationFiles(ctx),
      async plan() {},
    },
  });
  for (const file of result.preserved) {
    if (
      !skipped.some(
        (relative) =>
          resolveOwnedReference(
            context,
            install.manifest.files.find((entry) => entry.path === relative)
              ?.root ?? "baseDir",
            relative,
          ) === file,
      )
    )
      skipped.push(path.relative(ctx.baseDir, file).split(path.sep).join("/"));
  }
  if (!dryRun)
    pruneEmptyDirs(
      removed.map((owned) =>
        path.dirname(
          resolveOwnedReference(
            context,
            install.manifest.files.find((file) => file.path === owned.path)
              ?.root ?? "baseDir",
            owned.path,
          ),
        ),
      ),
      context.allowedRoots,
    );
  if (dryRun)
    (ctx.log ?? console.log)(
      `[dry-run] ${ctx.runtime}: ${result.changed.length} planned file changes`,
    );
  return { removed, skipped, missing };
}
