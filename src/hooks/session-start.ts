import { existsSync, readFileSync } from "node:fs";
import { choosePackageManager } from "./package-manager.js";

process.stdin.resume();
process.stdin.on("data", () => {});

if (!existsSync("package.json")) process.exit(0);

let framework = "unknown";
let declaredPackageManager: string | undefined;
try {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  declaredPackageManager = pkg.packageManager;
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const fw: string[] = [];
  if (deps.vue || deps.nuxt) fw.push("Vue " + (deps.vue || deps.nuxt));
  if (deps.react || deps.next) fw.push("React " + (deps.react || deps.next));
  if (deps["@angular/core"]) fw.push("Angular " + deps["@angular/core"]);
  framework = fw.join(", ") || "unknown";
} catch {
  // ignore
}

const packageManager = choosePackageManager(declaredPackageManager);

if (framework !== "unknown") {
  process.stdout.write(
    `[frontend-craft] Framework: ${framework} | Package manager: ${packageManager}`,
  );
}

process.exit(0);
