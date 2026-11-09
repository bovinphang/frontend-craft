import fs from "node:fs";
import path from "node:path";
import {
  inspectWorkspace,
  recommendCapabilities,
  readCapabilityCandidates,
  TASK_KINDS,
  type TaskKind,
} from "@bovinphang/craft-common";
import { FRONTEND_FRAMEWORK_DETECTORS } from "./frameworks.js";
import { readProductCommonCatalog } from "../install/shared/common-content.js";
export function inspectFrontend(input: {
  workspace: string;
  productRoot: string;
  taskPath?: string;
  taskKind?: TaskKind;
}) {
  const common = readProductCommonCatalog(input.productRoot, "en");
  const sources: Record<string, string> = Object.fromEntries(
    common.skills.map((s) => [s.id, s.sourcePackage]),
  );
  for (const item of fs.readdirSync(path.join(input.productRoot, "skills"), {
    withFileTypes: true,
  })) {
    if (
      item.isDirectory() &&
      item.name.startsWith("fec-") &&
      fs.existsSync(
        path.join(input.productRoot, "skills", item.name, "SKILL.md"),
      )
    )
      sources[item.name] = "@bovinphang/frontend-craft";
  }
  const metadata: unknown = JSON.parse(
    fs.readFileSync(
      path.join(input.productRoot, "skills/metadata.json"),
      "utf8",
    ),
  );
  const catalog = readCapabilityCandidates(metadata, sources);
  const inspection = inspectWorkspace({
    workspace: input.workspace,
    taskPath: input.taskPath,
    detectors: FRONTEND_FRAMEWORK_DETECTORS,
  });
  return {
    ...inspection,
    recommendations: recommendCapabilities({
      inspection,
      catalog,
      task: { path: input.taskPath, kind: input.taskKind },
    }),
  };
}
export function runProjectInspect(
  argv: string[],
  productRoot: string,
  cwd: string,
) {
  let workspace: string | undefined,
    taskPath: string | undefined,
    taskKind: TaskKind | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") continue;
    if (arg === "--task-path" || arg === "--task-kind") {
      const value = argv[++i];
      if (!value || value.startsWith("-") || value.includes("\0"))
        throw new Error("Missing or invalid " + arg);
      if (arg === "--task-path") taskPath = value;
      else {
        if (!TASK_KINDS.includes(value as TaskKind))
          throw new Error("Unknown task kind: " + value);
        taskKind = value as TaskKind;
      }
    } else if (arg.startsWith("-")) throw new Error("Unknown option: " + arg);
    else if (workspace !== undefined)
      throw new Error("inspect accepts one workspace");
    else workspace = arg;
  }
  return inspectFrontend({
    workspace: path.resolve(cwd, workspace ?? "."),
    productRoot,
    taskPath,
    taskKind,
  });
}
