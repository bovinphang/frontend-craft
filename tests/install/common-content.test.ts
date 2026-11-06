import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncCommonContent } from "../../scripts/sync-common.js";
import { readProductCommonCatalog } from "../../src/install/shared/common-content.js";

const commonRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.resolve("@bovinphang/craft-common"))),
  "..",
);
function fixture(t: { after: (fn: () => void) => void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fec common space "));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(root, "package.json"),
    '{"name":"@bovinphang/frontend-craft","version":"3.0.0"}',
  );
  return root;
}
test("从固定公共包生成中英文快照且不依赖源码相邻目录", (t) => {
  const root = fixture(t);
  syncCommonContent({ productRoot: root, commonRoot, check: false });
  assert.equal(readProductCommonCatalog(root, "en").skills.length, 7);
  assert.equal(readProductCommonCatalog(root, "zh-CN").skills.length, 7);
  assert.equal(readProductCommonCatalog(root, "en").packageVersion, "1.0.1");
  assert.equal(readProductCommonCatalog(root, "en").root, root);
  assert.ok(
    fs.existsSync(
      path.join(root, "skills/cc-drawio-studio/styles/schema.json"),
    ),
  );
});
test("生成结果可复现且检查模式不修改任何快照", (t) => {
  const root = fixture(t);
  syncCommonContent({ productRoot: root, commonRoot, check: false });
  const before = fs.readFileSync(
    path.join(root, "common-content.lock.json"),
    "utf8",
  );
  syncCommonContent({ productRoot: root, commonRoot, check: true });
  assert.equal(
    fs.readFileSync(path.join(root, "common-content.lock.json"), "utf8"),
    before,
  );
  const changed = path.join(root, "skills/cc-drawio-studio/SKILL.md");
  fs.appendFileSync(changed, "\nUser edit\n");
  assert.throws(
    () => syncCommonContent({ productRoot: root, commonRoot, check: true }),
    /漂移|修改/,
  );
  assert.match(fs.readFileSync(changed, "utf8"), /User edit/);
  assert.throws(() => readProductCommonCatalog(root, "en"), /哈希|摘要|修改/);
  assert.throws(
    () => syncCommonContent({ productRoot: root, commonRoot, check: false }),
    /漂移|修改/,
  );
  assert.match(fs.readFileSync(changed, "utf8"), /User edit/);
});

test("额外公共文件在检查和写入模式都被阻断并保留", (t) => {
  const root = fixture(t);
  syncCommonContent({ productRoot: root, commonRoot, check: false });
  const extra = path.join(root, "skills/cc-tdd-methodology/unknown.md");
  fs.writeFileSync(extra, "user file");
  for (const check of [true, false])
    assert.throws(
      () => syncCommonContent({ productRoot: root, commonRoot, check }),
      /未知|额外|漂移/,
    );
  assert.equal(fs.readFileSync(extra, "utf8"), "user file");
});

for (const edited of [false, true]) {
  test(`来源删除资源${edited ? "保留本地修改" : "清理已托管残留"}`, (t) => {
    const root = fixture(t),
      provider = fixture(t);
    fs.cpSync(commonRoot, provider, { recursive: true });
    const relative = "skills/cc-tdd-methodology/obsolete.md";
    fs.writeFileSync(path.join(provider, relative), "old generated content");
    syncCommonContent({
      productRoot: root,
      commonRoot: provider,
      check: false,
    });
    fs.unlinkSync(path.join(provider, relative));
    if (edited) fs.appendFileSync(path.join(root, relative), "user edit");
    assert.throws(
      () =>
        syncCommonContent({
          productRoot: root,
          commonRoot: provider,
          check: true,
        }),
      /漂移|修改|过期/,
    );
    if (edited) {
      assert.throws(
        () =>
          syncCommonContent({
            productRoot: root,
            commonRoot: provider,
            check: false,
          }),
        /修改/,
      );
      assert.match(
        fs.readFileSync(path.join(root, relative), "utf8"),
        /user edit/,
      );
    } else {
      syncCommonContent({
        productRoot: root,
        commonRoot: provider,
        check: false,
      });
      assert.equal(fs.existsSync(path.join(root, relative)), false);
      syncCommonContent({
        productRoot: root,
        commonRoot: provider,
        check: true,
      });
    }
  });
}
test("缺失公共包时明确来源错误而不生成空内容", (t) => {
  const root = fixture(t);
  assert.throws(
    () =>
      syncCommonContent({
        productRoot: root,
        commonRoot: path.join(root, "missing"),
        check: false,
      }),
    /missing/,
  );
  assert.equal(
    fs.existsSync(path.join(root, "common-content.lock.json")),
    false,
  );
});
