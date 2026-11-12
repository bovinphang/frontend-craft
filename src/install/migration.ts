import { MANIFEST_CODEC } from "./manifest-codec.js";
import { toProductContext } from "./product-definition.js";
import { LEGACY_SKILL_IDS } from "./product-definition.js";
import { canonicalProductPath, productPathKey } from "@bovinphang/craft-common";
export type MigrationFinding = {
  file: string;
  line?: number;
  id: string;
  kind: "rename" | "split" | "legacy-install" | "conflict";
  replacement?: string;
  message: string;
};
export type MigrationReport = {
  findings: MigrationFinding[];
  errors: string[];
  exitCode: 0 | 1 | 2;
};
const renamed = LEGACY_SKILL_IDS;
const split: Record<string, string> = {
  "fec-image-generation": "cc-technical-diagrams",
  "fec-doc-sync": "cc-doc-sync-core",
  "fec-debug-framework": "cc-debug-methodology",
  "fec-refactoring": "cc-refactoring-core",
  "fec-tdd-workflow": "cc-tdd-methodology",
};
const excluded = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "skill-packages",
  "npm-packages",
  ".superpowers",
  ".worktrees",
  "sessions",
  "history",
  "logs",
  "cache",
]);
const sensitive =
  /^(?:\.env(?:\.|$)|id_rsa|id_ed25519|auth\.json$)|(?:credential|secret|password|private[-_]key)|\.(?:pem|key|p12|pfx)$/i;
const textFile =
  /\.(?:md|mdx|txt|json|ya?ml|toml|[cm]?[jt]sx?|sh|ps1|bat|cmd)$/i;

export function checkMigration({
  cwd,
  runtime,
  scope,
}: {
  cwd: string;
  runtime?: string;
  scope: "local" | "global";
}): MigrationReport {
  const report: MigrationReport = { findings: [], errors: [], exitCode: 0 };
  if (
    (runtime && !ALL_RUNTIMES.includes(runtime)) ||
    !["local", "global"].includes(scope)
  )
    return { findings: [], errors: ["Runtime 或安装范围无效"], exitCode: 2 };
  const seen = new Set<string>();
  let entries = 0;
  function scan(file: string, depth = 0): void {
    if (++entries > 10000 || depth > 12)
      throw new Error("迁移引用扫描达到上限，结果不完整");
    if (seen.has(file) || sensitive.test(path.basename(file))) return;
    seen.add(file);
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) return;
    if (stat.isDirectory()) {
      if (!excluded.has(path.basename(file)))
        for (const child of fs.readdirSync(file).sort())
          scan(path.join(file, child), depth + 1);
      return;
    }
    if (!stat.isFile() || !textFile.test(file) || stat.size > 262144) return;
    const bytes = fs.readFileSync(file);
    if (bytes.includes(0)) return;
    const lines = bytes.toString("utf8").split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      for (const match of lines[i].matchAll(
        /(?<![a-z0-9-])(fec-(?:typescript-project-standard|drawio-studio|source-driven-development|image-generation|doc-sync|debug-framework|refactoring|tdd-workflow))(?![a-z0-9-])/g,
      )) {
        const id = match[1];
        if (renamed[id])
          report.findings.push({
            file,
            line: i + 1,
            id,
            kind: "rename",
            replacement: renamed[id],
            message:
              "旧公共 Skill 入口已改名；同名领域规则文件和历史记录请人工甄别",
          });
        else if (
          /common|backend|通用|后端|architecture|technical diagram|sequence|data.flow|架构|流程图|序列图|数据流/i.test(
            lines[i],
          )
        )
          report.findings.push({
            file,
            line: i + 1,
            id,
            kind: "split",
            replacement: split[id],
            message: "通用任务已拆入公共入口，前端专属任务仍可使用原入口",
          });
      }
    }
  }
  try {
    if (scope === "local") scan(path.resolve(cwd));
    for (const rt of runtime ? [runtime] : ALL_RUNTIMES) {
      const baseDir = getInstallBaseDir({
        runtime: rt,
        isGlobal: scope === "global",
        cwd,
      });
      const manifestPath = getManifestPath(baseDir);
      const manifest = readInstallManifest(manifestPath);
      if (fs.existsSync(manifestPath) && !manifest)
        throw new Error(`无法读取安装清单：${manifestPath}`);
      if (scope === "global" && manifest) {
        const context = toProductContext({
          pluginRoot: "",
          contentRoot: "",
          cwd,
          baseDir,
          runtime: rt,
          isGlobal: true,
          dryRun: true,
          mode: "install",
          language: manifest.language ?? "en",
        });
        const state = MANIFEST_CODEC.decode(
          Buffer.from(JSON.stringify(manifest)),
          context,
        );
        for (const file of [...state.files, ...state.sharedEntries])
          if (fs.existsSync(file.path)) scan(file.path);
      }
      const skillsDir = getRuntimeSkillsTarget({
        pluginRoot: "",
        contentRoot: "",
        cwd,
        baseDir,
        runtime: rt,
        isGlobal: scope === "global",
        dryRun: true,
        mode: "install",
        language: "en",
      });
      if (skillsDir)
        report.findings.push(
          ...inspectLegacyCommonInstall({ cwd, baseDir, skillsDir }).findings,
        );
    }
  } catch (error) {
    report.errors.push(error instanceof Error ? error.message : String(error));
  }
  report.exitCode =
    report.errors.length || report.findings.some((f) => f.kind === "conflict")
      ? 2
      : report.findings.length
        ? 1
        : 0;
  return report;
}
export function inspectLegacyCommonInstall({
  cwd,
  baseDir,
  skillsDir,
  manifest: providedManifest,
  pending = [],
}: {
  cwd: string;
  baseDir: string;
  skillsDir: string;
  manifest?: import("./shared/fs.js").InstallManifest;
  pending?: readonly import("@bovinphang/craft-common").FileMutation[];
}): { findings: MigrationFinding[]; retiredFiles: string[] } {
  const manifestPath = getManifestPath(baseDir);
  const manifest = providedManifest ?? readInstallManifest(manifestPath);
  if (fs.existsSync(manifestPath) && !manifest)
    throw new Error(`无法读取旧安装清单 manifest：${manifestPath}`);
  const owned = new Map<string, string>();
  for (const file of manifest?.files ?? []) {
    const resolved = resolveManifestFile({
      filePath: file.path,
      root: file.root ?? "baseDir",
      baseDir,
      cwd,
    });
    if (!resolved) throw new Error(`旧安装清单路径越界：${file.path}`);
    owned.set(productPathKey(resolved), file.hash);
  }
  const canonicalSkillsDir = canonicalProductPath(skillsDir);
  const plannedFiles = new Map(
    pending.map((mutation) => [productPathKey(mutation.path), mutation]),
  );
  const findings: MigrationFinding[] = [],
    retiredFiles: string[] = [];
  for (const [id, replacement] of Object.entries(renamed)) {
    const dir = path.join(skillsDir, id);
    const canonicalDir = path.join(canonicalSkillsDir, id);
    const files = new Map<string, string>();
    let invalid = false;
    const walk = (file: string): void => {
      const stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) {
        invalid = true;
        return;
      }
      if (stat.isDirectory())
        for (const name of fs.readdirSync(file).sort())
          walk(path.join(file, name));
      else if (stat.isFile()) {
        const canonicalFile = path.join(canonicalDir, path.relative(dir, file));
        files.set(productPathKey(canonicalFile), file);
      } else invalid = true;
    };
    let present = false;
    try {
      fs.lstatSync(dir);
      present = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    if (present) walk(dir);
    for (const [key, planned] of plannedFiles) {
      const relative = path.relative(canonicalDir, planned.path);
      if (
        relative &&
        relative !== ".." &&
        !relative.startsWith(`..${path.sep}`) &&
        !path.isAbsolute(relative)
      ) {
        if (planned.after === null) files.delete(key);
        else files.set(key, planned.path);
      }
    }
    if (!invalid && !files.size) continue;
    if (
      !manifest ||
      invalid ||
      [...files].some(([key, file]) => {
        const planned = plannedFiles.get(key);
        return (
          owned.get(key) !==
          (planned?.after ? hashContent(planned.after) : hashFile(file))
        );
      })
    )
      findings.push({
        file: dir,
        id,
        replacement,
        kind: "conflict",
        message:
          "旧公共 Skill 包含用户修改、未知文件或不可确认的所有权，请先处理；安装未改动这些文件",
      });
    else {
      findings.push({
        file: dir,
        id,
        replacement,
        kind: "legacy-install",
        message: "旧公共 Skill 全部由本产品托管且未修改，可随安装事务退役",
      });
      retiredFiles.push(...files.values());
    }
  }
  return { findings, retiredFiles };
}
import fs from "node:fs";
import path from "node:path";
import { ALL_RUNTIMES } from "./registry.js";
import { getInstallBaseDir } from "./runtime-homes.js";
import { getRuntimeSkillsTarget } from "./runtime-skill-targets.js";
import {
  getManifestPath,
  hashFile,
  hashContent,
  readInstallManifest,
} from "./shared/fs.js";
import { resolveManifestFile } from "./manifest-installs.js";
