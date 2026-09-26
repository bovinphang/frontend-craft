import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { check, resolveConfig } from "prettier";

export async function checkFormat(files: string[]): Promise<string[]> {
  const failures: string[] = [];
  for (const file of files) {
    const options = await resolveConfig(file);
    if (
      !(await check(fs.readFileSync(file, "utf8"), {
        ...options,
        filepath: file,
      }))
    )
      failures.push(file);
  }
  return failures;
}

export function changedSourceFiles(root: string): string[] {
  const tracked = execFileSync(
    "git",
    ["diff", "--name-only", "-z", "--diff-filter=ACMR", "HEAD"],
    { cwd: root, encoding: "utf8" },
  );
  const untracked = execFileSync(
    "git",
    ["ls-files", "--others", "--exclude-standard", "-z"],
    { cwd: root, encoding: "utf8" },
  );
  return [...new Set(`${tracked}\0${untracked}`.split("\0"))]
    .filter(
      (file) =>
        /^(?:bin|src|scripts|tests)\/.*\.(?:ts|mjs)$/.test(file) ||
        ["package.json", "eslint.config.mjs"].includes(file),
    )
    .map((file) => path.join(root, file))
    .filter((file) => fs.existsSync(file) && fs.lstatSync(file).isFile())
    .sort();
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const failures = await checkFormat(changedSourceFiles(process.cwd()));
    if (failures.length) {
      console.error(
        `[format:check] Unformatted files:\n${failures.join("\n")}`,
      );
      process.exitCode = 1;
    } else console.log("[format:check] changed source files are formatted");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
