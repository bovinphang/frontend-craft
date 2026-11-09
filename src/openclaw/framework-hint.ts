import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { inspectWorkspace } from "@bovinphang/craft-common";
import { FRONTEND_FRAMEWORK_DETECTORS } from "../project/frameworks.js";
export function buildFrameworkHint(workspaceDir: string): string {
  try {
    if (!existsSync(join(workspaceDir, "package.json"))) return "";
    const inspection = inspectWorkspace({
        workspace: workspaceDir,
        maxDepth: 0,
        detectors: FRONTEND_FRAMEWORK_DETECTORS,
      }),
      unit = inspection.units.find((u) => u.root === inspection.workspace);
    if (!unit) return "";
    const frameworks = unit.frameworks.filter((f) =>
      ["vue", "nuxt", "react", "next", "angular"].includes(f.id),
    );
    if (!frameworks.length) return "";
    const labels: Record<string, string> = {
      vue: "Vue",
      nuxt: "Nuxt",
      react: "React",
      next: "Next.js",
      angular: "Angular",
    };
    const text = frameworks
      .map((f) => labels[f.id] + (f.version ? " " + f.version : ""))
      .join(", ");
    const root = resolve(workspaceDir);
    const manager = existsSync(join(root, "pnpm-lock.yaml"))
      ? "pnpm"
      : existsSync(join(root, "yarn.lock"))
        ? "yarn"
        : existsSync(join(root, "bun.lockb"))
          ? "bun"
          : "npm";
    return (
      "[frontend-craft] Detected framework: " +
      text +
      " | Package manager: " +
      manager
    );
  } catch {
    return "";
  }
}
