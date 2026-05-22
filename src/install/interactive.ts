import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { ALL_RUNTIMES } from "./registry.js";
import { getGlobalConfigDir, LOCAL_DIR } from "./runtime-homes.js";

type SelectOption = {
  value: string;
  label: string;
  description?: string;
  selectedSuffix?: string;
};

type SelectState<T = string[] | boolean> = {
  message: string;
  options: SelectOption[];
  selected: string[];
  multiple: boolean;
  pageSize: number;
  search: string;
  cursor: number;
  error: string;
  visibleOptions(): SelectOption[];
  move(delta: number): void;
  toggle(): void;
  backspace(): void;
  type(text: string): void;
  confirm(): T | undefined;
};

const RUNTIME_LABELS: Record<string, string> = {
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
  qoder: "Qoder",
};

function formatHome(p: string): string {
  const home = os.homedir();
  if (p === home) return "~";
  if (p.startsWith(`${home}${path.sep}`)) return `~${p.slice(home.length)}`;
  return p;
}

function getLocalDisplay(runtime: string): string {
  const localDir = LOCAL_DIR[runtime];
  return localDir ? `./${localDir}` : "./";
}

export const RUNTIME_OPTIONS = ALL_RUNTIMES.map((runtime, index) => ({
  choice: String(index + 1),
  runtime,
  label: RUNTIME_LABELS[runtime] ?? runtime,
}));

export const ALL_RUNTIMES_CHOICE = String(RUNTIME_OPTIONS.length + 1);

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeInputChar(key: { sequence?: string; name?: string; ctrl?: boolean; meta?: boolean } | undefined): string {
  if (!key || key.ctrl || key.meta) return "";
  if (typeof key.sequence === "string" && key.sequence.length === 1 && key.sequence >= " ") {
    return key.sequence;
  }
  if (typeof key.name === "string" && key.name.length === 1) return key.name;
  return "";
}

function toRuntimeOptions(): SelectOption[] {
  return RUNTIME_OPTIONS.map((option) => {
    const globalDir = formatHome(getGlobalConfigDir(option.runtime));
    return {
      value: option.runtime,
      label: option.label,
      description: globalDir,
      selectedSuffix: "selected",
    };
  });
}

function toLocationOptions(runtimes: string[]): SelectOption[] {
  const globalExamples = unique(runtimes.map((runtime) => formatHome(getGlobalConfigDir(runtime)))).join(", ");
  const localExamples = unique(runtimes.map((runtime) => getLocalDisplay(runtime))).join(", ");

  return [
    {
      value: "global",
      label: "Global",
      description: `${globalExamples} - available in all projects`,
      selectedSuffix: "selected",
    },
    {
      value: "local",
      label: "Local",
      description: `${localExamples} - this project only`,
      selectedSuffix: "selected",
    },
  ];
}

export function createSelectablePromptState<T = string[]>({
  message,
  options,
  selected = [],
  multiple = true,
  pageSize = 15,
  validate = (values) => values.length > 0,
  transform = ((values: string[]) => values as T),
}: {
  message: string;
  options: SelectOption[];
  selected?: string[];
  multiple?: boolean;
  pageSize?: number;
  validate?: (values: string[]) => true | string | boolean;
  transform?: (values: string[]) => T;
}): SelectState<T> {
  const state: SelectState<T> = {
    message,
    options,
    selected: selected.filter((value, index) => selected.indexOf(value) === index),
    multiple,
    pageSize,
    search: "",
    cursor: 0,
    error: "",
    visibleOptions() {
      const term = this.search.trim().toLowerCase();
      if (!term) return this.options;
      return this.options.filter((option) => {
        return option.label.toLowerCase().includes(term) || option.value.toLowerCase().includes(term);
      });
    },
    move(delta) {
      const visible = this.visibleOptions();
      this.cursor = clamp(this.cursor + delta, 0, Math.max(0, visible.length - 1));
      this.error = "";
    },
    toggle() {
      const choice = this.visibleOptions()[this.cursor];
      if (!choice) return;
      if (!this.multiple) {
        this.selected = [choice.value];
      } else if (this.selected.includes(choice.value)) {
        this.selected = this.selected.filter((value) => value !== choice.value);
      } else {
        this.selected = [...this.selected, choice.value];
      }
      this.error = "";
    },
    backspace() {
      if (this.search.length > 0) {
        this.search = this.search.slice(0, -1);
        this.cursor = 0;
      } else if (this.selected.length > 0) {
        this.selected = this.selected.slice(0, -1);
      }
      this.error = "";
    },
    type(text) {
      this.search += text;
      this.cursor = 0;
      this.error = "";
    },
    confirm() {
      const result = validate(this.selected);
      if (result !== true) {
        this.error = typeof result === "string" ? result : "Select at least one option";
        return undefined;
      }
      return transform(this.selected);
    },
  };
  return state;
}

export function createRuntimePromptState(options: { pageSize?: number } = {}): SelectState<string[]> {
  return createSelectablePromptState({
    message: `Which runtime(s) would you like to install for? (${RUNTIME_OPTIONS.length} available)`,
    options: toRuntimeOptions(),
    selected: ["claude"],
    multiple: true,
    pageSize: options.pageSize ?? 15,
    transform: (values) => values,
  });
}

export function createLocationPromptState(runtimes: string[], options: { pageSize?: number } = {}): SelectState<boolean> {
  return createSelectablePromptState<boolean>({
    message: "Where would you like to install?",
    options: toLocationOptions(runtimes),
    selected: ["global"],
    multiple: false,
    pageSize: options.pageSize ?? 15,
    transform: (values) => values[0] !== "local",
  });
}

export function renderSelectablePrompt(state: SelectState<unknown>): string {
  const visible = state.visibleOptions();
  const selectedSet = new Set(state.selected);
  const optionByValue = new Map(state.options.map((option) => [option.value, option]));
  const selectedSummary = state.selected.length
    ? state.selected.map((value) => optionByValue.get(value)?.label ?? value).join(", ")
    : "(none selected)";

  const lines = [
    `? ${state.message}`,
    `  Selected:  ${selectedSummary}`,
    `  Search: [${state.search || "type to filter"}]`,
    "  Up/Down navigate - Space toggle - Backspace remove - Enter confirm",
  ];

  if (visible.length === 0) {
    lines.push("  No matches");
  } else {
    const startIndex = Math.max(0, Math.min(state.cursor - Math.floor(state.pageSize / 2), visible.length - state.pageSize));
    const endIndex = Math.min(startIndex + state.pageSize, visible.length);
    const visiblePage = visible.slice(startIndex, endIndex);

    for (let i = 0; i < visiblePage.length; i++) {
      const option = visiblePage[i];
      const actualIndex = startIndex + i;
      const active = actualIndex === state.cursor;
      const selected = selectedSet.has(option.value);
      const pointer = active ? ">" : " ";
      const icon = selected ? "[x]" : "[ ]";
      const description = option.description ? ` (${option.description})` : "";
      const suffix = selected ? ` (${option.selectedSuffix ?? "selected"})` : description;
      lines.push(`  ${pointer} ${icon} ${option.label}${suffix}`);
    }

    if (visible.length > state.pageSize) {
      const currentPage = Math.floor(state.cursor / state.pageSize) + 1;
      const totalPages = Math.ceil(visible.length / state.pageSize);
      lines.push(`  (${currentPage}/${totalPages})`);
    }
  }

  if (state.error) lines.push(`  ${state.error}`);
  return lines.join("\n");
}

export function buildRuntimePromptText(): string {
  return renderSelectablePrompt(createRuntimePromptState());
}

export function parseRuntimeInput(answer: unknown): string[] {
  const input = (answer == null ? "" : String(answer)).trim() || "1";
  const choices = input.split(/[\s,]+/).filter(Boolean);
  if (choices.includes(ALL_RUNTIMES_CHOICE)) {
    return ALL_RUNTIMES.slice();
  }

  const selected: string[] = [];
  const seen = new Set<string>();
  const byChoice = new Map(RUNTIME_OPTIONS.map((option) => [option.choice, option.runtime]));
  for (const choice of choices) {
    const runtime = byChoice.get(choice);
    if (!runtime || seen.has(runtime)) continue;
    seen.add(runtime);
    selected.push(runtime);
  }

  return selected.length ? selected : ["claude"];
}

export function buildLocationPromptText(runtimes: string[]): string {
  return renderSelectablePrompt(createLocationPromptState(runtimes));
}

export function parseLocationInput(answer: unknown): boolean {
  const input = (answer == null ? "" : String(answer)).trim() || "1";
  return input !== "2";
}

let scriptedAnswers: string[] | undefined;

function readScriptedAnswer(question: string): string {
  process.stdout.write(question);
  if (!scriptedAnswers) {
    scriptedAnswers = fs.readFileSync(0, "utf8").split(/\r?\n/);
  }
  return scriptedAnswers.shift() ?? "";
}

function ask(question: string): Promise<string> {
  if (process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1" && !process.stdin.isTTY) {
    return Promise.resolve(readScriptedAnswer(question));
  }

  return new Promise<string>((resolve) => {
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

async function promptWithKeys<T>(state: SelectState<T>): Promise<T | string | undefined> {
  if (process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1" && !process.stdin.isTTY) {
    const answer = readScriptedAnswer(`${renderSelectablePrompt(state)}\n`);
    return answer;
  }

  return new Promise<T | undefined>((resolve) => {
    const input = process.stdin;
    const output = process.stdout;
    const wasRaw = input.isRaw;
    let renderedLines = 0;

    function render() {
      if (renderedLines > 0) {
        readline.moveCursor(output, 0, -renderedLines);
        readline.clearScreenDown(output);
      }
      const rendered = renderSelectablePrompt(state);
      output.write(rendered);
      output.write("\n");
      renderedLines = rendered.split("\n").length;
    }

    function cleanup() {
      input.off("keypress", onKeypress);
      if (input.isTTY) input.setRawMode(Boolean(wasRaw));
      input.pause();
    }

    function onKeypress(_str: string, key: { name?: string; ctrl?: boolean; sequence?: string; meta?: boolean }) {
      if (key?.ctrl && key.name === "c") {
        cleanup();
        output.write("\n");
        process.exitCode = 130;
        resolve(undefined);
        return;
      }
      if (key?.name === "return" || key?.name === "enter") {
        const value = state.confirm();
        render();
        if (value !== undefined) {
          cleanup();
          resolve(value);
        }
        return;
      }
      if (key?.name === "up") state.move(-1);
      else if (key?.name === "down") state.move(1);
      else if (key?.name === "space") state.toggle();
      else if (key?.name === "backspace") state.backspace();
      else {
        const ch = normalizeInputChar(key);
        if (ch) state.type(ch);
      }
      render();
    }

    readline.emitKeypressEvents(input);
    if (input.isTTY) input.setRawMode(true);
    input.resume();
    input.on("keypress", onKeypress);
    render();
  });
}

export async function promptRuntime(): Promise<string[]> {
  if (process.stdin.isTTY) {
    const selected = await promptWithKeys(createRuntimePromptState());
    return Array.isArray(selected) ? selected : ["claude"];
  }

  console.log(`${buildRuntimePromptText()}\n`);
  return parseRuntimeInput(await ask("Choice [1]: "));
}

export async function promptLocation(runtimes: string[]): Promise<boolean> {
  if (process.stdin.isTTY) {
    const selected = await promptWithKeys(createLocationPromptState(runtimes));
    return typeof selected === "boolean" ? selected : true;
  }

  console.log(`${buildLocationPromptText(runtimes)}\n`);
  return parseLocationInput(await ask("Choice [1]: "));
}
