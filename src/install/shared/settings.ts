import fs from "node:fs";
import { readUtf8, writeSharedUtf8, recordSettingsHooks } from "./fs.js";

export function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

export function readSettings(file: string): Record<string, unknown> {
  if (!fs.existsSync(file)) return {};
  try {
    const value: unknown = JSON.parse(readUtf8(file));
    if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an object");
    return value as Record<string, unknown>;
  } catch {
    throw new Error(`Cannot read settings JSON: ${file}. Existing settings were preserved; repair the file before installing.`);
  }
}

/** Merge matching hook commands once; retain unrelated user hooks and settings. */
export function mergeHooks(existing: Record<string, unknown>, additions: Record<string, unknown>): Record<string, unknown> {
  if (existing.hooks !== undefined && (existing.hooks === null || typeof existing.hooks !== "object" || Array.isArray(existing.hooks))) {
    throw new Error("Invalid existing settings hooks; expected an object.");
  }
  const hooks = { ...asRecord(existing.hooks) };
  for (const [event, entries] of Object.entries(additions)) {
    if (!Array.isArray(entries)) throw new Error(`Invalid hook entries: ${event}`);
    if (hooks[event] !== undefined && !Array.isArray(hooks[event])) throw new Error(`Invalid existing settings hooks: ${event}`);
    const current = [...(hooks[event] as unknown[] | undefined ?? [])];
    for (const entry of entries) {
      const candidate = asRecord(entry);
      const key = hookKey(candidate);
      const index = current.findIndex(value => hookKey(asRecord(value)) === key);
      if (index < 0) current.push(entry);
      else {
        current[index] = entry;
        for (let duplicate = current.length - 1; duplicate > index; duplicate--) {
          if (hookKey(asRecord(current[duplicate])) === key) current.splice(duplicate, 1);
        }
      }
    }
    hooks[event] = current;
  }
  return { ...existing, hooks };
}

export function removeExactHooks(existing: Record<string, unknown>, removals: Record<string, unknown>): Record<string, unknown> {
  if (existing.hooks !== undefined && (existing.hooks === null || typeof existing.hooks !== "object" || Array.isArray(existing.hooks))) {
    throw new Error("Invalid existing settings hooks; expected an object.");
  }
  const hooks = { ...asRecord(existing.hooks) };
  for (const [event, entries] of Object.entries(removals)) {
    if (!Array.isArray(entries) || !Array.isArray(hooks[event])) continue;
    const known = new Set(entries.map(entry => JSON.stringify(entry)));
    hooks[event] = (hooks[event] as unknown[]).filter(entry => !known.has(JSON.stringify(entry)));
  }
  return { ...existing, hooks };
}

function hookKey(entry: Record<string, unknown>): string {
  return JSON.stringify([entry.matcher ?? "", Array.isArray(entry.hooks)
    ? entry.hooks.map(value => asRecord(value).command) : entry.hooks]);
}

export function writeSettings(file: string, value: Record<string, unknown>, ownedHooks: Record<string, unknown> = {}): void {
  // Settings mix user and plugin content; never claim ownership of the whole file.
  writeSharedUtf8(file, `${JSON.stringify(value, null, 2)}\n`);
  recordSettingsHooks(file, Object.fromEntries(Object.entries(ownedHooks).filter((entry): entry is [string, unknown[]] => Array.isArray(entry[1]))));
}
