import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";
import {
  resolveSkillOrigin,
  extractReferencedFiles,
} from "../../scripts/skill-packaging.js";
const root = resolvePluginRoot(import.meta.url);
const pinnedCommonVersion=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8")).dependencies["@bovinphang/craft-common"];

test("公共独立包来源版本和前端产品版本分离", () => {
  assert.deepEqual(resolveSkillOrigin("cc-drawio-studio", root), {
    packageName: "@bovinphang/craft-common",
    version: pinnedCommonVersion,
    repository: "https://github.com/bovinphang/craft-common",
  });
  assert.deepEqual(resolveSkillOrigin("fec-react-project-standard", root), {
    packageName: "@bovinphang/frontend-craft",
    version: "3.0.0",
    repository: "https://github.com/bovinphang/frontend-craft",
  });
});
test("独立包资源清单包含动态样式和二级脚本", () => {
  const skillRoot = path.join(root, "skills/cc-drawio-studio");
  const body = fs.readFileSync(path.join(skillRoot, "SKILL.md"), "utf8");
  const files = extractReferencedFiles(body, skillRoot);
  assert.ok(files.includes("styles/schema.json"));
  assert.ok(files.includes("scripts/studio-core.mjs"));
});
