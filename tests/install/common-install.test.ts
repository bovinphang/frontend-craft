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
import {
  executeSharedPlan,
  withProductConfigurationLocks,
} from "@bovinphang/craft-common";
import {
  discoverManifestInstalls,
  copyInstallToNewBase,
  type DiscoveredInstall,
} from "../../src/install/manifest-installs.js";
import { getRuntimeSkillsTarget } from "../../src/install/runtime-skill-targets.js";
import { planProductMutations } from "../../src/install/shared/product-write-plan.js";
import { hashContent } from "../../src/install/shared/fs.js";
import * as fileTools from "../../src/install/shared/fs.js";
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
test("coordinated Qoder install respects the cross-product settings lock", async (t) => {
  const ctx = fixture(t, "qoder"),
    settings = path.join(ctx.baseDir, "settings.json");
  await withProductConfigurationLocks([settings], async () => {
    await assert.rejects(
      runCommonAwareInstall(ctx, (planning) => INSTALLERS.qoder(planning)),
      /lock/i,
    );
    assert.equal(fs.existsSync(settings), false);
  });
});
test("Codex 的真实 Skill 目标与配置目录分离，产品清单不认领 cc", async (t) => {
  const ctx = fixture(t);
  assert.equal(
    getRuntimeSkillsTarget(ctx),
    path.join(ctx.cwd, ".agents/skills"),
  );
  await runCommonAwareInstall(ctx, (planning) => INSTALLERS.codex(planning));
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
  const mutations = await planProductMutations(ctx, async (session) =>
    fileTools.createFileTools({ ...ctx, session }).writeUtf8(target, "planned"),
  );
  assert.equal(fs.existsSync(path.dirname(target)), false);
  assert.equal(mutations[0].after?.toString(), "planned");
});

test("frontend installation callbacks receive an explicit isolated common session", async (t) => {
  const ctx = fixture(t),
    target = path.join(ctx.cwd, "fec-explicit.md");
  await runCommonAwareInstall(ctx, async (...args: unknown[]) => {
    const planning = args[0] as InstallContext & {
      session?: { writeManaged(file: string, bytes: Buffer): void };
    };
    assert.equal(typeof planning?.session?.writeManaged, "function");
    const api = fileTools as unknown as {
      createFileTools(ctx: InstallContext): {
        writeUtf8(file: string, body: string): void;
      };
    };
    assert.equal(typeof api.createFileTools, "function");
    api.createFileTools(planning).writeUtf8(target, "explicit");
  });
  assert.equal(fs.readFileSync(target, "utf8"), "explicit");
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
    await runCommonAwareInstall(dry, (planning) =>
      INSTALLERS[runtime](planning),
    );
  }
  assert.deepEqual(fs.readdirSync(ctx.cwd), []);
});

test("卸载前端保留后端引用的公共资源，最后后端退出才回收", async (t) => {
  const ctx = fixture(t);
  await runCommonAwareInstall(ctx, (planning) => INSTALLERS.codex(planning));
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
    runCommonAwareInstall(localized, (planning) => INSTALLERS.codex(planning)),
    /冲突/,
  );
  assert.equal(fs.existsSync(ctx.baseDir), false);
  await assert.rejects(
    runCommonAwareInstall(ctx, async (planning) => {
      fileTools
        .createFileTools(planning)
        .writeUtf8(path.join(ctx.baseDir, "partial.md"), "partial");
      throw new Error("产品执行失败");
    }),
    /产品执行失败/,
  );
  assert.equal(fs.existsSync(ctx.baseDir), false);
});

test("修改过的前端文件导致部分卸载时仍保留公共引用", async (t) => {
  const ctx = fixture(t);
  await runCommonAwareInstall(ctx, (planning) => INSTALLERS.codex(planning));
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
      installedAt: "2026-01-01T00:00:00Z",
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
        runCommonAwareInstall(ctx, (planning) => INSTALLERS.codex(planning)),
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
      await runCommonAwareInstall(ctx, (planning) =>
        INSTALLERS.codex(planning),
      );
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
      await runCommonAwareInstall(ctx, (planning) =>
        INSTALLERS.codex(planning),
      );
    }
  });
}

test("doctor 检查公共依赖及资源修改状态", async (t) => {
  const ctx = fixture(t);
  await runCommonAwareInstall(ctx, (planning) => INSTALLERS.codex(planning));
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
        (planning) => INSTALLERS.antigravity(planning),
        (dry = false) => copyInstallToNewBase(legacy, ctx.baseDir, dry),
      );
    if (edited) {
      await assert.rejects(run(), /旧公共 Skill/);
      assert.equal(fs.existsSync(ctx.baseDir), false);
      const dry = { ...ctx, dryRun: true };
      await assert.rejects(
        runCommonAwareInstall(
          dry,
          (planning) => INSTALLERS.antigravity(planning),
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
    await runCommonAwareInstall(ctx, (planning) => INSTALLERS.cursor(planning));
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
  await runCommonAwareInstall(ctx, (planning) => INSTALLERS.cursor(planning));
  assert.ok(fs.existsSync(path.join(real, "frontend-craft.manifest.json")));
  assert.ok(fs.existsSync(path.join(real, "skills/cc-drawio-studio/SKILL.md")));
});

for (const edited of [false, true]) {
  test(`旧 TypeScript 入口${edited ? "已修改则阻断" : "未修改则随事务退役"}`, async (t) => {
    const ctx = fixture(t);
    const old = path.join(
      ctx.cwd,
      ".agents/skills/fec-typescript-project-standard/SKILL.md",
    );
    fs.mkdirSync(path.dirname(old), { recursive: true });
    fs.mkdirSync(ctx.baseDir, { recursive: true });
    fs.writeFileSync(old, edited ? "owned plus user edit" : "owned");
    const manifestFile = path.join(ctx.baseDir, "frontend-craft.manifest.json");
    const original = JSON.stringify({
      packageVersion: "2.0.0",
      installedAt: "2026-01-01T00:00:00Z",
      runtime: "codex",
      scope: "local",
      files: [
        {
          root: "cwd",
          path: ".agents/skills/fec-typescript-project-standard/SKILL.md",
          hash: hashContent("owned"),
        },
      ],
    });
    fs.writeFileSync(manifestFile, original);
    if (edited) {
      await assert.rejects(
        runCommonAwareInstall(ctx, (planning) => INSTALLERS.codex(planning)),
        /旧公共 Skill/,
      );
      assert.equal(fs.readFileSync(manifestFile, "utf8"), original);
      assert.equal(
        fs.existsSync(
          path.join(
            ctx.cwd,
            ".agents/skills/cc-typescript-project-standard/SKILL.md",
          ),
        ),
        false,
      );
    } else {
      await runCommonAwareInstall(ctx, (planning) =>
        INSTALLERS.codex(planning),
      );
      assert.equal(fs.existsSync(old), false);
      assert.ok(
        fs.existsSync(
          path.join(
            ctx.cwd,
            ".agents/skills/cc-typescript-project-standard/SKILL.md",
          ),
        ),
      );
      assert.ok(
        JSON.parse(fs.readFileSync(manifestFile, "utf8")).files.every(
          (file: { path: string }) =>
            !file.path.includes("fec-typescript-project-standard"),
        ),
      );
      await runCommonAwareInstall(ctx, (planning) =>
        INSTALLERS.codex(planning),
      );
    }
  });
}
test("legacy preflight is repeated under the lock after queued edits, before any retirement/common writes", async (t) => {
  const ctx = fixture(t, "claude"),
    dir = path.join(ctx.baseDir, "skills/fec-typescript-project-standard"),
    old = path.join(dir, "SKILL.md");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(old, "owned");
  const manifestFile = path.join(ctx.baseDir, "frontend-craft.manifest.json"),
    before = JSON.stringify({
      packageVersion: "2.9.0",
      installedAt: "2026-11-01",
      runtime: "claude",
      scope: "local",
      files: [
        {
          path: "skills/fec-typescript-project-standard/SKILL.md",
          hash: hashContent("owned"),
        },
      ],
    });
  fs.writeFileSync(manifestFile, before);
  const pending = runCommonAwareInstall(ctx, async () => {});
  queueMicrotask(() => fs.writeFileSync(path.join(dir, "user.md"), "user"));
  await assert.rejects(pending, /旧公共 Skill/);
  assert.equal(fs.readFileSync(old, "utf8"), "owned");
  assert.equal(fs.readFileSync(manifestFile, "utf8"), before);
  assert.equal(
    fs.existsSync(
      path.join(ctx.baseDir, "skills/cc-typescript-project-standard"),
    ),
    false,
  );
});
test("known legacy file edited during the recovery boundary blocks common deployment", async (t) => {
  const ctx = fixture(t, "claude"),
    old = path.join(
      ctx.baseDir,
      "skills/fec-typescript-project-standard/SKILL.md",
    );
  fs.mkdirSync(path.dirname(old), { recursive: true });
  fs.writeFileSync(old, "owned");
  const manifestFile = path.join(ctx.baseDir, "frontend-craft.manifest.json"),
    before = JSON.stringify({
      packageVersion: "2.9.0",
      installedAt: "2026-11-01",
      runtime: "claude",
      scope: "local",
      files: [
        {
          path: "skills/fec-typescript-project-standard/SKILL.md",
          hash: hashContent("owned"),
        },
      ],
    });
  fs.writeFileSync(manifestFile, before);
  const pending = runCommonAwareInstall(ctx, async () => {});
  queueMicrotask(() => fs.appendFileSync(old, " user edit"));
  await assert.rejects(pending, /旧公共 Skill/);
  assert.equal(fs.readFileSync(old, "utf8"), "owned user edit");
  assert.equal(fs.readFileSync(manifestFile, "utf8"), before);
  assert.equal(
    fs.existsSync(
      path.join(ctx.baseDir, "skills/cc-typescript-project-standard"),
    ),
    false,
  );
});
