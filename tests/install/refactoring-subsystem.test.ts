import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertExists(relativePath: string): void {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `missing: ${relativePath}`);
}

function extractIds(body: string, prefix: "SMELL-" | "RF-"): string[] {
  return [...body.matchAll(new RegExp(`\\b(${prefix}[A-Z0-9-]+)\\b`, "g"))]
    .map((match) => match[1])
    .filter((value, index, values) => values.indexOf(value) === index);
}

function assertRelativeMarkdownLinksResolve(relativePath: string): void {
  const body = read(relativePath);
  const base = path.dirname(path.join(root, relativePath));
  for (const match of body.matchAll(/\]\(([^)#]+\.md)(?:#[^)]+)?\)/g)) {
    assert.ok(fs.existsSync(path.resolve(base, match[1])), `${relativePath} -> ${match[1]}`);
  }
}

test("refactoring core and validation skills expose the safety contract", () => {
  const required = [
    "skills/fec-refactoring/SKILL.md",
    "skills/fec-refactoring/references/principles.md",
    "skills/fec-refactoring/references/workflow.md",
    "skills/fec-refactoring/references/when-to-refactor.md",
    "skills/fec-refactoring/references/refactoring-vs-feature-change.md",
    "skills/fec-refactoring-validation/SKILL.md",
    "skills/fec-refactoring-validation/references/behavior-preservation.md",
    "skills/fec-refactoring-validation/references/refactoring-test-checklist.md",
    "localized/zh-CN/skills/fec-refactoring/SKILL.md",
    "localized/zh-CN/skills/fec-refactoring-validation/SKILL.md",
  ];
  for (const file of required) assertExists(file);

  const core = read("skills/fec-refactoring/SKILL.md");
  assert.match(core, /Behavior Preservation/);
  assert.match(core, /Green Baseline First/);
  assert.match(core, /One Refactoring at a Time/);
  assert.match(core, /Verify Every Step/);
  assert.match(core, /Revert Before Repairing/);
  assert.match(core, /Diff Budget/);
  assert.match(core, /GREEN → REFACTOR → GREEN/);

  const zhCore = read("localized/zh-CN/skills/fec-refactoring/SKILL.md");
  assert.match(zhCore, /行为保持/);
  assert.match(zhCore, /差异预算/);
  assert.match(zhCore, /GREEN → REFACTOR → GREEN/);

  assertRelativeMarkdownLinksResolve("skills/fec-refactoring/SKILL.md");
  assertRelativeMarkdownLinksResolve("skills/fec-refactoring-validation/SKILL.md");
});

const canonicalSmellIds = [
  "SMELL-MYSTERIOUS-NAME",
  "SMELL-DUPLICATED-CODE",
  "SMELL-LONG-FUNCTION",
  "SMELL-LONG-PARAMETER-LIST",
  "SMELL-GLOBAL-DATA",
  "SMELL-MUTABLE-DATA",
  "SMELL-DIVERGENT-CHANGE",
  "SMELL-SHOTGUN-SURGERY",
  "SMELL-FEATURE-ENVY",
  "SMELL-DATA-CLUMPS",
  "SMELL-PRIMITIVE-OBSESSION",
  "SMELL-REPEATED-SWITCHES",
  "SMELL-LOOPS",
  "SMELL-LAZY-ELEMENT",
  "SMELL-SPECULATIVE-GENERALITY",
  "SMELL-TEMPORARY-FIELD",
  "SMELL-MESSAGE-CHAINS",
  "SMELL-MIDDLE-MAN",
  "SMELL-INSIDER-TRADING",
  "SMELL-LARGE-CLASS",
  "SMELL-ALTERNATIVE-CLASSES-DIFFERENT-INTERFACES",
  "SMELL-DATA-CLASS",
  "SMELL-REFUSED-BEQUEST",
  "SMELL-COMMENTS",
] as const;

test("code smell catalog contains exactly 24 canonical smells", () => {
  const rootCatalog = read("skills/fec-code-smells/references/smell-catalog.md");
  const zhCatalog = read("localized/zh-CN/skills/fec-code-smells/references/smell-catalog.md");

  assert.deepEqual(extractIds(rootCatalog, "SMELL-").sort(), [...canonicalSmellIds].sort());
  assert.deepEqual(extractIds(zhCatalog, "SMELL-").sort(), [...canonicalSmellIds].sort());

  const map = read("skills/fec-code-smells/references/smell-to-refactoring-map.md");
  for (const smellId of canonicalSmellIds) {
    assert.match(map, new RegExp(`\\b${smellId}\\b`));
  }

  const detection = read("skills/fec-code-smells/references/detection-guide.md");
  assert.match(detection, /LOC alone does not prove Long Function or Large Class/);
  assert.match(detection, /One switch does not prove Repeated Switches/);
  assert.match(detection, /Comments are not defects by themselves/);
});

const canonicalRefactoringIds = [
  "RF-EXTRACT-FUNCTION", "RF-INLINE-FUNCTION", "RF-EXTRACT-VARIABLE", "RF-INLINE-VARIABLE",
  "RF-CHANGE-FUNCTION-DECLARATION", "RF-ENCAPSULATE-VARIABLE", "RF-RENAME-VARIABLE",
  "RF-INTRODUCE-PARAMETER-OBJECT", "RF-COMBINE-FUNCTIONS-INTO-CLASS",
  "RF-COMBINE-FUNCTIONS-INTO-TRANSFORM", "RF-SPLIT-PHASE",
  "RF-ENCAPSULATE-RECORD", "RF-ENCAPSULATE-COLLECTION", "RF-REPLACE-PRIMITIVE-WITH-OBJECT",
  "RF-REPLACE-TEMP-WITH-QUERY", "RF-EXTRACT-CLASS", "RF-INLINE-CLASS", "RF-HIDE-DELEGATE",
  "RF-REMOVE-MIDDLE-MAN", "RF-SUBSTITUTE-ALGORITHM",
  "RF-MOVE-FUNCTION", "RF-MOVE-FIELD", "RF-MOVE-STATEMENTS-INTO-FUNCTION",
  "RF-MOVE-STATEMENTS-TO-CALLERS", "RF-REPLACE-INLINE-CODE-WITH-FUNCTION-CALL",
  "RF-SLIDE-STATEMENTS", "RF-SPLIT-LOOP", "RF-REPLACE-LOOP-WITH-PIPELINE", "RF-REMOVE-DEAD-CODE",
  "RF-SPLIT-VARIABLE", "RF-RENAME-FIELD", "RF-REPLACE-DERIVED-VARIABLE-WITH-QUERY",
  "RF-CHANGE-REFERENCE-TO-VALUE", "RF-CHANGE-VALUE-TO-REFERENCE",
  "RF-DECOMPOSE-CONDITIONAL", "RF-CONSOLIDATE-CONDITIONAL-EXPRESSION",
  "RF-REPLACE-NESTED-CONDITIONAL-WITH-GUARD-CLAUSES", "RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM",
  "RF-INTRODUCE-SPECIAL-CASE", "RF-INTRODUCE-ASSERTION",
  "RF-SEPARATE-QUERY-FROM-MODIFIER", "RF-PARAMETERIZE-FUNCTION", "RF-REMOVE-FLAG-ARGUMENT",
  "RF-PRESERVE-WHOLE-OBJECT", "RF-REPLACE-PARAMETER-WITH-QUERY", "RF-REPLACE-QUERY-WITH-PARAMETER",
  "RF-REMOVE-SETTING-METHOD", "RF-REPLACE-CONSTRUCTOR-WITH-FACTORY-FUNCTION",
  "RF-REPLACE-FUNCTION-WITH-COMMAND", "RF-REPLACE-COMMAND-WITH-FUNCTION",
  "RF-PULL-UP-METHOD", "RF-PULL-UP-FIELD", "RF-PULL-UP-CONSTRUCTOR-BODY", "RF-PUSH-DOWN-METHOD",
  "RF-PUSH-DOWN-FIELD", "RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES", "RF-REMOVE-SUBCLASS",
  "RF-EXTRACT-SUPERCLASS", "RF-COLLAPSE-HIERARCHY", "RF-REPLACE-SUBCLASS-WITH-DELEGATE",
  "RF-REPLACE-SUPERCLASS-WITH-DELEGATE",
] as const;

test("refactoring catalog indexes exactly 61 canonical techniques", () => {
  const rootIndex = read("skills/fec-refactoring-catalog/references/catalog-index.md");
  const zhIndex = read("localized/zh-CN/skills/fec-refactoring-catalog/references/catalog-index.md");
  assert.deepEqual(extractIds(rootIndex, "RF-").sort(), [...canonicalRefactoringIds].sort());
  assert.deepEqual(extractIds(zhIndex, "RF-").sort(), [...canonicalRefactoringIds].sort());
  assert.equal(extractIds(rootIndex, "RF-").length, 61);
  assert.equal(extractIds(zhIndex, "RF-").length, 61);

  const selection = read("skills/fec-refactoring-catalog/references/selection-guide.md");
  for (const smell of ["Long Function", "Long Parameter List", "Mutable Data", "Divergent Change", "Shotgun Surgery", "Primitive Obsession"]) {
    assert.match(selection, new RegExp(smell));
  }
  const composition = read("skills/fec-refactoring-catalog/references/composition-guide.md");
  assert.match(composition, /RF-EXTRACT-FUNCTION[\s\S]*RF-MOVE-FUNCTION/);
  assert.match(composition, /RF-REPLACE-TEMP-WITH-QUERY[\s\S]*RF-EXTRACT-FUNCTION/);
});

const functionRefactoringIds = [
  "RF-EXTRACT-FUNCTION", "RF-INLINE-FUNCTION", "RF-EXTRACT-VARIABLE", "RF-INLINE-VARIABLE",
  "RF-CHANGE-FUNCTION-DECLARATION", "RF-ENCAPSULATE-VARIABLE", "RF-RENAME-VARIABLE",
  "RF-INTRODUCE-PARAMETER-OBJECT", "RF-COMBINE-FUNCTIONS-INTO-CLASS",
  "RF-COMBINE-FUNCTIONS-INTO-TRANSFORM", "RF-SPLIT-PHASE",
] as const;

test("function refactoring reference covers 11 canonical techniques", () => {
  const body = read("skills/fec-refactoring-functions/references/function-refactorings.md");
  const zh = read("localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md");
  assert.deepEqual(extractIds(body, "RF-").sort(), [...functionRefactoringIds].sort());
  assert.deepEqual(extractIds(zh, "RF-").sort(), [...functionRefactoringIds].sort());
  for (const section of ["Intent", "Typical Signals", "Avoid When", "Preconditions", "Mechanics", "Behavior-Preservation Checkpoints", "TypeScript Notes", "React Notes", "Vue Notes", "Frontend-Craft Adaptation", "Example Transformation"]) assert.match(body, new RegExp(section));
  assert.match(body, /Combine Functions into Class[\s\S]*(hook|composable|service|module)/i);
  assert.match(body, /Split Phase[\s\S]*(parse|normalize|validate|submit)/i);
  assertRelativeMarkdownLinksResolve("skills/fec-refactoring-functions/SKILL.md");
});

const encapsulationRefactoringIds = [
  "RF-ENCAPSULATE-RECORD", "RF-ENCAPSULATE-COLLECTION", "RF-REPLACE-PRIMITIVE-WITH-OBJECT",
  "RF-REPLACE-TEMP-WITH-QUERY", "RF-EXTRACT-CLASS", "RF-INLINE-CLASS", "RF-HIDE-DELEGATE",
  "RF-REMOVE-MIDDLE-MAN", "RF-SUBSTITUTE-ALGORITHM",
] as const;

test("encapsulation reference covers 9 canonical techniques", () => {
  const body = read("skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md");
  const zh = read("localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md");
  assert.deepEqual(extractIds(body, "RF-").sort(), [...encapsulationRefactoringIds].sort());
  assert.deepEqual(extractIds(zh, "RF-").sort(), [...encapsulationRefactoringIds].sort());
  assert.match(body, /Extract Class[\s\S]*(service|module|hook|composable|domain)/i);
  assert.match(body, /Replace Primitive with Object[\s\S]*TypeScript alias/i);
  assert.match(body, /Hide Delegate[\s\S]*Middle Man/i);
  assert.match(body, /Substitute Algorithm[\s\S]*(ordering|errors|performance)/i);
});

const movingRefactoringIds = [
  "RF-MOVE-FUNCTION", "RF-MOVE-FIELD", "RF-MOVE-STATEMENTS-INTO-FUNCTION",
  "RF-MOVE-STATEMENTS-TO-CALLERS", "RF-REPLACE-INLINE-CODE-WITH-FUNCTION-CALL",
  "RF-SLIDE-STATEMENTS", "RF-SPLIT-LOOP", "RF-REPLACE-LOOP-WITH-PIPELINE", "RF-REMOVE-DEAD-CODE",
] as const;

test("moving reference covers 9 canonical techniques and cleanup bridge", () => {
  const body = read("skills/fec-refactoring-move-features/references/moving-refactorings.md");
  const zh = read("localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md");
  assert.deepEqual(extractIds(body, "RF-").sort(), [...movingRefactoringIds].sort());
  assert.deepEqual(extractIds(zh, "RF-").sort(), [...movingRefactoringIds].sort());
  assert.match(body, /Move Function[\s\S]*(data|owner|responsibil)/i);
  assert.match(body, /Split Loop[\s\S]*(performance|order)/i);
  assert.match(body, /RF-REMOVE-DEAD-CODE[\s\S]*fec-refactor-clean/);
  assert.match(body, /(dynamic import|Storybook|i18n|Tailwind)/i);
});

const dataRefactoringIds = [
  "RF-SPLIT-VARIABLE", "RF-RENAME-FIELD", "RF-REPLACE-DERIVED-VARIABLE-WITH-QUERY",
  "RF-CHANGE-REFERENCE-TO-VALUE", "RF-CHANGE-VALUE-TO-REFERENCE",
] as const;

test("data reference covers 5 canonical techniques", () => {
  const body = read("skills/fec-refactoring-data/references/data-refactorings.md");
  const zh = read("localized/zh-CN/skills/fec-refactoring-data/references/data-refactorings.md");
  assert.deepEqual(extractIds(body, "RF-").sort(), [...dataRefactoringIds].sort());
  assert.deepEqual(extractIds(zh, "RF-").sort(), [...dataRefactoringIds].sort());
  assert.match(body, /Rename Field[\s\S]*(DTO|persist|URL|backend)/i);
  assert.match(body, /Replace Derived Variable with Query[\s\S]*(memoization|recomput)/i);
  assert.match(body, /Change Reference to Value[\s\S]*(React|Vue|identity|reactiv)/i);
});

const controlRefactoringIds = [
  "RF-DECOMPOSE-CONDITIONAL", "RF-CONSOLIDATE-CONDITIONAL-EXPRESSION",
  "RF-REPLACE-NESTED-CONDITIONAL-WITH-GUARD-CLAUSES", "RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM",
  "RF-INTRODUCE-SPECIAL-CASE", "RF-INTRODUCE-ASSERTION",
] as const;

test("conditional reference covers 6 canonical techniques", () => {
  const body = read("skills/fec-refactoring-control/references/conditional-refactorings.md");
  const zh = read("localized/zh-CN/skills/fec-refactoring-control/references/conditional-refactorings.md");
  assert.deepEqual(extractIds(body, "RF-").sort(), [...controlRefactoringIds].sort());
  assert.deepEqual(extractIds(zh, "RF-").sort(), [...controlRefactoringIds].sort());
  assert.match(body, /Replace Conditional with Polymorphism[\s\S]*(discriminated union|strategy map|component registry|handler)/i);
  assert.match(body, /Introduce Assertion[\s\S]*(not a substitute|does not replace|user-input validation)/i);
  assert.match(body, /Guard Clauses[\s\S]*(finally|loading|cleanup)/i);
});

const apiRefactoringIds = [
  "RF-SEPARATE-QUERY-FROM-MODIFIER", "RF-PARAMETERIZE-FUNCTION", "RF-REMOVE-FLAG-ARGUMENT",
  "RF-PRESERVE-WHOLE-OBJECT", "RF-REPLACE-PARAMETER-WITH-QUERY", "RF-REPLACE-QUERY-WITH-PARAMETER",
  "RF-REMOVE-SETTING-METHOD", "RF-REPLACE-CONSTRUCTOR-WITH-FACTORY-FUNCTION",
  "RF-REPLACE-FUNCTION-WITH-COMMAND", "RF-REPLACE-COMMAND-WITH-FUNCTION",
] as const;

test("api reference covers 10 canonical techniques", () => {
  const body = read("skills/fec-refactoring-api/references/api-refactorings.md");
  const zh = read("localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md");
  assert.deepEqual(extractIds(body, "RF-").sort(), [...apiRefactoringIds].sort());
  assert.deepEqual(extractIds(zh, "RF-").sort(), [...apiRefactoringIds].sort());
  assert.match(body, /Remove Flag Argument[\s\S]*(behavior|control instruction|ordinary domain)/i);
  assert.match(body, /Replace Parameter with Query[\s\S]*(hidden dependency|testability|purity)/i);
  assert.match(body, /Replace Query with Parameter[\s\S]*(hidden dependency|testability|purity)/i);
  assert.match(body, /Replace Function with Command[\s\S]*(undo|queue|retry|audit|lifecycle)/i);
  assert.match(body, /(public|exported)[\s\S]*(API|signature|contract)/i);
});

const inheritanceRefactoringIds = [
  "RF-PULL-UP-METHOD", "RF-PULL-UP-FIELD", "RF-PULL-UP-CONSTRUCTOR-BODY", "RF-PUSH-DOWN-METHOD",
  "RF-PUSH-DOWN-FIELD", "RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES", "RF-REMOVE-SUBCLASS",
  "RF-EXTRACT-SUPERCLASS", "RF-COLLAPSE-HIERARCHY", "RF-REPLACE-SUBCLASS-WITH-DELEGATE",
  "RF-REPLACE-SUPERCLASS-WITH-DELEGATE",
] as const;

test("inheritance reference covers 11 canonical techniques", () => {
  const body = read("skills/fec-refactoring-inheritance/references/inheritance-refactorings.md");
  const zh = read("localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md");
  assert.deepEqual(extractIds(body, "RF-").sort(), [...inheritanceRefactoringIds].sort());
  assert.deepEqual(extractIds(zh, "RF-").sort(), [...inheritanceRefactoringIds].sort());
  assert.match(body, /(legacy OO|domain model|SDK|editor engine)/i);
  assert.match(body, /React[\s\S]*(composition|hooks|render props|delegate)/i);
  assert.match(body, /Vue[\s\S]*(composition|composables|slots|delegation)/i);
  assert.match(body, /Replace Type Code with Subclasses[\s\S]*(discriminated union|strategy)/i);
});

test("refactoring agent and commands expose diagnose plan execute modes", () => {
  for (const file of [
    "agents/fec-refactoring-expert.md",
    "commands/fec-smell.md",
    "commands/fec-refactor-plan.md",
    "commands/fec-refactor.md",
    "localized/zh-CN/agents/fec-refactoring-expert.md",
    "localized/zh-CN/commands/fec-smell.md",
    "localized/zh-CN/commands/fec-refactor-plan.md",
    "localized/zh-CN/commands/fec-refactor.md",
  ]) assertExists(file);

  assert.match(read("commands/fec-smell.md"), /Do not modify business code/);
  assert.match(read("commands/fec-refactor-plan.md"), /PLAN ONLY/);
  assert.match(read("commands/fec-refactor.md"), /one refactoring step/i);

  const agent = read("agents/fec-refactoring-expert.md");
  assert.match(agent, /maxTurns: 24/);
  assert.match(agent, /Revert Before Repairing/);
  assert.match(agent, /Do not modify tests to accept changed behavior/);
});

const refactoringSkillIds = [
  "fec-refactoring",
  "fec-code-smells",
  "fec-refactoring-catalog",
  "fec-refactoring-functions",
  "fec-refactoring-encapsulation",
  "fec-refactoring-move-features",
  "fec-refactoring-data",
  "fec-refactoring-control",
  "fec-refactoring-api",
  "fec-refactoring-inheritance",
  "fec-refactoring-validation",
] as const;

test("refactoring skills are registered in metadata evals and relations", () => {
  const metadata = JSON.parse(read("skills/metadata.json")) as Array<{ id: string; category: string }>;
  const evals = JSON.parse(read("skills/eval_queries.json")) as Record<string, { should_trigger: string[]; should_not_trigger: string[] }>;
  const relations = JSON.parse(read("skills/relations.json")) as Record<string, unknown>;
  const zhMetadata = JSON.parse(read("localized/zh-CN/skills/metadata.json")) as Array<{ id: string; category: string }>;
  const zhEvals = JSON.parse(read("localized/zh-CN/skills/eval_queries.json")) as Record<string, { should_trigger: string[]; should_not_trigger: string[] }>;
  const zhRelations = JSON.parse(read("localized/zh-CN/skills/relations.json")) as Record<string, unknown>;

  for (const skillId of refactoringSkillIds) {
    const entry = metadata.find((item) => item.id === skillId);
    const zhEntry = zhMetadata.find((item) => item.id === skillId);
    assert.ok(entry, `missing metadata: ${skillId}`);
    assert.ok(zhEntry, `missing zh metadata: ${skillId}`);
    assert.equal(entry.category, "review-quality");
    assert.equal(zhEntry.category, "review-quality");
    assert.ok(evals[skillId]?.should_trigger.length >= 8);
    assert.ok(evals[skillId]?.should_not_trigger.length >= 8);
    assert.ok(zhEvals[skillId]?.should_trigger.length >= 8);
    assert.ok(zhEvals[skillId]?.should_not_trigger.length >= 8);
    assert.ok(relations[skillId], `missing relations: ${skillId}`);
    assert.ok(zhRelations[skillId], `missing zh relations: ${skillId}`);
  }

  assert.match(read("skills/fec-tdd-workflow/SKILL.md"), /Pure behavior-preserving refactoring does not manufacture a failing test/);
  assert.match(read("localized/zh-CN/skills/fec-tdd-workflow/SKILL.md"), /纯粹的保持行为重构，不应人为制造一个失败测试/);
  assert.match(read("commands/fec-tdd.md"), /pure behavior-preserving refactoring/i);
  assert.match(read("skills/fec-refactor-clean/SKILL.md"), /structural refactoring/i);
  assert.match(read("agents/fec-code-reviewer.md"), /fec-smell|fec-refactor-plan/);
});

test("adjacent workflows preserve refactoring routing boundaries", () => {
  assert.match(read("commands/fec-tdd.md"), /pure behavior-preserving refactoring/i);
  assert.match(read("localized/zh-CN/commands/fec-tdd.md"), /纯.*保持行为.*重构/);
  assert.match(read("skills/fec-refactor-clean/SKILL.md"), /structural refactoring/i);
  assert.match(read("localized/zh-CN/skills/fec-refactor-clean/SKILL.md"), /结构.*重构/);
  assert.match(read("agents/fec-refactor-cleaner.md"), /structural refactoring/i);
  assert.match(read("localized/zh-CN/agents/fec-refactor-cleaner.md"), /结构.*重构/);
  assert.match(read("skills/fec-code-review/SKILL.md"), /smell diagnosis|refactoring plan/i);
  assert.match(read("localized/zh-CN/skills/fec-code-review/SKILL.md"), /坏味道诊断|重构计划/);
  assert.match(read("agents/fec-code-reviewer.md"), /fec-smell|fec-refactor-plan/);
  assert.match(read("localized/zh-CN/agents/fec-code-reviewer.md"), /fec-smell|fec-refactor-plan/);
});


test("public docs expose the refactoring subsystem consistently", () => {
  for (const file of [
    "README.md",
    "README.zh-CN.md",
    "README.openclaw.md",
    "README.openclaw.zh-CN.md",
  ]) {
    const body = read(file);
    assert.match(body, /14 specialized agents|14 个.*Agent|14 个.*agent|14 个.*智能体/i);
    assert.match(body, /56 .*skills|56 .*Skill|56 个.*技能/i);
    assert.match(body, /11 .*commands|11 .*Command|11 个.*命令/i);
  }

  for (const command of ["/fec-smell", "/fec-refactor-plan", "/fec-refactor"]) {
    assert.match(read("README.md"), new RegExp(command.replace("/", "\\/")));
    assert.match(read("README.zh-CN.md"), new RegExp(command.replace("/", "\\/")));
  }

  for (const file of [
    "docs/refactoring/README.md",
    "docs/refactoring/catalog.md",
    "docs/refactoring/smell-refactoring-matrix.md",
  ]) assertExists(file);
});


test("refactoring release metadata is synchronized at 2.9.0", () => {
  const pkg = JSON.parse(read("package.json")) as { version: string };
  assert.equal(pkg.version, "2.9.0");

  for (const file of [
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    "openclaw.plugin.json",
  ]) {
    const parsed = JSON.parse(read(file)) as { version?: string; plugins?: Array<{ version?: string; source?: { version?: string } }> };
    if (file.endsWith("marketplace.json")) {
      assert.equal(parsed.plugins?.[0]?.version, "2.9.0");
      assert.equal(parsed.plugins?.[0]?.source?.version, "2.9.0");
    } else {
      assert.equal(parsed.version, "2.9.0");
    }
  }

  for (const file of ["skills/metadata.json", "localized/zh-CN/skills/metadata.json"]) {
    const metadata = JSON.parse(read(file)) as Array<{ version: string }>;
    assert.ok(metadata.every((entry) => entry.version === "2.9.0"), `${file} versions must be 2.9.0`);
  }
});


test("root and zh-CN refactoring knowledge stay structurally aligned", () => {
  const rootSmells = extractIds(
    read("skills/fec-code-smells/references/smell-catalog.md"),
    "SMELL-",
  ).sort();
  const zhSmells = extractIds(
    read("localized/zh-CN/skills/fec-code-smells/references/smell-catalog.md"),
    "SMELL-",
  ).sort();
  assert.deepEqual(rootSmells, zhSmells);
  assert.equal(rootSmells.length, 24);

  const rootCatalog = extractIds(
    read("skills/fec-refactoring-catalog/references/catalog-index.md"),
    "RF-",
  ).sort();
  const zhCatalog = extractIds(
    read("localized/zh-CN/skills/fec-refactoring-catalog/references/catalog-index.md"),
    "RF-",
  ).sort();
  assert.deepEqual(rootCatalog, zhCatalog);
  assert.equal(rootCatalog.length, 61);
});

test("all seven family references define exactly the 61 catalog techniques", () => {
  const familyFiles = [
    "skills/fec-refactoring-functions/references/function-refactorings.md",
    "skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md",
    "skills/fec-refactoring-move-features/references/moving-refactorings.md",
    "skills/fec-refactoring-data/references/data-refactorings.md",
    "skills/fec-refactoring-control/references/conditional-refactorings.md",
    "skills/fec-refactoring-api/references/api-refactorings.md",
    "skills/fec-refactoring-inheritance/references/inheritance-refactorings.md",
  ];
  const defined = familyFiles.flatMap((file) =>
    [...read(file).matchAll(/^## (RF-[A-Z0-9-]+) — /gm)].map((match) => match[1]),
  );
  assert.equal(defined.length, 61);
  assert.equal(new Set(defined).size, 61);
  assert.deepEqual([...defined].sort(), [...canonicalRefactoringIds].sort());

  for (const file of familyFiles) assertRelativeMarkdownLinksResolve(file.replace(/\/references\/[^/]+$/, "/SKILL.md"));
});

test("every smell has candidates and dead code keeps cleanup execution ownership", () => {
  const mapping = read("skills/fec-code-smells/references/smell-to-refactoring-map.md");
  const sections = mapping.split(/^## /m).filter((section) => section.startsWith("SMELL-"));
  assert.equal(sections.length, 24);
  for (const section of sections) {
    const smellId = section.match(/^(SMELL-[A-Z0-9-]+)/)?.[1];
    assert.ok(smellId, "smell section must start with stable ID");
    assert.match(section, /RF-[A-Z0-9-]+/, `${smellId} must include at least one candidate`);
  }
  assert.match(
    read("skills/fec-refactoring-move-features/references/moving-refactorings.md"),
    /RF-REMOVE-DEAD-CODE[\s\S]*fec-refactor-clean/,
  );
});

test("refactoring agent skills and public counts are internally complete", () => {
  const agent = read("agents/fec-refactoring-expert.md");
  const frontmatter = agent.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const skillIds = [...frontmatter.matchAll(/^  - (fec-[a-z0-9-]+)$/gm)].map((match) => match[1]);
  for (const skillId of skillIds) assertExists(`skills/${skillId}/SKILL.md`);

  const rootSkillDirs = fs.readdirSync(path.join(root, "skills"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const zhSkillDirs = fs.readdirSync(path.join(root, "localized/zh-CN/skills"), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  assert.equal(rootSkillDirs.length, 56);
  assert.deepEqual(rootSkillDirs.sort(), zhSkillDirs.sort());
  assert.equal(fs.readdirSync(path.join(root, "commands")).filter((name) => name.endsWith(".md")).length, 11);
  assert.equal(fs.readdirSync(path.join(root, "agents")).filter((name) => name.endsWith(".md")).length, 14);
});
