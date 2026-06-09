import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);
const script = path.join(root, "skills", "fec-ui-design", "scripts", "design-system.mjs");

test("fec-ui-design generator recommends wellness booking direction", () => {
  const output = execFileSync(process.execPath, [script, "beauty spa booking"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.match(output, /wellness/i);
  assert.match(output, /booking/i);
  assert.match(output, /Anti-Patterns/);
  assert.match(output, /Pre-Delivery Checklist/);
});

test("fec-ui-design generator emits parseable json", () => {
  const output = execFileSync(process.execPath, [script, "beauty spa booking", "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const parsed = JSON.parse(output) as {
    designRead: string;
    designDials: {
      visualTension: number;
      motionIntensity: number;
      informationDensity: number;
      mediaAuthenticity: number;
      contentPersuasion: number;
    };
    product: { id: string };
    checklist: unknown[];
  };

  assert.equal(parsed.product.id, "wellness");
  assert.match(parsed.designRead, /Reading this as/i);
  assert.equal(typeof parsed.designDials.visualTension, "number");
  assert.equal(typeof parsed.designDials.motionIntensity, "number");
  assert.equal(typeof parsed.designDials.informationDensity, "number");
  assert.equal(typeof parsed.designDials.mediaAuthenticity, "number");
  assert.equal(typeof parsed.designDials.contentPersuasion, "number");
  assert.ok(parsed.checklist.length > 0);
});

test("fec-ui-design generator persists master and page overrides", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-ui-design-"));
  execFileSync(
    process.execPath,
    [script, "analytics dashboard", "--persist", "--project", "TestApp", "--page", "dashboard", "--output-dir", tmp],
    {
      cwd: root,
      encoding: "utf8",
    },
  );

  const master = path.join(tmp, "design-system", "testapp", "MASTER.md");
  const page = path.join(tmp, "design-system", "testapp", "pages", "dashboard.md");
  assert.ok(fs.existsSync(master), "MASTER.md should be generated");
  assert.ok(fs.existsSync(page), "page override should be generated");
  assert.match(fs.readFileSync(page, "utf8"), /Page Override: dashboard/);
});

test("fec-ui-design generator includes stack guidance", () => {
  const output = execFileSync(process.execPath, [script, "saas admin dashboard", "--format", "json", "--stack", "next"], {
    cwd: root,
    encoding: "utf8",
  });
  const parsed = JSON.parse(output) as { stackGuidance: { stack: string; guidance: string[] } };

  assert.equal(parsed.stackGuidance.stack, "next");
  assert.ok(parsed.stackGuidance.guidance.some((item) => /server|route/i.test(item)));
});

test("fec-ui-design generator adapts design dials by page intent", () => {
  type DesignModel = {
    designDials: {
      visualTension: number;
      motionIntensity: number;
      informationDensity: number;
      mediaAuthenticity: number;
      contentPersuasion: number;
    };
    checklist: Array<{ id: string }>;
  };

  const landing = JSON.parse(execFileSync(process.execPath, [script, "saas landing", "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  })) as DesignModel;
  const portfolio = JSON.parse(execFileSync(process.execPath, [script, "portfolio", "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  })) as DesignModel;
  const dashboard = JSON.parse(execFileSync(process.execPath, [script, "admin dashboard", "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  })) as DesignModel;

  assert.ok(landing.designDials.mediaAuthenticity > dashboard.designDials.mediaAuthenticity);
  assert.ok(portfolio.designDials.visualTension > dashboard.designDials.visualTension);
  assert.ok(dashboard.designDials.informationDensity > portfolio.designDials.informationDensity);
  assert.ok(landing.designDials.contentPersuasion > dashboard.designDials.contentPersuasion);

  const landingChecks = new Set(landing.checklist.map((item) => item.id));
  const dashboardChecks = new Set(dashboard.checklist.map((item) => item.id));
  assert.ok(landingChecks.has("first-viewport"));
  assert.ok(landingChecks.has("media-authenticity"));
  assert.ok(landingChecks.has("cta-quality"));
  assert.ok(dashboardChecks.has("charts"));
});
