import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

type SkillMetadata = {
  id: string;
  category: string;
  version: string;
  license: string;
  homepage: string;
  repository: string;
  summary: string;
  tags: string[];
  keywords: string[];
  platforms: string[];
};

type EvalQueries = Record<string, { should_trigger: unknown[]; should_not_trigger: unknown[] }>;

type SkillRelation = {
  relatedSkills?: string[];
  boundaryWorkflows?: string[];
  capabilityTags?: string[];
};

type SkillRelations = Record<string, SkillRelation>;

test("skills metadata matches skill directories and frontmatter names", () => {
  const skillsDir = path.join(root, "skills");
  const metadata = JSON.parse(fs.readFileSync(path.join(skillsDir, "metadata.json"), "utf8")) as SkillMetadata[];
  const skillDirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const metadataNames = metadata.map((skill) => skill.id).sort();
  assert.deepEqual(metadataNames, skillDirs);

  for (const dir of skillDirs) {
    const body = fs.readFileSync(path.join(skillsDir, dir, "SKILL.md"), "utf8");
    assert.notEqual(body.charCodeAt(0), 0xfeff, `skill must be UTF-8 without BOM: ${dir}`);
    const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(frontmatter, `missing frontmatter: ${dir}`);
    assert.match(frontmatter[1], new RegExp(`^name:\\s*${escapeRegExp(dir)}$`, "m"));
    assert.match(frontmatter[1], /^description:\s*Use when\b/m);
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1] ?? "";
    assert.ok(description.length > 0, `missing description: ${dir}`);
    assert.ok(description.length < 1024, `description should stay under 1024 characters: ${dir}`);
    const frontmatterKeys = [...frontmatter[1].matchAll(/^([A-Za-z0-9_-]+):/gm)].map((match) => match[1]).sort();
    assert.deepEqual(frontmatterKeys, ["description", "name"]);
    assert.ok(body.split(/\r?\n/).length <= 500, `skill body should stay under 500 lines: ${dir}`);
    assertNoDuplicateHeadingPair(body, dir, "When to Use", "使用说明");
    assertNoDuplicateHeadingPair(body, dir, "Expected Output", "输出要求");
    assertNoDuplicateHeadingPair(body, dir, "输出格式", "Expected Output");

    for (const reference of body.matchAll(/\]\((references\/[^)]+)\)/g)) {
      const referencePath = path.join(skillsDir, dir, reference[1]);
      assert.ok(fs.existsSync(referencePath), `missing referenced skill file: ${dir}/${reference[1]}`);
    }
  }
});

test("skills metadata uses the public taxonomy categories", () => {
  const metadata = JSON.parse(fs.readFileSync(path.join(root, "skills", "metadata.json"), "utf8")) as SkillMetadata[];
  const allowedCategories = new Set([
    "project-standard",
    "implementation-capability",
    "testing",
    "review-quality",
    "design-ui",
    "legacy-migration",
    "maintenance-docs",
  ]);

  for (const skill of metadata) {
    assert.ok(allowedCategories.has(skill.category), `unexpected skill category for ${skill.id}: ${skill.category}`);
  }
});

test("skill relations are structured and point only to existing skills", () => {
  const skillsDir = path.join(root, "skills");
  const metadata = JSON.parse(fs.readFileSync(path.join(skillsDir, "metadata.json"), "utf8")) as SkillMetadata[];
  const relations = JSON.parse(fs.readFileSync(path.join(skillsDir, "relations.json"), "utf8")) as SkillRelations;
  const skillIds = new Set(metadata.map((skill) => skill.id));
  const allowedKeys = new Set(["relatedSkills", "boundaryWorkflows", "capabilityTags"]);

  for (const [skillId, relation] of Object.entries(relations)) {
    assert.ok(skillIds.has(skillId), `unknown relation skill id: ${skillId}`);
    assert.ok(!("relatedAgents" in relation), `relations must not include relatedAgents: ${skillId}`);

    for (const key of Object.keys(relation)) {
      assert.ok(allowedKeys.has(key), `unsupported relation field ${skillId}.${key}`);
    }

    if (relation.relatedSkills !== undefined) {
      assertStringArray(relation.relatedSkills, `${skillId}.relatedSkills`);
      for (const relatedSkill of relation.relatedSkills) {
        assert.ok(skillIds.has(relatedSkill), `unknown related skill ${relatedSkill} in ${skillId}`);
      }
    }

    if (relation.boundaryWorkflows !== undefined) {
      assertStringArray(relation.boundaryWorkflows, `${skillId}.boundaryWorkflows`);
    }

    assertStringArray(relation.capabilityTags, `${skillId}.capabilityTags`);
  }
});

test("agent frontmatter skills point only to existing skills", () => {
  const skillsDir = path.join(root, "skills");
  const metadata = JSON.parse(fs.readFileSync(path.join(skillsDir, "metadata.json"), "utf8")) as SkillMetadata[];
  const skillIds = new Set(metadata.map((skill) => skill.id));
  const agentFiles = fs
    .readdirSync(path.join(root, "agents"))
    .filter((name) => name.endsWith(".md"))
    .sort();

  for (const agentFile of agentFiles) {
    const body = fs.readFileSync(path.join(root, "agents", agentFile), "utf8");
    for (const skillId of extractAgentSkills(body)) {
      assert.ok(skillIds.has(skillId), `${agentFile} references unknown skill: ${skillId}`);
    }
  }
});

test("skill bodies do not contain agent backlinks or package-external skill links", () => {
  const skillsDir = path.join(root, "skills");
  const skillDirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const dir of skillDirs) {
    const body = fs.readFileSync(path.join(skillsDir, dir, "SKILL.md"), "utf8");
    assert.doesNotMatch(body, /^## Related Skills \/ Boundary$/m, `${dir} contains Related Skills / Boundary`);
    assert.doesNotMatch(body, /^## 相关技能$/m, `${dir} contains related skills section`);
    assert.doesNotMatch(body, /^## 与子代理的配合$/m, `${dir} contains subagent coordination section`);
    assert.doesNotMatch(body, /^## Related Agent$/m, `${dir} contains Related Agent`);
    assert.doesNotMatch(body, /\]\(\.\.\/\.\.\/agents\//, `${dir} links to ../../agents`);
    assert.doesNotMatch(body, /\]\(\.\.\/agents\//, `${dir} links to ../agents`);
    assert.doesNotMatch(body, /\]\(\.\.\/\.\.\/skills\//, `${dir} links to ../../skills`);
    assert.doesNotMatch(body, /\]\(\.\.\/skills\//, `${dir} links to ../skills`);
    assert.doesNotMatch(body, /`fec-[a-z0-9-]+`/, `${dir} contains inline skill or agent id navigation`);
    assert.doesNotMatch(
      body,
      /[「『“"]fec-[a-z0-9-]+[」』”"]\s*(?:skill|技能)/,
      `${dir} contains quoted skill id navigation`,
    );
  }
});

test("skills metadata includes standalone publish fields", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")) as {
    version: string;
    license: string;
    homepage: string;
    repository: { url: string };
  };
  const metadata = JSON.parse(fs.readFileSync(path.join(root, "skills", "metadata.json"), "utf8")) as SkillMetadata[];
  const expectedPlatforms = ["skills-cli", "skillreg", "claude-code", "codex", "cursor", "opencode", "openclaw", "generic-skill-runtime"];

  for (const skill of metadata) {
    assert.equal(skill.version, pkg.version, `version should follow package.json: ${skill.id}`);
    assert.equal(skill.license, pkg.license, `license should follow package.json: ${skill.id}`);
    assert.equal(skill.homepage, pkg.homepage, `homepage should follow package.json: ${skill.id}`);
    assert.equal(skill.repository, pkg.repository.url, `repository should follow package.json: ${skill.id}`);
    assert.equal(typeof skill.summary, "string", `missing summary: ${skill.id}`);
    assert.ok(skill.summary.length > 0, `empty summary: ${skill.id}`);
    assert.ok(Array.isArray(skill.tags), `missing tags: ${skill.id}`);
    assert.ok(skill.tags.length > 0, `empty tags: ${skill.id}`);
    assert.ok(Array.isArray(skill.keywords), `missing keywords: ${skill.id}`);
    assert.ok(skill.keywords.includes(skill.category), `keywords should include category: ${skill.id}`);
    for (const tag of skill.tags) {
      assert.ok(skill.keywords.includes(tag), `keywords should include tag ${tag}: ${skill.id}`);
    }
    assert.deepEqual(skill.platforms, expectedPlatforms, `platforms mismatch: ${skill.id}`);
  }
});

test("skill trigger eval queries cover every skill with positive and negative examples", () => {
  const skillsDir = path.join(root, "skills");
  const metadata = JSON.parse(fs.readFileSync(path.join(skillsDir, "metadata.json"), "utf8")) as SkillMetadata[];
  const evalQueries = JSON.parse(fs.readFileSync(path.join(skillsDir, "eval_queries.json"), "utf8")) as EvalQueries;

  assert.deepEqual(Object.keys(evalQueries).sort(), metadata.map((skill) => skill.id).sort());

  for (const skill of metadata) {
    const queries = evalQueries[skill.id];
    assert.ok(Array.isArray(queries.should_trigger), `missing should_trigger: ${skill.id}`);
    assert.ok(Array.isArray(queries.should_not_trigger), `missing should_not_trigger: ${skill.id}`);
    assert.ok(queries.should_trigger.length >= 8, `not enough positive eval queries: ${skill.id}`);
    assert.ok(queries.should_not_trigger.length >= 8, `not enough negative eval queries: ${skill.id}`);
  }
});

test("marketplace skill count matches skills directory count", () => {
  const skillCount = fs
    .readdirSync(path.join(root, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).length;
  const marketplace = JSON.parse(
    fs.readFileSync(path.join(root, ".claude-plugin", "marketplace.json"), "utf8"),
  ) as { plugins: Array<{ description: string }> };
  const description = marketplace.plugins[0].description;
  assert.match(description, new RegExp(`${skillCount} skills`));
});

test("public metadata versions follow package.json", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")) as { version: string };
  const plugin = JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf8")) as {
    version: string;
  };
  const marketplace = JSON.parse(
    fs.readFileSync(path.join(root, ".claude-plugin", "marketplace.json"), "utf8"),
  ) as { plugins: Array<{ version: string }> };
  const openclaw = JSON.parse(fs.readFileSync(path.join(root, "openclaw.plugin.json"), "utf8")) as {
    version: string;
  };

  assert.equal(plugin.version, pkg.version);
  assert.equal(marketplace.plugins[0].version, pkg.version);
  assert.equal(openclaw.version, pkg.version);

  const skills = JSON.parse(fs.readFileSync(path.join(root, "skills", "metadata.json"), "utf8")) as SkillMetadata[];
  for (const skill of skills) {
    assert.equal(skill.version, pkg.version);
  }
});

test("tracked source and docs do not contain mojibake markers", () => {
  const mojibakeMarkers = [`${String.fromCharCode(0x9225)}?`, String.fromCharCode(0xfffd)];
  const files = collectFiles(root).filter((file) => {
    const rel = path.relative(root, file);
    return (
      !rel.startsWith(`dist${path.sep}`) &&
      !rel.startsWith(`node_modules${path.sep}`) &&
      !rel.startsWith(`.git${path.sep}`) &&
      !rel.startsWith(`.claude${path.sep}`) &&
      !rel.startsWith(`.codex${path.sep}`) &&
      !rel.startsWith(`npm-packages${path.sep}`) &&
      !rel.startsWith(`skill-packages${path.sep}`) &&
      /\.(ts|md|json|toml)$/.test(file)
    );
  });

  for (const file of files) {
    const body = fs.readFileSync(file, "utf8");
    for (const marker of mojibakeMarkers) {
      assert.ok(!body.includes(marker), `mojibake marker found in ${path.relative(root, file)}`);
    }
    assert.notEqual(body.charCodeAt(0), 0xfeff, `file must be UTF-8 without BOM: ${path.relative(root, file)}`);
  }
});

test("README skill tree uses fec-prefixed public skill directories", () => {
  const docs = [
    "README.md",
    "README.zh-CN.md",
    path.join("docs", "zh-TW", "README.md"),
    path.join("docs", "ja-JP", "README.md"),
    path.join("docs", "ko-KR", "README.md"),
  ];
  const legacyNames = [
    "frontend-code-review/",
    "accessibility-check/",
    "validation-fix/",
    "legacy-web-standard/",
    "testing-strategy/",
    "e2e-testing/",
    "nextjs-project-standard/",
    "nuxt-project-standard/",
    "monorepo-project-standard/",
    "data-fetching/",
    "form-handling/",
    "route-protection/",
    "component-testing/",
    "pwa-implementation/",
    "web-workers/",
    "canvas-threejs/",
    "svg-animation/",
  ];

  for (const doc of docs) {
    const body = fs.readFileSync(path.join(root, doc), "utf8");
    for (const legacyName of legacyNames) {
      assert.doesNotMatch(body, new RegExp(`\\|--\\s+${escapeRegExp(legacyName)}`), `${doc} uses ${legacyName}`);
    }
  }
});

test("Claude docs describe one active plugin source instead of recommending dual installs", () => {
  const docs = [
    "README.md",
    "README.zh-CN.md",
    path.join("docs", "runtimes", "claude.md"),
    path.join("docs", "runtimes", "claude.zh-CN.md"),
  ];

  for (const doc of docs) {
    const body = fs.readFileSync(path.join(root, doc), "utf8");
    assert.doesNotMatch(body, /instead of \(or in addition to\) the CLI/, `${doc} recommends dual installs`);
    assert.doesNotMatch(body, /可与 CLI 并存/, `${doc} recommends dual installs`);
  }

  const englishClaude = fs.readFileSync(path.join(root, "docs", "runtimes", "claude.md"), "utf8");
  const chineseClaude = fs.readFileSync(path.join(root, "docs", "runtimes", "claude.zh-CN.md"), "utf8");
  assert.match(englishClaude, /single plugin loader/);
  assert.match(englishClaude, /not a second plugin install/);
  assert.match(chineseClaude, /唯一加载来源/);
  assert.match(chineseClaude, /不是第二次安装插件本体/);
});

test("fec-init mentions every shared rule copied by the command", () => {
  const rules = fs
    .readdirSync(path.join(root, "templates", "shared", "rules"))
    .filter((name) => name.endsWith(".md"))
    .sort();
  const command = fs.readFileSync(path.join(root, "commands", "fec-init.md"), "utf8");

  for (const rule of rules) {
    assert.match(command, new RegExp(`templates/shared/rules/${escapeRegExp(rule)}`));
  }
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertNoDuplicateHeadingPair(body: string, dir: string, left: string, right: string): void {
  const hasLeft = new RegExp(`^##\\s+${escapeRegExp(left)}$`, "m").test(body);
  const hasRight = new RegExp(`^##\\s+${escapeRegExp(right)}$`, "m").test(body);
  assert.ok(!(hasLeft && hasRight), `duplicate skill sections should be merged in ${dir}: ${left} + ${right}`);
}

function assertStringArray(value: unknown, label: string): asserts value is string[] {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  assert.ok(value.length > 0, `${label} must not be empty`);
  for (const entry of value) {
    assert.equal(typeof entry, "string", `${label} entries must be strings`);
    assert.ok(entry.length > 0, `${label} entries must not be empty`);
  }
}

function extractAgentSkills(body: string): string[] {
  const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return [];

  const skillsBlock = frontmatter[1].match(/^skills:\r?\n((?:\s+-\s+.+\r?\n?)+)/m)?.[1];
  if (!skillsBlock) return [];

  return [...skillsBlock.matchAll(/^\s+-\s+(.+)$/gm)].map((match) => match[1].trim()).filter(Boolean);
}

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(file));
    else out.push(file);
  }
  return out;
}
