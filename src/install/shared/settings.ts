import {
  readUtf8,
  writeUtf8,
  readInstallManifest,
  getManifestPath,
} from "./fs.js";
import path from "node:path";
import { entryHash } from "@bovinphang/craft-common";
import type { InstallSession } from "@bovinphang/craft-common";
import type { InstallContext } from "../types.js";
import { hookEntry } from "../manifest-codec.js";
import fs from "node:fs";

export function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function readSettings(
  file: string,
  session?: InstallSession,
): Record<string, unknown> {
  if (!(session ? session.exists(file) : fs.existsSync(file))) return {};
  try {
    const value: unknown = JSON.parse(
      session ? session.read(file).toString("utf8") : readUtf8(file),
    );
    if (value === null || typeof value !== "object" || Array.isArray(value))
      throw new Error("Expected an object");
    return value as Record<string, unknown>;
  } catch {
    throw new Error(
      `Cannot read settings JSON: ${file}. Existing settings were preserved; repair the file before installing.`,
    );
  }
}

/** Merge matching hook commands once; retain unrelated user hooks and settings. */
export function mergeHooks(
  existing: Record<string, unknown>,
  additions: Record<string, unknown>,
): Record<string, unknown> {
  if (
    existing.hooks !== undefined &&
    (existing.hooks === null ||
      typeof existing.hooks !== "object" ||
      Array.isArray(existing.hooks))
  ) {
    throw new Error("Invalid existing settings hooks; expected an object.");
  }
  const hooks = { ...asRecord(existing.hooks) };
  for (const [event, entries] of Object.entries(additions)) {
    if (!Array.isArray(entries))
      throw new Error(`Invalid hook entries: ${event}`);
    if (hooks[event] !== undefined && !Array.isArray(hooks[event]))
      throw new Error(`Invalid existing settings hooks: ${event}`);
    const current = [...((hooks[event] as unknown[] | undefined) ?? [])];
    for (const entry of entries) {
      const candidate = asRecord(entry);
      const key = hookKey(candidate);
      const index = current.findIndex(
        (value) => hookKey(asRecord(value)) === key,
      );
      if (index < 0) current.push(entry);
      else {
        current[index] = entry;
        for (
          let duplicate = current.length - 1;
          duplicate > index;
          duplicate--
        ) {
          if (hookKey(asRecord(current[duplicate])) === key)
            current.splice(duplicate, 1);
        }
      }
    }
    hooks[event] = current;
  }
  return { ...existing, hooks };
}

export function removeExactHooks(
  existing: Record<string, unknown>,
  removals: Record<string, unknown>,
): Record<string, unknown> {
  if (
    existing.hooks !== undefined &&
    (existing.hooks === null ||
      typeof existing.hooks !== "object" ||
      Array.isArray(existing.hooks))
  ) {
    throw new Error("Invalid existing settings hooks; expected an object.");
  }
  const hooks = { ...asRecord(existing.hooks) };
  for (const [event, entries] of Object.entries(removals)) {
    if (!Array.isArray(entries) || !Array.isArray(hooks[event])) continue;
    const known = new Set(entries.map((entry) => JSON.stringify(entry)));
    hooks[event] = (hooks[event] as unknown[]).filter(
      (entry) => !known.has(JSON.stringify(entry)),
    );
  }
  return { ...existing, hooks };
}

function hookKey(entry: Record<string, unknown>): string {
  return JSON.stringify([
    entry.matcher ?? "",
    Array.isArray(entry.hooks)
      ? entry.hooks.map((value) => asRecord(value).command)
      : entry.hooks,
  ]);
}

export function writeSettings(
  file: string,
  value: Record<string, unknown>,
  _ownedHooks: Record<string, unknown> = {},
): void {
  writeUtf8(file, JSON.stringify(value, null, 2) + "\n");
}
export function createSettingsTools(
  ctx: InstallContext,
  legacyHooks: Record<string, unknown> = {},
) {
  const session = ctx.session;
  if (!session)
    throw new Error("Settings writes require an explicit installation session");
  return {
    readSettings: (file: string) => readSettings(file, session),
    writeSettings(
      file: string,
      _value: Record<string, unknown>,
      ownedHooks: Record<string, unknown> = {},
    ): void {
      const previous = readInstallManifest(getManifestPath(ctx.baseDir));
      const previousGroups =
        previous?.settingsHooks?.filter(
          (record) =>
            (record.root ?? "baseDir") === "baseDir" &&
            record.path ===
              path.relative(ctx.baseDir, file).split(path.sep).join("/"),
        ) ?? [];
      for (const [event, values] of Object.entries(legacyHooks)) {
        if (!Array.isArray(values))
          throw new Error("Invalid legacy Hook declarations");
        const owned = new Set(
          previousGroups.flatMap((record) =>
            (record.hooks[event] ?? []).map((value) =>
              entryHash({ kind: "json-hook", value }),
            ),
          ),
        );
        const unownedLegacy = values.filter(
          (value) => !owned.has(entryHash({ kind: "json-hook", value })),
        );
        if (unownedLegacy.length && session.exists(file)) {
          const before = readSettings(file, session);
          const after = removeExactHooks(before, { [event]: unownedLegacy });
          if (JSON.stringify(after) !== JSON.stringify(before))
            session.stage(
              file,
              Buffer.from(JSON.stringify(after, null, 2) + "\n"),
            );
        }
      }
      for (const [event, entries] of Object.entries(ownedHooks)) {
        if (!Array.isArray(entries))
          throw new Error("Invalid owned Hook entries");
        entries.forEach((value, index) =>
          session.editShared(file, hookEntry(event, index, value)),
        );
      }
    },
  };
}
