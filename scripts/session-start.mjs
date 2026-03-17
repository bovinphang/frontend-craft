import { existsSync, readFileSync } from "node:fs";

process.stdin.resume();
process.stdin.on("data", () => {});

if (!existsSync("package.json")) process.exit(0);

let framework = "unknown";
try {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const fw = [];
  if (deps.vue || deps.nuxt) fw.push("Vue " + (deps.vue || deps.nuxt));
  if (deps.react || deps.next) fw.push("React " + (deps.react || deps.next));
  if (deps["@angular/core"]) fw.push("Angular " + deps["@angular/core"]);
  framework = fw.join(", ") || "unknown";
} catch {
  // ignore
}

let packageManager = "npm";
if (existsSync("pnpm-lock.yaml")) packageManager = "pnpm";
else if (existsSync("yarn.lock")) packageManager = "yarn";
else if (existsSync("bun.lockb")) packageManager = "bun";

if (framework !== "unknown") {
  process.stdout.write(
    `[frontend-craft] Framework: ${framework} | Package manager: ${packageManager}`
  );
}

process.exit(0);
