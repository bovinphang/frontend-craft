#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'targets.manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

for (const target of manifest.targets) {
  const artifactDir = path.join(root, target.artifactPath);
  await mkdir(artifactDir, { recursive: true });

  const metadata = {
    target: target.id,
    minCompatibleVersion: target.minCompatibleVersion,
    conversionRules: target.conversionRules,
    source: manifest.defaults.source,
    generatedFrom: 'targets.manifest.json'
  };

  await writeFile(
    path.join(artifactDir, 'target.generated.json'),
    `${JSON.stringify(metadata, null, 2)}\n`,
    'utf8'
  );
}

console.log(`Generated ${manifest.targets.length} target artifacts from targets.manifest.json`);
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const agentsDir = path.join(repoRoot, "agents");
const skillsDir = path.join(repoRoot, "skills");

const args = process.argv.slice(2);
const targetFlagIndex = args.indexOf("--target");
const target =
  targetFlagIndex >= 0 && args[targetFlagIndex + 1]
    ? args[targetFlagIndex + 1]
    : "codex";

const targetPaths = {
  codex: ".dist/codex/.codex",
  openclaw: ".dist/openclaw/.openclaw",
  claude: ".dist/claude/.claude",
  cursor: ".dist/cursor/.cursor",
  copilot: ".dist/copilot/.github/copilot",
};

if (!targetPaths[target]) {
  console.error(
    `Unsupported target \"${target}\". Supported: ${Object.keys(targetPaths).join(", ")}`,
  );
  process.exit(1);
}

const outputRoot = process.env.OUTPUT_DIR
  ? path.resolve(process.cwd(), process.env.OUTPUT_DIR)
  : path.join(repoRoot, targetPaths[target]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function escTomlBasic(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function parseFrontmatter(md, fileName) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing frontmatter in ${fileName}`);
  }
  const fm = match[1];
  const body = match[2].trim();
  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (!name) {
    throw new Error(`Missing name in frontmatter for ${fileName}`);
  }
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "";
  return { name, description, body };
}

function buildCodexAgents(baseDir) {
  const outAgentsDir = path.join(baseDir, "agents");
  ensureDir(outAgentsDir);
  const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(agentsDir, file), "utf8");
    const { name, description, body } = parseFrontmatter(raw, file);
    const normalized = body
      .replace(/\.claude\/rules/g, ".codex/rules")
      .replace(/\bCLAUDE\.md\b/g, "AGENTS.md");

    const toml =
      `name = "${escTomlBasic(name)}"\n` +
      `description = "${escTomlBasic(description)}"\n\n` +
      `model = "gpt-5.4"\n` +
      `model_reasoning_effort = "high"\n\n` +
      `developer_instructions = """\n${normalized}\n"""\n`;

    const outFile = path.join(outAgentsDir, file.replace(/\.md$/, ".toml"));
    fs.writeFileSync(outFile, toml, "utf8");
    console.log(`wrote ${path.relative(repoRoot, outFile)}`);
  }
}

function buildSkills(baseDir) {
  const outSkillsDir = path.join(baseDir, "skills");
  ensureDir(outSkillsDir);
  const skillFolders = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const skill of skillFolders) {
    const src = path.join(skillsDir, skill, "SKILL.md");
    if (!fs.existsSync(src)) continue;
    const destDir = path.join(outSkillsDir, skill);
    ensureDir(destDir);
    fs.copyFileSync(src, path.join(destDir, "SKILL.md"));
    console.log(`wrote ${path.relative(repoRoot, path.join(destDir, "SKILL.md"))}`);
  }
}

ensureDir(outputRoot);
buildSkills(outputRoot);
if (target === "codex" || target === "openclaw") {
  buildCodexAgents(outputRoot);
}

console.log(`build target: ${target}`);
console.log(`output dir: ${path.relative(repoRoot, outputRoot) || "."}`);
