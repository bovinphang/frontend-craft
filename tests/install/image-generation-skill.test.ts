import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);
const script = path.join(root, "skills", "fec-image-generation", "scripts", "png-qa.mjs");

test("png-qa reports parseable json for a normal PNG", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-image-generation-"));
  const png = path.join(tmp, "normal.png");
  writePng(png, 120, 80, (x, y) => (x >= 32 && x <= 88 && y >= 24 && y <= 56 ? black : white));

  const result = spawnSync(process.execPath, [script, "--png", png, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as { ok: boolean; image: { width: number; height: number }; issues: unknown[] };
  assert.equal(report.ok, true);
  assert.equal(report.image.width, 120);
  assert.equal(report.image.height, 80);
  assert.deepEqual(report.issues, []);
});

test("png-qa detects blank images and edge clipping", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-image-generation-"));
  const blank = path.join(tmp, "blank.png");
  const clipped = path.join(tmp, "clipped.png");
  writePng(blank, 80, 60, () => white);
  writePng(clipped, 80, 60, (x, y) => (x <= 10 && y >= 20 && y <= 40 ? black : white));

  const blankResult = spawnSync(process.execPath, [script, "--png", blank, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const clippedResult = spawnSync(process.execPath, [script, "--png", clipped, "--format", "markdown"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(blankResult.status, 2, blankResult.stderr);
  const blankReport = JSON.parse(blankResult.stdout) as { issues: Array<{ code: string }> };
  assert.ok(blankReport.issues.some((issue) => issue.code === "blank-image"));
  assert.equal(clippedResult.status, 2, clippedResult.stderr);
  assert.match(clippedResult.stdout, /edge-clipping/);
  assert.match(clippedResult.stdout, /Increase canvas\/viewBox padding/);
});

test("png-qa detects manifest overlap, connector collisions, stacking, and label overflow", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-image-generation-"));
  const png = path.join(tmp, "diagram.png");
  const manifest = path.join(tmp, "layout.json");
  writePng(png, 400, 240, (x, y) => (x >= 40 && x <= 360 && y >= 40 && y <= 200 ? black : white));
  fs.writeFileSync(
    manifest,
    JSON.stringify(
      {
        canvas: { width: 400, height: 240 },
        boxes: [
          { id: "a", x: 40, y: 80, width: 90, height: 50, label: "API" },
          { id: "b", x: 100, y: 96, width: 90, height: 50, label: "Extremely long label that cannot fit" },
          { id: "c", x: 300, y: 80, width: 80, height: 50, label: "DB" },
          { id: "outside", x: 360, y: 210, width: 70, height: 40, label: "Out" },
        ],
        connectors: [
          { id: "a-c", from: "a", to: "c", points: [[130, 105], [300, 105]] },
          { id: "stack-1", from: "a", to: "c", points: [[130, 180], [300, 180]] },
          { id: "stack-2", from: "a", to: "c", points: [[130, 181], [300, 181]] },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );

  const result = spawnSync(process.execPath, [script, "--png", png, "--manifest", manifest, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 2, result.stderr);
  const report = JSON.parse(result.stdout) as { issues: Array<{ code: string }>; nextActions: string[] };
  const issueCodes = new Set(report.issues.map((issue) => issue.code));
  assert.ok(issueCodes.has("box-overlap"));
  assert.ok(issueCodes.has("box-out-of-bounds"));
  assert.ok(issueCodes.has("label-overflow"));
  assert.ok(issueCodes.has("connector-through-label"));
  assert.ok(issueCodes.has("connector-stacking"));
  assert.ok(report.nextActions.some((action) => /node spacing|split dense groups/i.test(action)));
});

type Rgba = [number, number, number, number];

const white: Rgba = [255, 255, 255, 255];
const black: Rgba = [0, 0, 0, 255];

function writePng(filePath: string, width: number, height: number, pixelAt: (x: number, y: number) => Rgba): void {
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixelAt(x, y);
      const offset = 1 + x * 4;
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rows.push(row);
  }

  const chunks = [
    pngChunk("IHDR", ihdr(width, height)),
    pngChunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
    pngChunk("IEND", Buffer.alloc(0)),
  ];
  fs.writeFileSync(filePath, Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), ...chunks]));
}

function ihdr(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(13);
  buffer.writeUInt32BE(width, 0);
  buffer.writeUInt32BE(height, 4);
  buffer[8] = 8;
  buffer[9] = 6;
  buffer[10] = 0;
  buffer[11] = 0;
  buffer[12] = 0;
  return buffer;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
