#!/usr/bin/env node
// @ts-check
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";

// Use installed tools only. Never invoke npx or a shell that could download packages.
try {
  /** @type {Record<string,string>} */
  const args = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    const key = process.argv[i];
    if (!key.startsWith("--") || !process.argv[i + 1]) throw new Error("Expected --input source.mmd --output image.svg [--cli path] [--theme default|dark|neutral|forest] [--timeout 30000] [--report file.json]");
    if (!["input", "output", "cli", "theme", "timeout", "report", "format"].includes(key.slice(2))) throw new Error(`Unknown argument: ${key}`);
    args[key.slice(2)] = process.argv[i + 1];
  }
  if (!args.input || !args.output) throw new Error("--input and --output are required.");
  const input = path.resolve(args.input), output = path.resolve(args.output);
  if (!fs.existsSync(input)) throw new Error(`Input does not exist: ${input}`);
  if (!/\.(svg|png|pdf)$/i.test(output)) throw new Error("Output must end in .svg, .png or .pdf.");
  const theme = args.theme === "light" ? "default" : args.theme ?? "default";
  if (args.format && !["json","markdown"].includes(args.format)) throw new Error("--format must be json or markdown");
  if (!["default", "dark", "neutral", "forest"].includes(theme)) throw new Error("Unsupported Mermaid theme.");
  const timeout = Number(args.timeout ?? 30000);
  if (!Number.isFinite(timeout) || timeout < 100 || timeout > 300000) throw new Error("--timeout must be between 100 and 300000 milliseconds.");
  /** @type {string[]} */
  const candidates = args.cli ? [path.resolve(args.cli)] : (process.env.PATH ?? "").split(path.delimiter).flatMap((dir) => [path.join(dir, "mmdc"), path.join(dir, "mmdc.cmd")]);
  let cli = candidates.find((candidate) => fs.existsSync(candidate));
  if (cli?.endsWith(".cmd")) {
    // npm Windows shims are shell scripts. Execute their installed JS entry directly.
    const entry = path.join(path.dirname(cli), "node_modules", "@mermaid-js", "mermaid-cli", "src", "cli.js");
    cli = fs.existsSync(entry) ? entry : undefined;
  }
  if (!cli) throw new Error("Mermaid CLI unavailable. Use the JSON/HTML renderer or provide an installed mmdc JS entry with --cli. No packages were installed.");
  const js = /\.[cm]?js$/i.test(cli);
  const command = js ? process.execPath : cli;
  const prefix = js ? [cli] : [];
  const version = spawnSync(command, [...prefix, "--version"], { encoding: "utf8", timeout, windowsHide: true });
  if (version.error || version.status !== 0) throw new Error(`Mermaid CLI unavailable: ${version.error?.message ?? version.stderr}`);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-mermaid-"));
  try {
    const artifact = path.join(dir, `diagram${path.extname(output)}`);
    const result = spawnSync(command, [...prefix, "-i", input, "-o", artifact, "-t", theme], { encoding: "utf8", timeout, windowsHide: true });
    if (result.error || result.status !== 0) throw new Error(`Mermaid render failed: ${result.error?.message ?? result.stderr}`);
    if (!fs.existsSync(artifact) || fs.statSync(artifact).size === 0) throw new Error("Mermaid render failed: no fresh artifact produced.");
    const bytes = fs.readFileSync(artifact);
    if (output.endsWith(".svg") && !bytes.toString("utf8").includes("<svg")) throw new Error("Mermaid render failed: invalid SVG.");
    if (output.endsWith(".png") && bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error("Mermaid render failed: invalid PNG.");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.copyFileSync(artifact, output);
    if (args.report) {
      fs.mkdirSync(path.dirname(path.resolve(args.report)), { recursive: true });
      fs.writeFileSync(args.report, JSON.stringify({ ok:true,engine:"mermaid",format:path.extname(output).slice(1),verified:false,route: "mermaid", version: version.stdout.trim(), input, output, theme, status: "rendered", visualQA: "pending" }, null, 2) + "\n");
    }
    const report = {ok:true,engine:"mermaid",version:version.stdout.trim(),input,output,format:path.extname(output).slice(1),verified:false,reason:"Final image visual QA is pending."};
    console.log(args.format === "json" ? JSON.stringify(report) : `Rendered Mermaid diagram: ${output}\nVisual QA: pending`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
