import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
export interface RunEvidence {
  exitCode: number | null;
  testNames: string[];
  tests: { total: number; passed: number; failed: number; skipped: number };
  assertionMarkers: string[];
  logPath: string;
}
export interface CaseEvidence {
  caseId: string;
  status: "PASS" | "FAIL" | "MISSING" | "NOT_RUN";
  platform: string;
  toolVersions: Record<string, string>;
  sourceHash: string;
  commands: string[];
  broken?: RunEvidence;
  fixed?: RunEvidence;
  scope: string;
  reason?: string;
}
const names = [
  "newer request survives a late older result",
  "unmount cancels owned request",
];
const files = [
  "request-view.mjs",
  "request-view.test.mjs",
  "package.json",
  "pnpm-workspace.yaml",
  "pnpm-lock.yaml",
  "README.md",
];
export function assessTap(
  run: { status: number | null; output: string },
  broken: boolean,
  logPath: string,
): RunEvidence {
  const rows = [...run.output.matchAll(/^(not ok|ok) \d+ - (.+)$/gm)].map(
    (m) => ({
      name: m[2],
      state: /# SKIP\b/.test(m[2]) ? "skip" : m[1] === "ok" ? "pass" : "fail",
    }),
  );
  const tests = {
    total: rows.length,
    passed: rows.filter((r) => r.state === "pass").length,
    failed: rows.filter((r) => r.state === "fail").length,
    skipped: rows.filter((r) => r.state === "skip").length,
  };
  const count = (key: string) =>
    Number(
      run.output.match(new RegExp("^# " + key + " (\\d+)\\s*$", "m"))?.[1] ??
        NaN,
    );
  if (
    count("tests") !== tests.total ||
    count("pass") !== tests.passed ||
    count("fail") !== tests.failed ||
    count("skipped") !== tests.skipped ||
    tests.total !== 2 ||
    tests.skipped ||
    names.some((n) => !rows.some((r) => r.name === n)) ||
    new Set(rows.map((r) => r.name)).size !== 2
  )
    throw new Error("Incomplete named React execution");
  if (
    broken
      ? run.status === null ||
        run.status === 0 ||
        tests.failed !== 2 ||
        !/code: ['"]ERR_ASSERTION['"]/.test(run.output)
      : run.status !== 0 || tests.passed !== 2
  )
    throw new Error("Not the required business RED/GREEN");
  return {
    exitCode: run.status,
    testNames: rows.map((r) => r.name),
    tests,
    assertionMarkers: rows
      .filter((r) => r.state === (broken ? "fail" : "pass"))
      .map((r) => r.name),
    logPath,
  };
}
export function parseEngineeringArgs(args: string[]): {
  root: string;
  prepare: boolean;
} {
  let root = process.cwd(),
    prepare = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--") continue;
    if (args[i] === "--prepare") prepare = true;
    else if (
      args[i] === "--root" &&
      args[i + 1] &&
      !args[i + 1].startsWith("--")
    )
      root = path.resolve(args[++i]);
    else throw new Error("Unknown or incomplete argument: " + args[i]);
  }
  return { root, prepare };
}
export function pnpmEntry(
  nodeExecutable = process.execPath,
  configuredEntry = process.env.npm_execpath,
): string {
  const prefix = path.dirname(nodeExecutable);
  const candidates = [
    configuredEntry,
    path.join(prefix, "node_modules/corepack/dist/pnpm.js"),
    path.join(prefix, "node_modules/pnpm/bin/pnpm.cjs"),
    path.join(prefix, "../lib/node_modules/pnpm/bin/pnpm.cjs"),
    path.join(prefix, "node_modules/pnpm/bin/pnpm.mjs"),
    path.join(prefix, "../lib/node_modules/pnpm/bin/pnpm.mjs"),
  ];
  const found = candidates.find(
    (p) => p && fs.existsSync(p) && /pnpm\.(?:js|cjs|mjs)$/.test(p),
  );
  if (!found) throw new Error("MISSING pnpm entry for explicit preparation");
  return found;
}
export function verifyEngineeringExamples({
  root,
  prepare,
}: {
  root: string;
  prepare: boolean;
}): CaseEvidence[] {
  const source = path.join(
    root,
    "skills/fec-react-project-standard/examples/engineering",
  );
  const evidence: CaseEvidence = {
    caseId: "EP-UI-01",
    status: "NOT_RUN",
    platform: process.platform + "/" + process.arch,
    toolVersions: { node: process.version },
    sourceHash: "",
    commands: [],
    scope:
      "Real React component, Testing Library and JSDOM; controlled request ordering and owned abort. No real browser, Vue, remote rollback or GUI.",
  };
  try {
    const hash = createHash("sha256");
    for (const name of files)
      hash.update(name).update(fs.readFileSync(path.join(source, name)));
    evidence.sourceHash = hash.digest("hex");
    const cache = path.join(
        root,
        "reports/engineering/prepared",
        evidence.sourceHash,
      ),
      ready = path.join(cache, "ready.json");
    if (prepare) {
      fs.mkdirSync(cache, { recursive: true });
      for (const name of files)
        fs.copyFileSync(path.join(source, name), path.join(cache, name));
      const command = [
        pnpmEntry(),
        "install",
        "--frozen-lockfile",
        "--ignore-scripts",
      ];
      evidence.commands.push("node " + command.join(" "));
      const installed = spawnSync(process.execPath, command, {
        cwd: cache,
        encoding: "utf8",
        timeout: 180000,
        shell: false,
        maxBuffer: 8 * 1024 * 1024,
      });
      fs.writeFileSync(
        path.join(cache, "prepare.log"),
        (installed.stdout ?? "") + (installed.stderr ?? ""),
      );
      if (installed.status !== 0)
        throw new Error(
          "Preparation failed; see " + path.join(cache, "prepare.log"),
        );
      fs.writeFileSync(
        ready,
        JSON.stringify({
          sourceHash: evidence.sourceHash,
          node: process.version,
        }),
      );
    }
    if (
      !fs.existsSync(ready) ||
      JSON.parse(fs.readFileSync(ready, "utf8")).sourceHash !==
        evidence.sourceHash ||
      !fs.existsSync(path.join(cache, "node_modules/react/package.json"))
    ) {
      evidence.status = "MISSING";
      evidence.reason =
        "Explicit matching preparation required: verify:engineering -- --prepare";
      return [evidence];
    }
    for (const name of files)
      if (
        !fs
          .readFileSync(path.join(source, name))
          .equals(fs.readFileSync(path.join(cache, name)))
      )
        throw new Error("Prepared input drift: " + name);
    const log = fs.mkdtempSync(path.join(root, "reports/engineering/run-"));
    for (const broken of [true, false]) {
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        CRAFT_ENGINEERING_DEFECTIVE: broken ? "1" : "0",
      };
      delete env.NODE_TEST_CONTEXT;
      const args = ["--test", "--test-reporter=tap", "request-view.test.mjs"];
      evidence.commands.push(
        "CRAFT_ENGINEERING_DEFECTIVE=" +
          env.CRAFT_ENGINEERING_DEFECTIVE +
          " node " +
          args.join(" "),
      );
      const result = spawnSync(process.execPath, args, {
        cwd: cache,
        encoding: "utf8",
        env,
        timeout: 30000,
        shell: false,
        maxBuffer: 8 * 1024 * 1024,
      });
      const output = (result.stdout ?? "") + (result.stderr ?? ""),
        file = path.join(log, broken ? "broken.log" : "fixed.log");
      fs.writeFileSync(file, output);
      const assessed = assessTap(
        { status: result.status, output },
        broken,
        file,
      );
      if (broken) evidence.broken = assessed;
      else evidence.fixed = assessed;
    }
    for (const name of [
      "react",
      "react-dom",
      "@testing-library/react",
      "@testing-library/dom",
      "jsdom",
    ])
      evidence.toolVersions[name] = JSON.parse(
        fs.readFileSync(
          path.join(cache, "node_modules", name, "package.json"),
          "utf8",
        ),
      ).version;
    evidence.status = "PASS";
    fs.writeFileSync(
      path.join(log, "evidence.json"),
      JSON.stringify(evidence, null, 2) + "\n",
    );
  } catch (error) {
    evidence.status = "FAIL";
    evidence.reason = error instanceof Error ? error.message : String(error);
  }
  return [evidence];
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const results = verifyEngineeringExamples(
      parseEngineeringArgs(process.argv.slice(2)),
    );
    console.log(JSON.stringify(results, null, 2));
    process.exitCode = results.some((r) => r.status === "FAIL")
      ? 1
      : results.some((r) => r.status !== "PASS")
        ? 2
        : 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
