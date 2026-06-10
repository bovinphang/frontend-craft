#!/usr/bin/env node
import fs from "node:fs";
import { parseArgs } from "./studio-core.mjs";

const IEND = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
const IEND_TAIL = IEND.subarray(4);

export function repairPngBuffer(buffer) {
  if (buffer.subarray(-12).equals(IEND)) return { buffer, changed: false, reason: "already-valid" };
  if (buffer.subarray(-4).equals(IEND.subarray(0, 4))) {
    return { buffer: Buffer.concat([buffer, IEND_TAIL]), changed: true, reason: "appended-iend-tail" };
  }
  return { buffer, changed: false, reason: "not-truncated-iend" };
}

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input) {
  console.error("usage: node png-embed-fix.mjs <file.png> [--json]");
  process.exit(2);
}

const repaired = repairPngBuffer(fs.readFileSync(input));
if (repaired.changed) fs.writeFileSync(input, repaired.buffer);
const result = { file: input, changed: repaired.changed, reason: repaired.reason };
process.stdout.write(args.json ? `${JSON.stringify(result, null, 2)}\n` : `${input}: ${repaired.reason}\n`);
