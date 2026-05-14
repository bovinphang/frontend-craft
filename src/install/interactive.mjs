import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { ALL_RUNTIMES } from "./registry.mjs";
import { getGlobalConfigDir, LOCAL_DIR } from "./runtime-homes.mjs";

const RUNTIME_LABELS = {
  claude: "Claude Code",
  codex: "Codex",
  cursor: "Cursor",
  windsurf: "Windsurf",
  opencode: "OpenCode",
  kilo: "Kilo",
  gemini: "Gemini",
  copilot: "Copilot",
  antigravity: "Antigravity",
  augment: "Augment",
  trae: "Trae",
  codebuddy: "CodeBuddy",
  cline: "Cline",
  openclaw: "OpenClaw",
};

function formatHome(p) {
  const home = os.homedir();
  if (p === home) return "~";
  if (p.startsWith(`${home}${path.sep}`)) return `~${p.slice(home.length)}`;
  return p;
}

function getLocalDisplay(runtime) {
  const localDir = LOCAL_DIR[runtime];
  return localDir ? `./${localDir}` : "./";
}

export const RUNTIME_OPTIONS = ALL_RUNTIMES.map((runtime, index) => ({
  choice: String(index + 1),
  runtime,
  label: RUNTIME_LABELS[runtime] ?? runtime,
}));

export const ALL_RUNTIMES_CHOICE = String(RUNTIME_OPTIONS.length + 1);

export function buildRuntimePromptText() {
  const rows = RUNTIME_OPTIONS.map((option) => {
    const globalDir = formatHome(getGlobalConfigDir(option.runtime));
    return `  ${option.choice}) ${option.label.padEnd(13)} (${globalDir})`;
  });

  return `Which runtime(s) would you like to install for?

${rows.join("\n")}
  ${ALL_RUNTIMES_CHOICE}) All

Select multiple: 1,2,6 or 1 2 6`;
}

export function parseRuntimeInput(answer) {
  const input = (answer == null ? "" : String(answer)).trim() || "1";
  const choices = input.split(/[\s,]+/).filter(Boolean);
  if (choices.includes(ALL_RUNTIMES_CHOICE)) {
    return ALL_RUNTIMES.slice();
  }

  const selected = [];
  const seen = new Set();
  const byChoice = new Map(RUNTIME_OPTIONS.map((option) => [option.choice, option.runtime]));
  for (const choice of choices) {
    const runtime = byChoice.get(choice);
    if (!runtime || seen.has(runtime)) continue;
    seen.add(runtime);
    selected.push(runtime);
  }

  return selected.length ? selected : ["claude"];
}

export function buildLocationPromptText(runtimes) {
  const globalExamples = runtimes
    .map((runtime) => formatHome(getGlobalConfigDir(runtime)))
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
  const localExamples = runtimes
    .map((runtime) => getLocalDisplay(runtime))
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");

  return `Where would you like to install?

  1) Global (${globalExamples}) - available in all projects
  2) Local  (${localExamples}) - this project only`;
}

export function parseLocationInput(answer) {
  const input = (answer == null ? "" : String(answer)).trim() || "1";
  return input !== "2";
}

let scriptedAnswers;

function readScriptedAnswer(question) {
  process.stdout.write(question);
  if (!scriptedAnswers) {
    scriptedAnswers = fs.readFileSync(0, "utf8").split(/\r?\n/);
  }
  return scriptedAnswers.shift() ?? "";
}

function ask(question) {
  if (process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1" && !process.stdin.isTTY) {
    return Promise.resolve(readScriptedAnswer(question));
  }

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    rl.on("close", () => resolve(""));
  });
}

export async function promptRuntime() {
  console.log(`${buildRuntimePromptText()}\n`);
  return parseRuntimeInput(await ask("Choice [1]: "));
}

export async function promptLocation(runtimes) {
  console.log(`${buildLocationPromptText(runtimes)}\n`);
  return parseLocationInput(await ask("Choice [1]: "));
}
