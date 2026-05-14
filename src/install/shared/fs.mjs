import fs from "node:fs";
import path from "node:path";

/**
 * @param {string} dir
 */
export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * @param {string} src
 * @param {string} dest
 */
export function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

/**
 * @param {string} srcDir
 * @param {string} destDir
 * @param {{ filter?: (rel: string) => boolean }} [opts]
 */
export function copyDir(srcDir, destDir, opts = {}) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  for (const name of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, name);
    const rel = name;
    if (opts.filter && !opts.filter(rel)) continue;
    const d = path.join(destDir, name);
    const st = fs.statSync(s);
    if (st.isDirectory()) copyDir(s, d, opts);
    else copyFile(s, d);
  }
}

/**
 * @param {string} filePath
 * @returns {string}
 */
export function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

/**
 * @param {string} filePath
 * @param {string} content
 */
export function writeUtf8(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
export function listFilesRecursive(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...listFilesRecursive(p));
    else out.push(p);
  }
  return out;
}
