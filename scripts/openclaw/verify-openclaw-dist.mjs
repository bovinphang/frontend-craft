import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const bundle = path.join(root, "dist", "openclaw", "index.js");
const bundleExists = existsSync(bundle);

if (!bundleExists) {
  console.error("[verify-openclaw-dist] Missing:", bundle);
  process.exit(1);
}
const content = readFileSync(bundle, "utf8");
const lines = content.split(/\r?\n/).length;
const bytes = Buffer.byteLength(content, "utf8");

if (bytes === 0) {
  console.error("[verify-openclaw-dist] Bundle is empty:", bundle);
  process.exit(1);
}
console.log("[verify-openclaw-dist] OK:", bundle, `(${bytes} bytes, ${lines} lines)`);
