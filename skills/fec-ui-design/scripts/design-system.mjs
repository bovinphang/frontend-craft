#!/usr/bin/env node
// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @typedef {{
 *   id: string;
 *   label?: string;
 *   keywords: string[];
 *   pattern?: string;
 *   patterns?: string[];
 *   risks: string[];
 *   style?: string;
 *   space?: string;
 *   components?: string[];
 *   motion: string;
 *   antiPatterns: string[];
 * }} ProductRule
 *
 * @typedef {{
 *   id: string;
 *   label?: string;
 *   keywords: string[];
 *   usage?: string;
 *   description?: string;
 *   risks?: string[];
 *   avoid?: string[];
 *   antiPatterns?: string[];
 *   tokens?: { density?: string };
 * }} StyleArchetype
 *
 * @typedef {{
 *   id?: string;
 *   category?: string;
 *   label?: string;
 *   checks: string[];
 * }} UxQualityRule
 *
 * @typedef {{
 *   stack: string;
 *   label?: string;
 *   keywords: string[];
 *   guidance: string[];
 * }} StackRule
 *
 * @typedef {{
 *   queryParts: string[];
 *   query: string;
 *   format: "markdown" | "json";
 *   project: string;
 *   page: string;
 *   stack: string;
 *   persist: boolean;
 *   outputDir: string;
 *   help: boolean;
 * }} CliArgs
 *
 * @typedef {{
 *   id: string;
 *   label: string;
 *   checks: string[];
 * }} ChecklistGroup
 *
 * @typedef {{
 *   project: string;
 *   page: string;
 *   query: string;
 *   product: { id: string; label: string; pattern: string; risks: string[] };
 *   style: { id: string; label: string; usage: string | undefined; risks: string[] };
 *   tokens: { color: string; typography: string; space: string; components: string[] };
 *   motion: string;
 *   chart: string;
 *   antiPatterns: string[];
 *   checklist: ChecklistGroup[];
 *   stackGuidance: StackRule | null;
 * }} Recommendation
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(__dirname, "..");
const dataDir = path.join(skillDir, "data");

const productRules = /** @type {ProductRule[]} */ (readJson("product-rules.json"));
const styleArchetypes = /** @type {StyleArchetype[]} */ (readJson("style-archetypes.json"));
const uxQualityRules = /** @type {UxQualityRule[]} */ (readJson("ux-quality-rules.json"));
const stackRules = /** @type {StackRule[]} */ (readJson("stack-ui-rules.json"));

/** @type {Record<string, string>} */
const colorDirections = {
  saas: "Neutral surfaces with a restrained trust accent, semantic status colors, and one operational highlight.",
  fintech: "Ink, graphite, and calm blue-green tokens with explicit success, risk, warning, and pending states.",
  healthcare: "Clean neutrals with soft clinical blues or greens, high contrast text, and sparing reassurance accents.",
  ecommerce: "Product-led neutrals, one conversion accent, clear price/status colors, and image-friendly backgrounds.",
  creative: "Flexible neutrals with a bolder accent system, gallery-safe surfaces, and controlled expressive moments.",
  wellness: "Warm off-white surfaces, botanical or mineral accents, calm confirmation colors, and low-glare contrast.",
  education: "Readable neutrals, progress color coding, friendly accents, and clear feedback colors.",
  gaming: "High-contrast surfaces, faction or mode accents, explicit danger/reward colors, and readable HUD tokens.",
  "data-dashboard": "Dense neutrals, chart-safe categorical palettes, alert colors with severity order, and subdued chrome.",
};

/** @type {Record<string, string>} */
const typographyDirections = {
  saas: "Use a workhorse sans for UI text, tabular numerals for metrics, and compact headings for scan speed.",
  fintech: "Use a precise sans with tabular numerals, conservative weights, and generous numeric spacing.",
  healthcare: "Use a highly legible sans, moderate line height, and calm heading contrast.",
  ecommerce: "Use readable product text, stronger merchandising headings, and stable price typography.",
  creative: "Pair a characterful display face with a reliable UI sans if the brand can support it.",
  wellness: "Use a soft humanist sans or restrained serif accent, with relaxed line height and readable controls.",
  education: "Use friendly readable type, clear hierarchy, and progress labels that survive small screens.",
  gaming: "Use expressive display only for short labels; keep gameplay, settings, and HUD text fast to parse.",
  "data-dashboard": "Use compact UI type, tabular numerals, and strict alignment for tables and charts.",
};

/** @type {Record<string, string>} */
const chartDirections = {
  saas: "Prefer KPI trends, cohort funnels, and status breakdowns with clear comparison periods.",
  fintech: "Use time-series, allocation, variance, and risk bands; disclose units and stale data states.",
  healthcare: "Use trends and thresholds carefully, avoid alarmist color, and keep clinical context beside charts.",
  ecommerce: "Use conversion funnels, product comparison, inventory status, and revenue trends.",
  creative: "Use portfolio analytics sparingly; prioritize visual inspection before metrics.",
  wellness: "Use booking, occupancy, habit, or progress views with gentle pacing and clear privacy boundaries.",
  education: "Use progress, completion, mastery, and assignment timelines with learner-friendly labels.",
  gaming: "Use leaderboards, loadouts, skill trees, and telemetry only when they support player decisions.",
  "data-dashboard": "Choose chart type by task: trend, compare, compose, distribute, correlate, or inspect anomalies.",
};

/**
 * @param {string} fileName
 * @returns {unknown}
 */
function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, fileName), "utf8"));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.query) {
    printUsage(args.help ? 0 : 1);
    return;
  }

  const recommendation = buildRecommendation(args);
  const output = args.format === "json" ? `${JSON.stringify(recommendation, null, 2)}\n` : renderMarkdown(recommendation);

  if (args.persist) persistRecommendation(recommendation, args);

  process.stdout.write(output);
}

/**
 * @param {string[]} argv
 * @returns {CliArgs}
 */
function parseArgs(argv) {
  /** @type {CliArgs} */
  const result = {
    queryParts: [],
    query: "",
    format: "markdown",
    project: "",
    page: "",
    stack: "",
    persist: false,
    outputDir: process.cwd(),
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") result.help = true;
    else if (token === "--persist") result.persist = true;
    else if (token === "--format") {
      const format = requireValue(argv, ++index, "--format");
      if (format !== "markdown" && format !== "json") {
        throw new Error(`Unsupported --format "${format}". Use markdown or json.`);
      }
      result.format = format;
    }
    else if (token === "--project") result.project = requireValue(argv, ++index, "--project");
    else if (token === "--page") result.page = requireValue(argv, ++index, "--page");
    else if (token === "--stack") result.stack = requireValue(argv, ++index, "--stack");
    else if (token === "--output-dir") result.outputDir = requireValue(argv, ++index, "--output-dir");
    else result.queryParts.push(token);
  }

  result.query = result.queryParts.join(" ").trim();
  return result;
}

/**
 * @param {string[]} argv
 * @param {number} index
 * @param {string} flag
 * @returns {string}
 */
function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${flag}`);
  return value;
}

/**
 * @param {number} exitCode
 * @returns {void}
 */
function printUsage(exitCode) {
  const usage = [
    'Usage: node skills/fec-ui-design/scripts/design-system.mjs "<query>" [options]',
    "",
    "Options:",
    "  --format markdown|json",
    "  --project <name>",
    "  --page <name>",
    "  --stack <stack>",
    "  --persist --output-dir <dir>",
    "",
  ].join("\n");
  process.stderr.write(usage);
  process.exitCode = exitCode;
}

/**
 * @param {CliArgs} args
 * @returns {Recommendation}
 */
function buildRecommendation(args) {
  const query = args.query;
  const tokens = tokenize([query, args.project, args.page, args.stack].filter(Boolean).join(" "));
  const product = chooseProduct(tokens);
  const style = chooseStyle(tokens, product);
  const checklist = chooseChecklist(tokens, product);
  const stackGuidance = chooseStack(args.stack, tokens);
  const pattern = product.pattern ?? product.patterns?.[0] ?? "Task-first interface with explicit states and durable visual hierarchy";

  return {
    project: args.project || titleCase(query),
    page: args.page || "",
    query,
    product: {
      id: product.id,
      label: product.label ?? labelFromId(product.id),
      pattern,
      risks: product.risks,
    },
    style: {
      id: style.id,
      label: style.label ?? labelFromId(style.id),
      usage: style.usage ?? style.description,
      risks: style.risks ?? style.avoid ?? [],
    },
    tokens: {
      color: colorDirections[product.id] ?? colorDirections.saas,
      typography: typographyDirections[product.id] ?? typographyDirections.saas,
      space: product.space ?? style.tokens?.density ?? "Match task density to user scan depth and touch requirements.",
      components: product.components ?? ["Use existing components before adding new primitives", "Tokenize repeated spacing, color, radius, and state choices"],
    },
    motion: product.motion,
    chart: chartDirections[product.id] ?? chartDirections["data-dashboard"],
    antiPatterns: unique([...product.antiPatterns, ...(style.antiPatterns ?? style.avoid ?? [])]).slice(0, 8),
    checklist,
    stackGuidance,
  };
}

/**
 * @param {Set<string>} tokens
 * @returns {ProductRule}
 */
function chooseProduct(tokens) {
  let best = productRules[0];
  let bestScore = -1;

  for (const product of productRules) {
    const keywordScore = score(tokens, [...product.keywords, product.id, product.label ?? ""]);
    const intentScore = tokens.has(slug(product.pattern)) ? 1 : 0;
    const total = keywordScore + intentScore;
    if (total > bestScore) {
      best = product;
      bestScore = total;
    }
  }

  return best;
}

/**
 * @param {Set<string>} tokens
 * @param {ProductRule} product
 * @returns {StyleArchetype}
 */
function chooseStyle(tokens, product) {
  const preferred = styleArchetypes.find((style) => style.id === product.style);
  let best = preferred ?? styleArchetypes[0];
  let bestScore = preferred ? 1 : 0;

  for (const style of styleArchetypes) {
    const total = score(tokens, [style.id, style.label, ...style.keywords]);
    if (total > bestScore) {
      best = style;
      bestScore = total;
    }
  }

  return best;
}

/**
 * @param {Set<string>} tokens
 * @param {ProductRule} product
 * @returns {ChecklistGroup[]}
 */
function chooseChecklist(tokens, product) {
  const priority = new Set(["accessibility", "interaction", "layout", "typography", "animation"]);
  if (product.id === "data-dashboard" || tokens.has("dashboard") || tokens.has("chart")) priority.add("charts");
  if (tokens.has("form") || tokens.has("booking") || tokens.has("checkout")) priority.add("forms");
  if (tokens.has("mobile") || tokens.has("app")) priority.add("navigation");
  if (tokens.has("performance") || tokens.has("canvas") || tokens.has("three")) priority.add("performance");

  return uxQualityRules
    .filter((rule) => {
      const id = rule.id ?? rule.category;
      return id ? priority.has(id) : false;
    })
    .map((rule) => {
      const id = rule.id ?? rule.category ?? "general";
      return {
        id,
        label: rule.label ?? labelFromId(id),
        checks: rule.checks.slice(0, 4),
      };
    });
}

/**
 * @param {string} stack
 * @param {Set<string>} tokens
 * @returns {StackRule | null}
 */
function chooseStack(stack, tokens) {
  const desired = normalizeStack(stack);
  const direct = desired
    ? stackRules.find((rule) => normalizeStack(rule.stack) === desired || rule.keywords.some((keyword) => normalizeStack(keyword) === desired))
    : undefined;
  if (direct) return direct;

  for (const rule of stackRules) {
    if ([rule.stack, ...rule.keywords].some((alias) => {
      const normalized = slug(alias);
      if (normalized === "spa" || normalized.length < 3) return false;
      return tokens.has(normalized) || tokens.has(String(alias).toLowerCase());
    })) return rule;
  }

  return null;
}

/**
 * @param {Recommendation} model
 * @returns {string}
 */
function renderMarkdown(model) {
  const lines = [
    `# Design System Recommendation: ${model.project}`,
    "",
    `- Product category: ${model.product.label} (${model.product.id})`,
    `- Recommended pattern: ${model.product.pattern}`,
    `- Style archetype: ${model.style.label} (${model.style.id})`,
    "",
    "## Token Direction",
    "",
    `- Color: ${model.tokens.color}`,
    `- Typography: ${model.tokens.typography}`,
    `- Space: ${model.tokens.space}`,
    `- Components: ${model.tokens.components.join("; ")}`,
    "",
    "## Motion Guidance",
    "",
    model.motion,
    "",
    "## Chart Guidance",
    "",
    model.chart,
    "",
    "## Anti-Patterns",
    "",
    ...model.antiPatterns.map((item) => `- ${item}`),
    "",
    "## Pre-Delivery Checklist",
    "",
    ...model.checklist.flatMap((group) => [`### ${group.label}`, "", ...group.checks.map((check) => `- ${check}`), ""]),
  ];

  if (model.stackGuidance) {
    lines.push("## Stack UI Guidance", "");
    lines.push(`- Stack: ${model.stackGuidance.label ?? labelFromId(model.stackGuidance.stack)} (${model.stackGuidance.stack})`);
    lines.push(...model.stackGuidance.guidance.map((item) => `- ${item}`), "");
  }

  return `${lines.join("\n")}\n`;
}

/**
 * @param {Recommendation} model
 * @returns {string}
 */
function renderPageOverride(model) {
  const pageName = model.page || "page";
  return [
    `# Page Override: ${pageName}`,
    "",
    `Master: ../MASTER.md`,
    `Product category: ${model.product.label} (${model.product.id})`,
    "",
    "## Page Intent",
    "",
    `Use the Master direction, then adapt layout and component density for ${pageName}. Keep overrides narrow and delete any rule that merely repeats the Master.`,
    "",
    "## Override Strategy",
    "",
    `- Primary pattern: ${model.product.pattern}`,
    `- Visual emphasis: ${model.style.usage}`,
    `- Chart behavior: ${model.chart}`,
    "",
    "## State QA",
    "",
    "- Loading, empty, error, disabled, hover, focus, selected, and reduced-motion states are visible.",
    "- Mobile, tablet, and desktop layouts preserve task order and readable tap targets.",
    "",
  ].join("\n");
}

/**
 * @param {Recommendation} model
 * @param {CliArgs} args
 * @returns {void}
 */
function persistRecommendation(model, args) {
  const projectSlug = slug(args.project || model.project || "project");
  const projectDir = path.join(path.resolve(args.outputDir), "design-system", projectSlug);
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(path.join(projectDir, "MASTER.md"), renderMarkdown(model), "utf8");

  if (args.page) {
    const pagesDir = path.join(projectDir, "pages");
    fs.mkdirSync(pagesDir, { recursive: true });
    fs.writeFileSync(path.join(pagesDir, `${slug(args.page)}.md`), renderPageOverride(model), "utf8");
  }
}

/**
 * @param {string} value
 * @returns {Set<string>}
 */
function tokenize(value) {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter(Boolean),
  );
}

/**
 * @param {Set<string>} tokens
 * @param {Array<string | undefined>} keywords
 * @returns {number}
 */
function score(tokens, keywords) {
  return keywords.reduce((total, keyword) => total + (tokens.has(slug(keyword)) || tokens.has(String(keyword).toLowerCase()) ? 1 : 0), 0);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeStack(value) {
  return value ? slug(value).replace(/-?js$/, "") : "";
}

/**
 * @param {string} value
 * @returns {string}
 */
function titleCase(value) {
  return String(value)
    .split(/\s+/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

/**
 * @param {Array<string | undefined | null | false>} values
 * @returns {string[]}
 */
function unique(values) {
  /** @type {string[]} */
  const strings = [];
  for (const value of values) {
    if (typeof value === "string" && value.length > 0) strings.push(value);
  }
  return [...new Set(strings)];
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function labelFromId(value) {
  return String(value)
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

main();
