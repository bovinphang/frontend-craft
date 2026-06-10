#!/usr/bin/env node
import zlib from "node:zlib";
import { parseArgs, readText } from "./studio-core.mjs";

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input) {
  console.error("usage: node diagram-url.mjs <file.drawio> [--edit] [--json]");
  process.exit(2);
}

export function encodeDiagramXml(xml) {
  const encoded = encodeURIComponent(xml);
  return zlib.deflateRawSync(Buffer.from(encoded, "utf8")).toString("base64");
}

export function viewerUrl(xml) {
  return `https://viewer.diagrams.net/?highlight=0000ff&edit=_blank#R${encodeDiagramXml(xml)}`;
}

export function editorUrl(xml) {
  return `https://app.diagrams.net/?offline=1#R${encodeDiagramXml(xml)}`;
}

const xml = readText(input);
const url = args.edit ? editorUrl(xml) : viewerUrl(xml);
if (args.json) process.stdout.write(`${JSON.stringify({ url, mode: args.edit ? "edit" : "view" }, null, 2)}\n`);
else process.stdout.write(`${url}\n`);
