import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export function discoverTests(root: string): string[] {
  const files: string[] = [];
  const visit = (dir: string): void => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (
        entry.isDirectory() &&
        !["node_modules", "dist", "npm-packages", "skill-packages"].includes(
          entry.name,
        )
      )
        visit(file);
      else if (entry.isFile() && entry.name.endsWith(".test.ts"))
        files.push(path.resolve(file));
    }
  };
  visit(path.resolve(root, "tests"));
  return files.sort((a, b) => {
    const left = path.relative(root, a).split(path.sep).join("/");
    const right = path.relative(root, b).split(path.sep).join("/");
    return left < right ? -1 : left > right ? 1 : 0;
  });
}

export function runTests(root: string): number {
  const files = discoverTests(root);
  if (!files.length) {
    console.error(`[test] No test files under ${root}/tests`);
    return 1;
  }
  // A nested runner must not inherit node:test's child IPC mode.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(
    process.execPath,
    [
      "--import",
      import.meta.resolve("tsx"),
      "--test",
      "--test-concurrency=1",
      ...files,
    ],
    { cwd: root, stdio: "inherit", shell: false, env },
  );
  if (result.error) console.error(result.error.message);
  return result.status ?? 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const index = process.argv.indexOf("--root");
  if (index >= 0 && !process.argv[index + 1]) {
    console.error("--root requires a directory");
    process.exitCode = 1;
  } else
    process.exitCode = runTests(
      index >= 0 ? path.resolve(process.argv[index + 1]) : process.cwd(),
    );
}
