import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const hook = path.join(root, "src", "hooks", "run-tests.ts");
const sessionStart = path.join(root, "src", "hooks", "session-start.ts");
const tsx = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");

function fixture(
  scripts: Record<string, string>,
  packageManager = "npm@10.0.0",
) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-run-tests-"));
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ packageManager, scripts }),
  );
  fs.writeFileSync(
    path.join(dir, "pnpm-lock.yaml"),
    "lockfileVersion: '9.0'\n",
  );
  fs.writeFileSync(path.join(dir, "package-lock.json"), "{}\n");
  return dir;
}

function run(dir: string, blocking = false) {
  return spawnSync(process.execPath, [tsx, hook], {
    cwd: dir,
    encoding: "utf8",
    input: "{}",
    env: {
      ...process.env,
      FRONTEND_CRAFT_VALIDATION_MODE: blocking ? "blocking" : "",
    },
  });
}

test("Stop hook reports failed checks and blocks only in blocking mode", () => {
  const dir = fixture({
    lint: "node -e \"console.error('lint-failure-marker');process.exit(1)\"",
  });
  try {
    const advisory = run(dir);
    assert.equal(advisory.status, 0);
    assert.match(advisory.stderr, /lint.*failed/);
    assert.match(advisory.stderr, /lint-failure-marker/);
    assert.equal(run(dir, true).status, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("Stop hook runs each nested validation stage once", () => {
  const dir = fixture({
    typecheck:
      "node -e \"require('fs').appendFileSync('runs','typecheck\\n')\"",
    build:
      "npm run typecheck && node -e \"require('fs').appendFileSync('runs','build\\n')\"",
    test: "npm run build && node -e \"require('fs').appendFileSync('runs','test\\n')\"",
  });
  try {
    const result = run(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(
      fs.readFileSync(path.join(dir, "runs"), "utf8").trim().split("\n"),
      ["typecheck", "build", "test"],
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("Session start and Stop hook agree on npm when lockfiles conflict", () => {
  const dir = fixture(
    {
      lint: "node -e \"console.error('npm-selected-marker');process.exit(1)\"",
    },
    "",
  );
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, "package.json"), "utf8"),
    ) as Record<string, unknown>;
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({ ...pkg, dependencies: { react: "19.0.0" } }),
    );
    const start = spawnSync(process.execPath, [tsx, sessionStart], {
      cwd: dir,
      encoding: "utf8",
      input: "{}",
    });
    assert.match(start.stdout, /Package manager: npm/);
    assert.match(run(dir).stderr, /npm-selected-marker/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("Stop hook does not mistake quoted command text for a nested build", () => {
  const dir = fixture({
    test: "node -e \"console.log('npm run build')\"",
    build: "node -e \"require('fs').writeFileSync('built','yes')\"",
  });
  try {
    const result = run(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(path.join(dir, "built"), "utf8"), "yes");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
