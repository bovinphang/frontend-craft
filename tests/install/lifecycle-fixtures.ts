import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type ProcessRunner } from "../../src/install/package-manager.js";

const name = "@bovinphang/frontend-craft";
export function fixture(t: { after: (fn: () => void) => void }) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "fec lifecycle space "));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  const prefix = path.join(base, "custom prefix");
  const root = path.join(prefix, "node_modules");
  const pkg = path.join(root, name);
  fs.mkdirSync(path.join(pkg, "dist/bin"), { recursive: true });
  fs.writeFileSync(
    path.join(pkg, "package.json"),
    JSON.stringify({
      name,
      version: "3.0.0",
      bin: { fec: "dist/bin/frontend-craft.js" },
    }),
  );
  fs.writeFileSync(path.join(pkg, "dist/bin/frontend-craft.js"), "// fixture");
  const calls: { file: string; args: string[] }[] = [];
  const runner: ProcessRunner = async (file, args) => {
    calls.push({ file, args });
    let stdout = "";
    if (args[0] === "prefix") stdout = prefix;
    else if (args[0] === "root") stdout = root;
    else if (args[0] === "config") stdout = "https://registry.example.test/";
    else if (args[0] === "ls")
      stdout = JSON.stringify({
        dependencies: {
          [name]: {
            version: "3.0.0",
            resolved:
              "https://registry.example.test/@bovinphang/frontend-craft/-/frontend-craft-3.0.0.tgz",
          },
        },
      });
    else if (args[0] === "view") stdout = '"3.0.1"';
    return { code: 0, stdout };
  };
  return { base, prefix, root, pkg, calls, runner };
}

export function pnpmFixture(t: Parameters<typeof fixture>[0], shared = false) {
  const f = fixture(t);
  const group = path.join(f.base, "pnpm home", "global", "v11", "group-target");
  fs.mkdirSync(path.join(group, "node_modules", "@bovinphang"), {
    recursive: true,
  });
  fs.symlinkSync(f.pkg, path.join(group, "node_modules", name), "junction");
  fs.writeFileSync(
    path.join(group, "package.json"),
    JSON.stringify({
      dependencies: { [name]: "3.0.0", ...(shared ? { other: "1.0.0" } : {}) },
    }),
  );
  fs.writeFileSync(
    path.join(group, "pnpm-lock.yaml"),
    `packages:\n  '${name}@3.0.0':\n    resolution: {integrity: sha512-test}\n`,
  );
  fs.writeFileSync(
    path.join(group, "node_modules", ".modules.yaml"),
    "registries:\n  default: https://registry.example.test/\n",
  );
  const runner: ProcessRunner = async (file, args, opts) => {
    if (args[0] === "list") {
      f.calls.push({ file, args });
      return {
        code: 0,
        stdout: JSON.stringify([
          {
            path: group,
            dependencies: { [name]: { version: "3.0.0", path: f.pkg } },
          },
        ]),
      };
    }
    return f.runner(file, args, opts);
  };
  return { ...f, group, runner };
}
