import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  prepareContent,
  checkSourceContent,
} from "../../scripts/prepare-content.js";

const commonRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.resolve("@bovinphang/craft-common"))),
  "..",
);
function fixture(t: { after(fn: () => void): void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "craft source 空格 "));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const common = JSON.parse(
    fs.readFileSync(path.join(commonRoot, "package.json"), "utf8"),
  );
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      name: "@bovinphang/frontend-craft",
      version: "1.0.0",
      files: ["skills", "localized", "docs"],
      scripts: { prepack: "exit 1" },
      dependencies: { "@bovinphang/craft-common": common.version },
    }),
  );
  for (const prefix of ["", "localized/zh-CN/"]) {
    fs.mkdirSync(path.join(root, prefix, "skills"), { recursive: true });
    fs.writeFileSync(path.join(root, prefix, "skills/metadata.json"), "[]");
  }
  return root;
}
test("组合在独立目录生成双语公共内容，重复生成一致且不修改源码", (t) => {
  const sourceRoot = fixture(t);
  const before = fs.readFileSync(path.join(sourceRoot, "package.json"));
  const output = prepareContent({ sourceRoot, commonRoot });
  const lock = fs.readFileSync(path.join(output, "common-content.lock.json"));
  assert.equal(output, path.join(sourceRoot, "dist/package"));
  assert.ok(
    fs.existsSync(path.join(output, "skills/cc-debug-methodology/SKILL.md")),
  );
  assert.ok(
    fs.existsSync(
      path.join(output, "localized/zh-CN/skills/cc-debug-methodology/SKILL.md"),
    ),
  );
  assert.equal(
    JSON.parse(fs.readFileSync(path.join(output, "package.json"), "utf8"))
      .scripts,
    undefined,
  );
  prepareContent({ sourceRoot, commonRoot });
  assert.deepEqual(
    fs.readFileSync(path.join(output, "common-content.lock.json")),
    lock,
  );
  assert.deepEqual(
    fs.readFileSync(path.join(sourceRoot, "package.json")),
    before,
  );
  assert.ok(
    !fs.existsSync(path.join(sourceRoot, "skills/cc-debug-methodology")),
  );
});
test("缺失或版本错误的来源阻断生成并保留上次结果", (t) => {
  const sourceRoot = fixture(t);
  const output = prepareContent({ sourceRoot, commonRoot });
  const lock = fs.readFileSync(path.join(output, "common-content.lock.json"));
  assert.throws(
    () =>
      prepareContent({
        sourceRoot,
        commonRoot: path.join(sourceRoot, "missing"),
      }),
    /来源|ENOENT/,
  );
  const pkg = JSON.parse(
    fs.readFileSync(path.join(sourceRoot, "package.json"), "utf8"),
  );
  pkg.dependencies["@bovinphang/craft-common"] = "0.0.0";
  fs.writeFileSync(path.join(sourceRoot, "package.json"), JSON.stringify(pkg));
  assert.throws(() => prepareContent({ sourceRoot, commonRoot }), /版本/);
  assert.deepEqual(
    fs.readFileSync(path.join(output, "common-content.lock.json")),
    lock,
  );
});

test("源码公共副本被阻断，生成失败不留下临时目录", (t) => {
  const sourceRoot = fixture(t);
  const output = prepareContent({ sourceRoot, commonRoot });
  const lock = fs.readFileSync(path.join(output, "common-content.lock.json"));
  const bad = path.join(sourceRoot, "skills/cc-unexpected");
  fs.mkdirSync(bad);
  assert.throws(() => checkSourceContent(sourceRoot), /公共生成/);
  fs.rmdirSync(bad);
  const broken = path.join(sourceRoot, "broken-provider");
  fs.mkdirSync(broken);
  fs.copyFileSync(
    path.join(commonRoot, "package.json"),
    path.join(broken, "package.json"),
  );
  assert.throws(() => prepareContent({ sourceRoot, commonRoot: broken }));
  assert.deepEqual(
    fs.readFileSync(path.join(output, "common-content.lock.json")),
    lock,
  );
  assert.deepEqual(fs.readdirSync(path.join(sourceRoot, "dist")), ["package"]);
});
test("替换目录失败会恢复原产物", (t) => {
  const sourceRoot = fixture(t);
  const output = prepareContent({ sourceRoot, commonRoot });
  const lock = fs.readFileSync(path.join(output, "common-content.lock.json"));
  const rename = fs.renameSync;
  fs.renameSync = (from, to) => {
    if (
      path.basename(String(from)).startsWith(".content-") &&
      String(to) === output
    )
      throw new Error("模拟中断");
    rename(from, to);
  };
  try {
    assert.throws(() => prepareContent({ sourceRoot, commonRoot }), /模拟中断/);
  } finally {
    fs.renameSync = rename;
  }
  assert.deepEqual(
    fs.readFileSync(path.join(output, "common-content.lock.json")),
    lock,
  );
  assert.deepEqual(fs.readdirSync(path.join(sourceRoot, "dist")), ["package"]);
});

test("组合锁阻止并发替换且保留现有产物", (t) => {
  const sourceRoot = fixture(t);
  const output = prepareContent({ sourceRoot, commonRoot });
  const lock = fs.readFileSync(path.join(output, "common-content.lock.json"));
  const active = path.join(sourceRoot, "dist/.content.lock");
  fs.writeFileSync(active, "active build");
  assert.throws(() => prepareContent({ sourceRoot, commonRoot }), /EEXIST/);
  assert.deepEqual(
    fs.readFileSync(path.join(output, "common-content.lock.json")),
    lock,
  );
  assert.equal(fs.readFileSync(active, "utf8"), "active build");
});

test("组合将双语公共链接改为包内相对路径，保留源码和示例", (t) => {
  const sourceRoot = fixture(t);
  const repository = "https://github.com/bovinphang/craft-common/blob/v2.1.0/";
  const cases = [
    {
      document: "skills/fec-debug-framework/SKILL.md",
      source: "methods/debug.md",
      local: "references/common/debug.md",
    },
    {
      document: "localized/zh-CN/skills/fec-debug-framework/SKILL.md",
      source: "localized/zh-CN/methods/debug.md",
      local: "references/common/debug.md",
    },
    {
      document:
        "skills/fec-api-integration/references/engineering-practices.md",
      source: "methods/engineering-practices.sources.json",
      local: "common/engineering-practices.sources.json",
    },

    {
      document: "docs/zh-CN/review-and-diagram-workflows.md",
      source:
        "localized/zh-CN/skills/cc-technical-diagrams/references/diagram-workflows.md",
      local:
        "../../localized/zh-CN/skills/cc-technical-diagrams/references/diagram-workflows.md",
    },
  ];

  for (const { document, source } of cases) {
    const file = path.join(sourceRoot, document);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const link = "[公共资源](" + repository + source + "#section)";
    const example = "~~~md\n" + link + "\n~~~\n";
    const external = "[外链](https://example.com/methods/debug.md)\n";
    fs.writeFileSync(file, link + "\n" + example + external);
  }

  const output = prepareContent({ sourceRoot, commonRoot });
  for (const { document, source, local } of cases) {
    const original = fs.readFileSync(path.join(sourceRoot, document), "utf8");
    const artifact = path.join(output, document);
    assert.equal(
      fs.readFileSync(artifact, "utf8"),
      original.replace(repository + source, local),
    );
    assert.ok(original.startsWith("[公共资源](" + repository + source));
    assert.ok(
      fs.statSync(path.resolve(path.dirname(artifact), local)).isFile(),
    );
  }

  prepareContent({ sourceRoot, commonRoot });
  for (const { document, local } of cases) {
    assert.ok(
      fs
        .readFileSync(path.join(output, document), "utf8")
        .startsWith("[公共资源](" + local + "#section)"),
    );
  }
});

test("公共链接缺少目标或版本不符时保留上次组合", (t) => {
  const sourceRoot = fixture(t);
  const document = "skills/fec-debug-framework/SKILL.md";
  const file = path.join(sourceRoot, document);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const repository = "https://github.com/bovinphang/craft-common/blob/";
  fs.writeFileSync(file, "[公共资源](" + repository + "v2.1.0/methods/debug.md)\n");
  const output = prepareContent({ sourceRoot, commonRoot });
  const artifact = path.join(output, document);
  const previous = fs.readFileSync(artifact);
  const lock = fs.readFileSync(path.join(output, "common-content.lock.json"));
  for (const source of [
    "v2.1.0/methods/missing.md",
    "v0.0.0/methods/debug.md",
  ]) {
    const link = repository + source;
    fs.writeFileSync(file, "[公共资源](" + link + ")\n");
    assert.throws(
      () => prepareContent({ sourceRoot, commonRoot }),
      (error: Error) =>
        error.message.includes(document) && error.message.includes(link),
    );
    assert.deepEqual(
      fs.readFileSync(path.join(output, "common-content.lock.json")),
      lock,
    );
    assert.deepEqual(fs.readFileSync(artifact), previous);
    assert.deepEqual(fs.readdirSync(path.join(sourceRoot, "dist")), [
      "package",
    ]);
  }
});
