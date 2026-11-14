import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
const source = path.resolve(import.meta.dirname, "..");
fs.mkdirSync(path.join(source, "npm-packages"), { recursive: true });
execSync("npm pack --ignore-scripts --pack-destination ../../npm-packages", {
  cwd: path.join(source, "dist/package"),
  stdio: "inherit",
  windowsHide: true,
});
