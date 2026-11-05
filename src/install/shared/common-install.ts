import type { InstallContext } from "../types.js";
import fs from "node:fs";
import path from "node:path";
import {
  executeSharedPlan,
  recoverSharedTransaction,
  planSharedDeployment,
  resolveSharedIdentity,
  type SharedRequest,
} from "@bovinphang/craft-common";
import { getRuntimeSkillsTarget } from "../runtime-skill-targets.js";
import { readProductCommonCatalog } from "./common-content.js";
import {
  planProductMutations,
  productFileExists,
} from "./product-write-plan.js";
import {
  beginManifestSession,
  discardManifestSession,
  endManifestSession,
  getManifestPath,
  retireManagedFile,
  readInstallManifest,
} from "./fs.js";
import { inspectLegacyCommonInstall } from "../migration.js";
import {
  uninstallManagedInstall,
  type UninstallOptions,
  type UninstallResult,
} from "../manifest-installs.js";

export function commonRequest(ctx: InstallContext): SharedRequest | undefined {
  const skillsDir = getRuntimeSkillsTarget(ctx);
  if (!skillsDir) return undefined;
  return {
    action: ctx.mode,
    skillsDir,
    consumer: {
      product: "frontend-craft",
      manifestPath: getManifestPath(ctx.baseDir),
      scope: ctx.isGlobal ? "global" : "local",
    },
    catalog: readProductCommonCatalog(ctx.pluginRoot, ctx.language),
  };
}
export async function runCommonAwareInstall(
  ctx: InstallContext,
  installProduct: () => Promise<void>,
  beforeManifest?: (dryRun?: boolean) => void,
): Promise<void> {
  const request = commonRequest(ctx);
  const roots = [
    ctx.baseDir,
    ...(ctx.isGlobal ? [] : [ctx.cwd]),
    ...(request ? [request.skillsDir] : []),
  ];
  const assertIdentity = (): void => {
    const file = getManifestPath(ctx.baseDir);
    const existing = readInstallManifest(file);
    if (productFileExists(file) && !existing)
      throw new Error(`无法读取安装清单：${file}`);
    if (!existing) return;
    const identity = request
      ? resolveSharedIdentity(request.skillsDir)
      : undefined;
    if (
      (existing.runtime && existing.runtime !== ctx.runtime) ||
      (existing.scope &&
        existing.scope !== (ctx.isGlobal ? "global" : "local")) ||
      (existing.common &&
        (!identity ||
          existing.common.target !== identity.target ||
          existing.common.ledgerDir !== identity.ledgerDir))
    )
      throw new Error(
        "安装身份不匹配：同一清单路径不能切换 runtime、scope 或公共目标，请先卸载原安装",
      );
  };
  assertIdentity();
  if (request && !ctx.dryRun)
    await recoverSharedTransaction(request.skillsDir, roots);
  if (request) {
    const plan = planSharedDeployment(request);
    if (plan.conflicts.length) throw new Error(plan.conflicts.join("\n"));
  }
  const product = async (): Promise<void> => {
    beforeManifest?.(request ? false : ctx.dryRun);
    assertIdentity();
    const legacy = request
      ? inspectLegacyCommonInstall({
          cwd: ctx.cwd,
          baseDir: ctx.baseDir,
          skillsDir: request.skillsDir,
        })
      : { findings: [], retiredFiles: [] };
    const conflicts = legacy.findings.filter(
      (item) => item.kind === "conflict",
    );
    if (conflicts.length)
      throw new Error(
        conflicts.map((item) => `${item.file}: ${item.message}`).join("\n"),
      );
    const common = request
      ? {
          ...resolveSharedIdentity(request.skillsDir),
          packageVersion: request.catalog!.packageVersion,
          language: ctx.language,
          digest: request.catalog!.digest,
        }
      : undefined;
    if (!ctx.dryRun)
      beginManifestSession({
        baseDir: ctx.baseDir,
        cwd: ctx.cwd,
        mode: ctx.mode,
        packageVersion: String(
          JSON.parse(
            fs.readFileSync(path.join(ctx.pluginRoot, "package.json"), "utf8"),
          ).version,
        ),
        runtime: ctx.runtime,
        isGlobal: ctx.isGlobal,
        language: ctx.language,
        common,
      });
    try {
      if (!ctx.dryRun)
        for (const file of legacy.retiredFiles) retireManagedFile(file);
      await installProduct();
      if (!ctx.dryRun) endManifestSession();
    } catch (error) {
      discardManifestSession();
      throw error;
    }
  };
  if (!request) {
    await product();
    return;
  }
  const mutations = await planProductMutations(product);
  const plan = await executeSharedPlan(request, {
    dryRun: ctx.dryRun,
    productMutations: mutations,
    allowedProductRoots: roots,
  });
  if (ctx.dryRun)
    console.log(
      `[dry-run] common: ${plan.target}, ${plan.mutations.length} planned file changes`,
    );
}

export async function uninstallCommonAwareInstall(
  options: UninstallOptions,
): Promise<UninstallResult> {
  const { install, cwd, dryRun } = options;
  if (!install.manifest.common) return uninstallManagedInstall(options);
  const ctx: InstallContext = {
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
  const target = getRuntimeSkillsTarget(ctx);
  if (!target)
    throw new Error("安装清单声明了当前 Runtime 不支持的公共 Skill 依赖");
  const identity = resolveSharedIdentity(target);
  if (
    identity.target !== install.manifest.common.target ||
    identity.ledgerDir !== install.manifest.common.ledgerDir
  )
    throw new Error("公共依赖指针不匹配当前 Runtime 的真实目标，保留安装");
  const roots = [install.baseDir, ...(ctx.isGlobal ? [] : [cwd]), target];
  if (!dryRun) await recoverSharedTransaction(target, roots);
  let result: UninstallResult = { removed: [], skipped: [], missing: [] };
  const mutations = dryRun
    ? []
    : await planProductMutations(async () => {
        result = uninstallManagedInstall({ ...options, dryRun: false });
      });
  if (dryRun) result = uninstallManagedInstall(options);
  const request: SharedRequest = {
    action: "uninstall",
    skillsDir: target,
    consumer: {
      product: "frontend-craft",
      manifestPath: install.manifestPath,
      scope: install.scope,
    },
    retainConsumer: result.skipped.length > 0,
  };
  const plan = await executeSharedPlan(request, {
    dryRun,
    productMutations: mutations,
    allowedProductRoots: roots,
  });
  if (dryRun)
    console.log(
      `[dry-run] common: ${identity.target}, ${plan.mutations.length} planned file changes`,
    );
  return result;
}
