import fs from "node:fs";
import path from "node:path";
import { transform } from "esbuild";

const root = process.cwd();
const distDir = path.join(root, "dist");

if (!fs.existsSync(distDir)) {
  throw new Error("dist directory does not exist; run tsc before minifying");
}

const files = listJavaScriptFiles(distDir);

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const shebang = source.startsWith("#!") ? source.slice(0, source.indexOf("\n") + 1) : "";
  const code = shebang ? source.slice(shebang.length) : source;
  const result = await transform(code, {
    format: "esm",
    legalComments: "none",
    minify: true,
    target: "es2022",
  });

  fs.writeFileSync(file, `${shebang}${result.code}`, "utf8");
}

console.log(`[minify-dist] minified ${files.length} JavaScript files`);

function listJavaScriptFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJavaScriptFiles(file));
    else if (entry.isFile() && entry.name.endsWith(".js")) out.push(file);
  }
  return out;
}
