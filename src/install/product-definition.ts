import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  resolveRuntimeTargets,
  type ProductDefinition,
  type ProductContext,
} from "@bovinphang/craft-common";
import type { InstallContext } from "./types.js";

export const PRODUCT_DEFINITION: ProductDefinition = Object.freeze({
  packageName: "@bovinphang/frontend-craft",
  consumerProduct: "frontend-craft",
  resourcePrefix: "fec-",
  manifestName: "frontend-craft.manifest.json",
  stateDirectoryName: ".frontend-craft-state",
  markerId: "frontend-craft",
  retainUnrequestedFiles: true,
  nativeMetadata: true,
  resourceEntries: { rules: ["references"] },
});
export function toProductContext(ctx: InstallContext): ProductContext {
  const home = ctx.home ?? os.homedir();
  const target = resolveRuntimeTargets({
    runtime: ctx.runtime,
    cwd: ctx.cwd,
    home,
    baseDir: ctx.baseDir,
    scope: ctx.isGlobal ? "global" : "local",
    env: {},
    compatibility: "frontend",
  });
  let packageVersion = "3.0.0";
  const metadata = path.join(ctx.pluginRoot, "package.json");
  if (fs.existsSync(metadata))
    packageVersion = String(
      JSON.parse(fs.readFileSync(metadata, "utf8")).version ?? packageVersion,
    );
  return {
    packageVersion,
    runtime: ctx.runtime,
    scope: ctx.isGlobal ? "global" : "local",
    language: ctx.language,
    cwd: ctx.cwd,
    home,
    baseDir: ctx.baseDir,
    allowedRoots: target.resourceRoots,
    dryRun: ctx.dryRun,
  };
}

export const LEGACY_SKILL_IDS: Readonly<Record<string, string>> = {
  "fec-drawio-studio": "cc-drawio-studio",
  "fec-source-driven-development": "cc-source-driven-development",
  "fec-typescript-project-standard": "cc-typescript-project-standard",
};
