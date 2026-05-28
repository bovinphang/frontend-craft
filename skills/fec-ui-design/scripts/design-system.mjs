#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(__dirname, "..");
const dataDir = path.join(skillDir, "data");

const productRules = readJson("product-rules.json");
const styleArchetypes = readJson("style-archetypes.json");
const uxQualityRules = readJson("ux-quality-rules.json");
const stackRules = readJson("stack-ui-rules.json");

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

function parseArgs(argv) {
  const result = {
    queryParts: [],
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
    else if (token === "--format") result.format = requireValue(argv, ++index, "--format");
    else if (token === "--project") result.project = requireValue(argv, ++index, "--project");
    else if (token === "--page") result.page = requireValue(argv, ++index, "--page");
    else if (token === "--stack") result.stack = requireValue(argv, ++index, "--stack");
    else if (token === "--output-dir") result.outputDir = requireValue(argv, ++index, "--output-dir");
    else result.queryParts.push(token);
  }

  if (!["markdown", "json"].includes(result.format)) {
    throw new Error(`Unsupported --format "${result.format}". Use markdown or json.`);
  }

  result.query = result.queryParts.join(" ").trim();
  return result;
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${flag}`);
  return value;
}

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

function chooseChecklist(tokens, product) {
  const priority = new Set(["accessibility", "interaction", "layout", "typography", "animation"]);
  if (product.id === "data-dashboard" || tokens.has("dashboard") || tokens.has("chart")) priority.add("charts");
  if (tokens.has("form") || tokens.has("booking") || tokens.has("checkout")) priority.add("forms");
  if (tokens.has("mobile") || tokens.has("app")) priority.add("navigation");
  if (tokens.has("performance") || tokens.has("canvas") || tokens.has("three")) priority.add("performance");

  return uxQualityRules
    .filter((rule) => priority.has(rule.id ?? rule.category))
    .map((rule) => ({
      id: rule.id ?? rule.category,
      label: rule.label ?? labelFromId(rule.category),
      checks: rule.checks.slice(0, 4),
    }));
}

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

function tokenize(value) {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter(Boolean),
  );
}

function score(tokens, keywords) {
  return keywords.reduce((total, keyword) => total + (tokens.has(slug(keyword)) || tokens.has(String(keyword).toLowerCase()) ? 1 : 0), 0);
}

function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeStack(value) {
  return value ? slug(value).replace(/-?js$/, "") : "";
}

function titleCase(value) {
  return String(value)
    .split(/\s+/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function labelFromId(value) {
  return String(value)
    .split("-")
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

main();
