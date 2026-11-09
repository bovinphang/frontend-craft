import path from "node:path";
import {
  safeProductPath,
  canonicalProductPath,
  entryHash,
  type ManifestCodec,
  type OwnedEntry,
  type ProductContext,
} from "@bovinphang/craft-common";
import type { InstallManifest, ManifestRoot } from "./shared/fs.js";
import { parseInstallManifest } from "./shared/fs.js";
import { PRODUCT_DEFINITION } from "./product-definition.js";

export function resolveOwnedReference(
  ctx: ProductContext,
  root: ManifestRoot,
  relative: string,
): string {
  if (
    !relative ||
    path.isAbsolute(relative) ||
    relative
      .split(/[\\/]/)
      .some((part) => !part || part === "." || part === "..")
  )
    throw new Error(
      "Invalid ownership manifest path; existing files were preserved",
    );
  return safeProductPath(path.join(ctx[root], relative), ctx.allowedRoots);
}
function reference(
  ctx: ProductContext,
  file: string,
): { path: string; root?: ManifestRoot } {
  const target = safeProductPath(file, ctx.allowedRoots);
  for (const root of ["baseDir", "cwd", "home"] as const) {
    const base = canonicalProductPath(ctx[root]),
      relative = path.relative(base, target);
    if (
      relative &&
      !path.isAbsolute(relative) &&
      relative !== ".." &&
      !relative.startsWith(".." + path.sep)
    )
      return {
        path: relative.split(path.sep).join("/"),
        ...(root === "baseDir" ? {} : { root }),
      };
  }
  throw new Error("Cannot represent ownership path within declared roots");
}
export function hookEntry(
  event: string,
  index: number,
  value: unknown,
  createdFile = false,
): OwnedEntry {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid settings Hook entry");
  return {
    kind: "json-hook",
    id: `frontend-craft-hook-${event.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${index}`,
    event,
    value: value as Record<string, unknown>,
    createdFile,
    hash: entryHash({ kind: "json-hook", value }),
  };
}
export const MANIFEST_CODEC: ManifestCodec = {
  decode(bytes, ctx) {
    const raw = parseInstallManifest(bytes);
    if (!raw)
      throw new Error(
        "Cannot read ownership manifest; existing files were preserved",
      );
    if (raw.runtime !== ctx.runtime || raw.scope !== ctx.scope)
      throw new Error("Installation manifest identity mismatch: runtime/scope");
    const sharedEntries = (raw.settingsHooks ?? []).flatMap((record) =>
      Object.entries(record.hooks).flatMap(([event, values]) => {
        if (!Array.isArray(values))
          throw new Error("Invalid settings Hook ownership");
        return values.map((value, index) => ({
          path: resolveOwnedReference(
            ctx,
            record.root ?? "baseDir",
            record.path,
          ),
          entry: hookEntry(event, index, value),
        }));
      }),
    );
    const sharedFiles = new Set(sharedEntries.map((record) => record.path));
    return {
      product: PRODUCT_DEFINITION.packageName,
      packageVersion: raw.packageVersion,
      runtime: raw.runtime,
      scope: raw.scope,
      language: raw.language ?? ctx.language,
      installedAt: raw.installedAt,
      files: raw.files
        .map((file) => ({
          path: resolveOwnedReference(ctx, file.root ?? "baseDir", file.path),
          hash: file.hash,
        }))
        .filter((file) => !sharedFiles.has(file.path)),
      sharedEntries,
      ...(raw.common ? { common: raw.common } : {}),
    };
  },
  encode(state, ctx) {
    const grouped = new Map<
      string,
      { path: string; root?: ManifestRoot; hooks: Record<string, unknown[]> }
    >();
    for (const record of state.sharedEntries) {
      if (record.entry.kind !== "json-hook")
        throw new Error("Unsupported frontend shared-entry schema");
      let group = grouped.get(record.path);
      if (!group) {
        group = { ...reference(ctx, record.path), hooks: {} };
        grouped.set(record.path, group);
      }
      (group.hooks[record.entry.event] ??= []).push(record.entry.value);
    }
    const raw: InstallManifest = {
      packageVersion: state.packageVersion,
      runtime: state.runtime,
      scope: state.scope,
      language: state.language,
      installedAt: state.installedAt,
      files: state.files.map((file) => ({
        ...reference(ctx, file.path),
        hash: file.hash,
      })),
      ...(grouped.size ? { settingsHooks: [...grouped.values()] } : {}),
      ...(state.common ? { common: state.common } : {}),
    };
    return Buffer.from(JSON.stringify(raw, null, 2) + "\n");
  },
};
