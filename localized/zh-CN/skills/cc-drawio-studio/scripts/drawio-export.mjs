#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { formatResult, parseArgs } from "./studio-core.mjs";

const INSTALL_HINTS = [
  "draw.io desktop CLI was not found.",
  "Install draw.io desktop, then rerun the export.",
  "Windows: winget install JGraph.Draw",
  "macOS: brew install --cask drawio",
  "Linux: install drawio from your package manager or snap install drawio",
  "Manual download: https://github.com/jgraph/drawio-desktop/releases",
];

export function buildExportPlan(input, args = {}, env = process.env, platform = process.platform) {
  const drawio = findDrawio(args.drawio, env, platform);
  if (!drawio) {
    return {
      ok: false,
      title: "Draw.io Export",
      errors: [INSTALL_HINTS.join("\n")],
      command: null,
    };
  }

  const format = String(args.format ?? "png");
  const output = String(args.output ?? defaultOutput(input, format));
  const commandArgs = ["-x", "-f", format];
  if (args.embed) commandArgs.push("-e");
  if (args.scale) commandArgs.push("-s", String(args.scale));
  if (args.width) commandArgs.push("--width", String(args.width));
  if (args.border) commandArgs.push("--border", String(args.border));
  if (args.crop) commandArgs.push("--crop");
  if (args.page !== undefined) commandArgs.push("-p", String(args.page));
  commandArgs.push("-o", output, input);

  return {
    ok: true,
    title: "Draw.io Export",
    drawio,
    command: [drawio, ...commandArgs],
    output,
    format,
    dryRun: Boolean(args.dryRun),
    errors: [],
  };
}

export function findDrawio(explicitPath, env = process.env, platform = process.platform) {
  if (explicitPath) return existingFile(explicitPath);

  for (const command of ["drawio", "draw.io"]) {
    const found = findOnPath(command, env, platform);
    if (found) return found;
  }

  for (const candidate of defaultCandidates(env, platform)) {
    const found = existingFile(candidate);
    if (found) return found;
  }

  return null;
}

function findOnPath(command, env, platform) {
  const pathValue = env.PATH ?? env.Path ?? "";
  const dirs = pathValue.split(path.delimiter).filter(Boolean);
  const extensions = platform === "win32" ? pathExtensions(env) : [""];
  for (const dir of dirs) {
    for (const ext of extensions) {
      const candidate = path.join(dir, command.endsWith(ext) ? command : `${command}${ext}`);
      const found = existingFile(candidate);
      if (found) return found;
    }
  }
  return null;
}

function pathExtensions(env) {
  const configured = env.PATHEXT ? env.PATHEXT.split(";").filter(Boolean) : [".EXE", ".CMD", ".BAT", ""];
  return [...new Set(["", ...configured, ...configured.map((item) => item.toLowerCase())])];
}

function defaultCandidates(env, platform) {
  if (platform === "win32") {
    return [
      path.join(env.ProgramFiles ?? "C:\\Program Files", "draw.io", "draw.io.exe"),
      path.join(env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)", "draw.io", "draw.io.exe"),
      path.join(env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local"), "Programs", "draw.io", "draw.io.exe"),
    ];
  }
  if (platform === "darwin") {
    return ["/Applications/draw.io.app/Contents/MacOS/draw.io"];
  }
  return ["/usr/bin/drawio", "/usr/local/bin/drawio", "/snap/bin/drawio"];
}

function existingFile(candidate) {
  if (!candidate) return null;
  const resolved = path.resolve(candidate);
  return fs.existsSync(resolved) && fs.statSync(resolved).isFile() ? resolved : null;
}

function defaultOutput(input, format) {
  return `${input.replace(/\.(drawio|xml)$/i, "")}.${format}`;
}

function printFailure(plan, args) {
  const output = formatResult(plan, args.formatOutput ?? (args.json ? "json" : "markdown"));
  process.stderr.write(output);
}

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input) {
  console.error("usage: node drawio-export.mjs <file.drawio> [--format png|svg|pdf] [--output file] [--scale 2] [--width 2000] [--border 20] [--dry-run] [--json]");
  process.exit(2);
}

const plan = buildExportPlan(input, args);
if (!plan.ok) {
  printFailure(plan, args);
  process.exit(1);
}

if (args.dryRun) {
  process.stdout.write(formatResult(plan, args.formatOutput ?? (args.json ? "json" : "markdown")));
  process.exit(0);
}

const result = spawnSync(plan.command[0], plan.command.slice(1), { stdio: "inherit" });
process.exit(result.status ?? 1);
