import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";
import {
  runCommonAwareInstall,
  uninstallCommonAwareInstall,
} from "../../src/install/shared/common-install.js";
import { readProductCommonCatalog } from "../../src/install/shared/common-content.js";
import { executeSharedPlan } from "@bovinphang/craft-common";
import {
  discoverManifestInstalls,
  copyInstallToNewBase,
  type DiscoveredInstall,
} from "../../src/install/manifest-installs.js";
import { getRuntimeSkillsTarget } from "../../src/install/runtime-skill-targets.js";
import { planProductMutations } from "../../src/install/shared/product-write-plan.js";
import { writeUtf8, hashContent } from "../../src/install/shared/fs.js";
import { INSTALLERS, ALL_RUNTIMES } from "../../src/install/registry.js";
import type { InstallContext } from "../../src/install/types.js";
import { main } from "../../src/install/cli.js";

function fixture(t: { after: (fn: () => void) => void }, runtime = "codex") {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "fec-shared-"));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const pluginRoot = resolvePluginRoot(import.meta.url);
  const ctx: InstallContext = {
    cwd,
    pluginRoot,
    contentRoot: pluginRoot,
    baseDir: path.join(cwd, `.${runtime}`),
    runtime,
    isGlobal: false,
    dryRun: false,
    mode: "install",
    language: "en",
  };
  return ctx;
}
test("Codex 的真实 Skill 目标与配置目录分离，产品清单不认领 cc", async (t) => {
  const ctx = fixture(t);
  assert.equal(
    getRuntimeSkillsTarget(ctx),
    path.join(ctx.cwd, ".agents/skills"),
  );
  await runCommonAwareInstall(ctx, () => INSTALLERS.codex(ctx));
  assert.ok(
    fs.existsSync(
      path.join(ctx.cwd, ".agents/skills/cc-drawio-studio/SKILL.md"),
    ),
  );
  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(ctx.baseDir, "frontend-craft.manifest.json"),
      "utf8",
    ),
  );
  assert.ok(manifest.common);
  assert.ok(
    manifest.files.every(
      (file: { path: string }) => !file.path.includes("/cc-"),
    ),
  );
});
test("OpenClaw 本地公共目标是项目 skills，无 Skill 能力的 Runtime 不创建公共依赖", (t) => {
  const ctx = fixture(t, "openclaw");
  assert.equal(getRuntimeSkillsTarget(ctx), path.join(ctx.cwd, "skills"));
  for (const runtime of ["copilot", "trae", "cline"])
    assert.equal(getRuntimeSkillsTarget({ ...ctx, runtime }), undefined);
});
test("产品写入先生成计划，不创建文件或目录", async (t) => {
  const ctx = fixture(t);
  const target = path.join(ctx.cwd, "new/file.md");
  const mutations = await planProductMutations(async () =>
    writeUtf8(target, "planned"),
  );
  assert.equal(fs.existsSync(path.dirname(target)), false);
  assert.equal(mutations[0].after?.toString(), "planned");
});
test("所有 Runtime 的协调 dry-run 都不写目标目录", async (t) => {
  const ctx = fixture(t);
  for (const runtime of ALL_RUNTIMES) {
    const dry = {
      ...ctx,
      runtime,
      baseDir: path.join(ctx.cwd, `.${runtime}`),
      dryRun: true,
    };
    await runCommonAwareInstall(dry, () => INSTALLERS[runtime](dry));
  }
  assert.deepEqual(fs.readdirSync(ctx.cwd), []);
});

test("卸载前端保留后端引用的公共资源，最后后端退出才回收", async (t) => {
  const ctx = fixture(t);
  await runCommonAwareInstall(ctx, () => INSTALLERS.codex(ctx));
  const target = getRuntimeSkillsTarget(ctx)!;
  const backend = {
    product: "backend-craft",
    manifestPath: path.join(ctx.cwd, "backend.manifest.json"),
    scope: "local" as const,
  };
  await executeSharedPlan(
    {
      action: "install",
      skillsDir: target,
      consumer: backend,
      catalog: readProductCommonCatalog(ctx.pluginRoot, "en"),
    },
    { dryRun: false },
  );
  const [install] = discoverManifestInstalls({
    cwd: ctx.cwd,
    runtimes: ["codex"],
    scopes: ["local"],
  });
  await uninstallCommonAwareInstall({
    install,
    cwd: ctx.cwd,
    dryRun: false,
    force: false,
  });
  assert.ok(fs.existsSync(path.join(target, "cc-drawio-studio/SKILL.md")));
  assert.equal(fs.existsSync(install.manifestPath), false);
  await executeSharedPlan(
    { action: "uninstall", skillsDir: target, consumer: backend },
    { dryRun: false },
  );
  assert.equal(
    fs.existsSync(path.join(target, "cc-drawio-studio/SKILL.md")),
    false,
  );
});

test("公共语言冲突与产品执行失败都不写产品文件", async (t) => {
  const ctx = fixture(t);
  const target = getRuntimeSkillsTarget(ctx)!;
  await executeSharedPlan(
    {
      action: "install",
      skillsDir: target,
      consumer: {
        product: "backend-craft",
        manifestPath: path.join(ctx.cwd, "backend.manifest.json"),
        scope: "local",
      },
      catalog: readProductCommonCatalog(ctx.pluginRoot, "en"),
    },
    { dryRun: false },
  );
  const localized = {
    ...ctx,
    language: "zh-CN" as const,
    contentRoot: path.join(ctx.pluginRoot, "localized/zh-CN"),
  };
  await assert.rejects(
    runCommonAwareInstall(localized, () => INSTALLERS.codex(localized)),
    /冲突/,
  );
  assert.equal(fs.existsSync(ctx.baseDir), false);
  await assert.rejects(
    runCommonAwareInstall(ctx, async () => {
      writeUtf8(path.join(ctx.baseDir, "partial.md"), "partial");
      throw new Error("产品执行失败");
    }),
    /产品执行失败/,
  );
  assert.equal(fs.existsSync(ctx.baseDir), false);
});

test("修改过的前端文件导致部分卸载时仍保留公共引用", async (t) => {
  const ctx = fixture(t);
  await runCommonAwareInstall(ctx, () => INSTALLERS.codex(ctx));
  const [install] = discoverManifestInstalls({
    cwd: ctx.cwd,
    runtimes: ["codex"],
    scopes: ["local"],
  });
  const file = path.join(
    ctx.cwd,
    ".agents/skills/fec-react-project-standard/SKILL.md",
  );
  fs.appendFileSync(file, "user edit");
  const result = await uninstallCommonAwareInstall({
    install,
    cwd: ctx.cwd,
    dryRun: false,
    force: false,
  });
  assert.ok(result.skipped.length > 0);
  assert.ok(
    fs.existsSync(
      path.join(ctx.cwd, ".agents/skills/cc-drawio-studio/SKILL.md"),
    ),
  );
  assert.ok(fs.existsSync(install.manifestPath));
});

for (const edited of [false, true]) {
  test(`旧公共入口${edited ? "已修改则阻断" : "未修改则随事务退役"}`, async (t) => {
    const ctx = fixture(t);
    const old = path.join(ctx.cwd, ".agents/skills/fec-drawio-studio/SKILL.md");
    fs.mkdirSync(path.dirname(old), { recursive: true });
    fs.mkdirSync(ctx.baseDir, { recursive: true });
    fs.writeFileSync(old, edited ? "owned plus user edit" : "owned");
    const manifestFile = path.join(ctx.baseDir, "frontend-craft.manifest.json");
    const original = JSON.stringify({
      packageVersion: "2.0.0",
      runtime: "codex",
      scope: "local",
      files: [
        {
          root: "cwd",
          path: ".agents/skills/fec-drawio-studio/SKILL.md",
          hash: hashContent("owned"),
        },
      ],
    });
    fs.writeFileSync(manifestFile, original);
    if (edited) {
      await assert.rejects(
        runCommonAwareInstall(ctx, () => INSTALLERS.codex(ctx)),
        /旧公共 Skill/,
      );
      assert.equal(fs.readFileSync(manifestFile, "utf8"), original);
      assert.equal(
        fs.existsSync(
          path.join(ctx.cwd, ".agents/skills/cc-drawio-studio/SKILL.md"),
        ),
        false,
      );
    } else {
      await runCommonAwareInstall(ctx, () => INSTALLERS.codex(ctx));
      assert.equal(fs.existsSync(old), false);
      assert.ok(
        fs.existsSync(
          path.join(ctx.cwd, ".agents/skills/cc-drawio-studio/SKILL.md"),
        ),
      );
      assert.ok(
        JSON.parse(fs.readFileSync(manifestFile, "utf8")).files.every(
          (file: { path: string }) => !file.path.includes("fec-drawio-studio"),
        ),
      );
      await runCommonAwareInstall(ctx, () => INSTALLERS.codex(ctx));
    }
  });
}

test("doctor 检查公共依赖及资源修改状态", async (t) => {
  const ctx = fixture(t);
  await runCommonAwareInstall(ctx, () => INSTALLERS.codex(ctx));
  const previous = process.cwd(),
    previousCode = process.exitCode;
  const messages: string[] = [];
  t.mock.method(console, "log", (...args: unknown[]) =>
    messages.push(args.join(" ")),
  );
  try {
    process.chdir(ctx.cwd);
    await main(["doctor", "codex"]);
    assert.match(messages.join("\n"), /common: ok/);
    fs.appendFileSync(
      path.join(ctx.cwd, ".agents/skills/cc-drawio-studio/SKILL.md"),
      "user edit",
    );
    messages.length = 0;
    await main(["doctor", "codex"]);
    assert.match(messages.join("\n"), /common: missing/);
  } finally {
    process.chdir(previous);
    process.exitCode = previousCode;
  }
});

for (const edited of [false, true]) {
  test(`迁入旧全局安装${edited ? "先阻断用户修改" : "退役公共入口"}`, async (t) => {
    const ctx = { ...fixture(t, "antigravity"), isGlobal: true };
    const oldBase = path.join(ctx.cwd, "legacy");
    const relative = "skills/fec-drawio-studio/SKILL.md";
    const old = path.join(oldBase, relative);
    fs.mkdirSync(path.dirname(old), { recursive: true });
    fs.writeFileSync(old, edited ? "owned plus user edit" : "owned");
    const legacy: DiscoveredInstall = {
      baseDir: oldBase,
      manifestPath: path.join(oldBase, "frontend-craft.manifest.json"),
      runtime: ctx.runtime,
      scope: "global",
      manifest: {
        packageVersion: "2.0.0",
        installedAt: "2026-11-05T00:00:00.000Z",
        runtime: ctx.runtime,
        scope: "global",
        files: [
          { root: "baseDir", path: relative, hash: hashContent("owned") },
        ],
      },
    };
    const run = () =>
      runCommonAwareInstall(
        ctx,
        () => INSTALLERS.antigravity(ctx),
        (dry = false) => copyInstallToNewBase(legacy, ctx.baseDir, dry),
      );
    if (edited) {
      await assert.rejects(run(), /旧公共 Skill/);
      assert.equal(fs.existsSync(ctx.baseDir), false);
      const dry = { ...ctx, dryRun: true };
      await assert.rejects(
        runCommonAwareInstall(
          dry,
          () => INSTALLERS.antigravity(dry),
          (preview = true) =>
            copyInstallToNewBase(legacy, ctx.baseDir, preview),
        ),
        /旧公共 Skill/,
      );
      assert.equal(fs.existsSync(ctx.baseDir), false);
    } else {
      await run();
      assert.equal(fs.existsSync(path.join(ctx.baseDir, relative)), false);
      assert.ok(
        fs.existsSync(
          path.join(ctx.baseDir, "skills/cc-drawio-studio/SKILL.md"),
        ),
      );
    }
    assert.ok(fs.existsSync(old));
  });
}

for (const change of ["scope", "runtime"] as const) {
  test(`同一清单路径拒绝切换 ${change} 以免遗留公共引用`, async (t) => {
    const ctx = fixture(t, "cursor");
    await runCommonAwareInstall(ctx, () => INSTALLERS.cursor(ctx));
    const manifestPath = path.join(ctx.baseDir, "frontend-craft.manifest.json");
    const before = fs.readFileSync(manifestPath);
    const changed =
      change === "scope"
        ? { ...ctx, isGlobal: true }
        : { ...ctx, runtime: "windsurf" };
    await assert.rejects(
      runCommonAwareInstall(changed, () =>
        INSTALLERS[changed.runtime](changed),
      ),
      /身份|scope|runtime/,
    );
    assert.deepEqual(fs.readFileSync(manifestPath), before);
    const manifest = JSON.parse(before.toString());
    await uninstallCommonAwareInstall({
      install: {
        baseDir: ctx.baseDir,
        manifestPath,
        runtime: ctx.runtime,
        scope: "local",
        manifest,
      },
      cwd: ctx.cwd,
      dryRun: false,
      force: false,
    });
    assert.equal(fs.existsSync(manifestPath), false);
    assert.equal(
      fs.existsSync(path.join(ctx.baseDir, "skills/cc-drawio-studio/SKILL.md")),
      false,
    );
  });
}

test("全局配置根通过 junction 别名仍能原子安装", async (t) => {
  const ctx = { ...fixture(t, "cursor"), isGlobal: true };
  const real = path.join(ctx.cwd, "real");
  fs.mkdirSync(real);
  fs.symlinkSync(
    real,
    ctx.baseDir,
    process.platform === "win32" ? "junction" : "dir",
  );
  await runCommonAwareInstall(ctx, () => INSTALLERS.cursor(ctx));
  assert.ok(fs.existsSync(path.join(real, "frontend-craft.manifest.json")));
  assert.ok(fs.existsSync(path.join(real, "skills/cc-drawio-studio/SKILL.md")));
});
