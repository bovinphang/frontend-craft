import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import {
  CLI_PACKAGE,
  findPackageManagers,
  identifyInstallation,
  managerQuery,
  relocatePackage,
  runProcess,
  type DetectionOptions,
  type PackageManager,
  type ProcessRunner,
} from "./package-manager.js";

export interface CliLifecycleContext {
  pluginRoot: string;
  cwd: string;
  purgeResources: (dryRun: boolean) => Promise<boolean>;
  describeResources: () => string[];
}
export interface LifecycleDependencies {
  runner?: ProcessRunner;
  managers?: PackageManager[];
  env?: NodeJS.ProcessEnv;
  log?: (message: string) => void;
  fail?: () => void;
  isTTY?: boolean;
  confirm?: () => Promise<boolean>;
}
function packageMetadata(root: string): { version: string; entry: string } {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  ) as {
    name?: string;
    version?: string;
    bin?: string | Record<string, string>;
  };
  if (pkg.name !== CLI_PACKAGE || !pkg.version)
    throw new Error("CLI 包名称或版本无效。");
  const relative = typeof pkg.bin === "string" ? pkg.bin : pkg.bin?.fec;
  if (!relative) throw new Error("CLI 包缺少 fec 入口。");
  const entry = fs.realpathSync(path.resolve(root, relative));
  if (!fs.statSync(entry).isFile()) throw new Error("CLI 入口不是文件。");
  const remainder = path.relative(fs.realpathSync(root), entry);
  if (remainder.startsWith("..") || path.isAbsolute(remainder))
    throw new Error("CLI 入口超出安装目录。");
  return { version: pkg.version, entry };
}
function flags(command: "update" | "uninstall", argv: string[]) {
  const allowed =
    command === "update"
      ? ["--dry-run"]
      : ["--dry-run", "--yes", "-y", "--purge"];
  if (argv.some((arg) => !allowed.includes(arg))) {
    const resources = argv.filter(
      (arg) => !["--purge", "--yes", "-y"].includes(arg),
    );
    throw new Error(
      `顶层 ${command} 仅管理 CLI，不接受 runtime 或旧资源参数。资源操作请使用：fec runtime ${command}${resources.length ? " " + resources.join(" ") : ""}`,
    );
  }
  return {
    dryRun: argv.includes("--dry-run"),
    yes: argv.includes("--yes") || argv.includes("-y"),
    purge: argv.includes("--purge"),
  };
}
async function promptConfirmation(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    return /^(?:y|yes)$/i.test(
      (await rl.question("确认卸载 fec CLI？[y/N] ")).trim(),
    );
  } finally {
    rl.close();
  }
}

export function createCliLifecycle(dependencies: LifecycleDependencies = {}) {
  return async (
    command: "update" | "uninstall",
    argv: string[],
    context: CliLifecycleContext,
  ): Promise<void> => {
    const log = dependencies.log ?? console.log;
    const fail =
      dependencies.fail ??
      (() => {
        process.exitCode = 1;
      });
    const env = dependencies.env ?? process.env;
    const options: DetectionOptions = {
      runner: dependencies.runner ?? runProcess,
      managers: dependencies.managers ?? findPackageManagers(env),
      cwd: context.cwd,
      env,
    };
    try {
      const args = flags(command, argv);
      const source = await identifyInstallation(context.pluginRoot, options);
      if (source.kind === "temporary" && command === "uninstall")
        throw new Error(
          "npm exec/npx 临时运行不支持卸载 CLI（包括 --purge）；请使用 fec runtime uninstall 清理资源。",
        );
      if (source.kind === "global" && source.shared)
        throw new Error(
          "pnpm 共享安装组包含其他包，自动更新或卸载可能删除整组；请先用原 pnpm 将 fec 单独安装后重试。未清理任何资源。",
        );
      const resources =
        command === "update" || args.purge ? context.describeResources() : [];
      if (command === "update") {
        const current = packageMetadata(source.packageRoot);
        const rawLatest = await managerQuery(
          source.manager,
          [
            "view",
            `${CLI_PACKAGE}@latest`,
            "version",
            "--json",
            "--registry",
            source.registry,
          ],
          options,
        );
        const latest: unknown = JSON.parse(rawLatest);
        if (
          typeof latest !== "string" ||
          !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(latest)
        )
          throw new Error("registry latest 返回无效版本。");
        log(`CLI ${current.version} → ${latest}；来源 ${source.manager.name}`);
        if (source.kind === "temporary" && current.version !== latest)
          throw new Error(
            `当前 npm exec 缓存不是最新版。请运行：npx ${CLI_PACKAGE}@latest runtime update`,
          );
        log(
          `资源范围：当前项目与用户全局的托管安装\n${resources.length ? resources.join("\n") : "未发现托管资源"}`,
        );
        if (args.dryRun) {
          log("[dry-run] 仅查询与预览，不安装、不启动资源更新。");
          return;
        }
        let root = source.packageRoot;
        if (source.kind === "global" && current.version !== latest) {
          const managerArgs =
            source.manager.name === "npm"
              ? [
                  "install",
                  "--global",
                  `${CLI_PACKAGE}@${latest}`,
                  "--prefix",
                  source.prefix,
                  "--registry",
                  source.registry,
                ]
              : [
                  "add",
                  "--global",
                  `${CLI_PACKAGE}@${latest}`,
                  "--global-dir",
                  source.globalDir!,
                  "--registry",
                  source.registry,
                ];
          const result = await options.runner(
            source.manager.file,
            [...(source.manager.args ?? []), ...managerArgs],
            { cwd: context.cwd, env, stdio: "inherit" },
          );
          if (result.code !== 0)
            throw new Error("CLI 更新失败，已停止资源更新。");
          root = await relocatePackage(source, options);
          const verified = await identifyInstallation(root, {
            ...options,
            managers: [source.manager],
          });
          if (verified.kind !== "global" || verified.shared)
            throw new Error("更新后的 CLI 安装来源验证失败。");
        }
        const updated = packageMetadata(root);
        if (updated.version !== latest)
          throw new Error(
            `更新后的 CLI 版本验证失败：预期 ${latest}，实际 ${updated.version}。请用原包管理器检查安装。`,
          );
        const result = await options.runner(
          process.execPath,
          [updated.entry, "runtime", "update"],
          { cwd: context.cwd, env, stdio: "inherit" },
        );
        if (result.code !== 0)
          throw new Error(
            "CLI 已就绪，但资源更新失败；请重试 fec runtime update。CLI 不回滚。",
          );
        log("CLI 与托管资源更新完成。");
        return;
      }
      if (source.kind !== "global") return;
      log(`卸载范围：${source.manager.name} 全局 CLI（${source.packageRoot}）`);
      if (args.purge)
        log(
          `资源清理范围：\n${resources.length ? resources.join("\n") : "未发现托管资源"}`,
        );
      if (args.dryRun) {
        if (args.purge && !(await context.purgeResources(true)))
          throw new Error("资源清理预览失败。");
        log("[dry-run] 不删除资源或卸载 CLI。");
        return;
      }
      if (!args.yes) {
        if (
          !(
            dependencies.isTTY ??
            Boolean(process.stdin.isTTY && process.stdout.isTTY)
          )
        )
          throw new Error("非交互环境卸载 CLI 必须显式传入 --yes。");
        if (!(await (dependencies.confirm ?? promptConfirmation)())) {
          log("已取消卸载。");
          return;
        }
      }
      if (args.purge && !(await context.purgeResources(false)))
        throw new Error(
          "资源清理出现错误，保留 CLI 以便重试。请运行 fec runtime uninstall。",
        );
      const managerArgs =
        source.manager.name === "npm"
          ? [
              "uninstall",
              "--global",
              CLI_PACKAGE,
              "--prefix",
              source.prefix,
              "--registry",
              source.registry,
            ]
          : [
              "remove",
              "--global",
              CLI_PACKAGE,
              "--global-dir",
              source.globalDir!,
              "--registry",
              source.registry,
            ];
      const result = await options.runner(
        source.manager.file,
        [...(source.manager.args ?? []), ...managerArgs],
        { cwd: context.cwd, env, stdio: "inherit" },
      );
      if (result.code !== 0)
        throw new Error("CLI 卸载失败，请使用原包管理器重试。");
      log(
        args.purge
          ? "CLI 卸载完成；用户修改导致跳过的资源（如有）予以保留。"
          : "CLI 卸载完成，托管资源予以保留。可用 npx @bovinphang/frontend-craft@latest runtime uninstall 清理。",
      );
    } catch (error) {
      log(error instanceof Error ? error.message : String(error));
      fail();
    }
  };
}

export const runCliLifecycle = createCliLifecycle();
