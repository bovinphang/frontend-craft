import { existsSync } from "node:fs";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export function choosePackageManager(declared?: string): PackageManager {
  const name = declared?.match(/^(npm|pnpm|yarn|bun)@/i)?.[1]?.toLowerCase();
  if (name === "npm" || name === "pnpm" || name === "yarn" || name === "bun")
    return name;
  const locks = [
    ["pnpm-lock.yaml", "pnpm"],
    ["yarn.lock", "yarn"],
    ["bun.lock", "bun"],
    ["bun.lockb", "bun"],
    ["package-lock.json", "npm"],
  ] as const;
  const detected = new Set(
    locks.filter(([file]) => existsSync(file)).map(([, manager]) => manager),
  );
  return detected.size === 1 ? [...detected][0] : "npm";
}
