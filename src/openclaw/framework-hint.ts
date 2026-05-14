import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function buildFrameworkHint(workspaceDir: string): string {
  const pkgPath = join(workspaceDir, "package.json");
  if (!existsSync(pkgPath)) return "";

  let framework = "unknown";
  let packageManager = "npm";
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const fw: string[] = [];
    if (deps.vue || deps.nuxt) fw.push(`Vue ${deps.vue ?? deps.nuxt ?? ""}`);
    if (deps.react || deps.next) fw.push(`React ${deps.react ?? deps.next ?? ""}`);
    if (deps["@angular/core"]) fw.push(`Angular ${deps["@angular/core"]}`);
    framework = fw.join(", ") || "unknown";
  } catch {
    return "";
  }

  if (existsSync(join(workspaceDir, "pnpm-lock.yaml"))) packageManager = "pnpm";
  else if (existsSync(join(workspaceDir, "yarn.lock"))) packageManager = "yarn";
  else if (existsSync(join(workspaceDir, "bun.lockb"))) packageManager = "bun";

  if (framework === "unknown") return "";
  return `[frontend-craft] Detected framework: ${framework} | Package manager: ${packageManager}`;
}
