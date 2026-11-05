#!/usr/bin/env node
import zlib from "node:zlib";
import { parseArgs, readText } from "./studio-core.mjs";

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input) {
  console.error(
    "usage: node diagram-url.mjs <diagram-file> [--edit|--create] [--type xml|mermaid|csv] [--lightbox] [--dark true|false|auto] [--base-url URL] [--json|--shortcut]",
  );
  process.exit(2);
}

export function encodeDiagramXml(xml) {
  const encoded = encodeURIComponent(xml);
  return zlib.deflateRawSync(Buffer.from(encoded, "utf8")).toString("base64");
}

export function viewerUrl(xml, options = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? "https://viewer.diagrams.net/");
  return `${baseUrl}?highlight=0000ff&edit=_blank#R${encodeDiagramXml(xml)}`;
}

export function editorUrl(xml, options = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? "https://app.diagrams.net/");
  return `${baseUrl}?offline=1#R${encodeDiagramXml(xml)}`;
}

export function createUrl(content, options = {}) {
  const type = normalizeType(options.type);
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? "https://app.diagrams.net/");
  const params = new URLSearchParams();
  if (options.lightbox) {
    params.set("lightbox", "1");
    params.set("edit", "_blank");
  } else {
    params.set("grid", "0");
    params.set("pv", "0");
    params.set("edit", "_blank");
  }
  params.set("border", String(options.border ?? 10));
  const dark = normalizeDark(options.dark);
  if (dark === true) params.set("dark", "1");

  const payload = encodeURIComponent(
    JSON.stringify({
      type,
      compressed: true,
      data: encodeDiagramXml(content),
    }),
  );
  const query = params.toString();
  return `${baseUrl}${query ? `?${query}` : ""}#create=${payload}`;
}

export function internetShortcut(url) {
  return `[InternetShortcut]\r\nURL=${url}\r\n`;
}

function normalizeType(value = "xml") {
  if (["xml", "mermaid", "csv"].includes(value)) return value;
  throw new Error(`Unsupported diagram type "${value}". Expected xml, mermaid, or csv.`);
}

function normalizeDark(value = "auto") {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  if (value === "auto" || value === undefined) return "auto";
  throw new Error(`Unsupported dark mode "${value}". Expected true, false, or auto.`);
}

function normalizeBaseUrl(value) {
  return String(value).replace(/[?#].*$/, "").replace(/\/?$/, "/");
}

try {
  const content = readText(input);
  const type = normalizeType(args.type ?? "xml");
  if (type !== "xml" && !args.create) {
    throw new Error("Mermaid and CSV inputs require --create because viewer/editor #R URLs only load XML.");
  }
  const options = {
    baseUrl: args.baseUrl,
    border: args.border,
    dark: args.dark,
    lightbox: Boolean(args.lightbox),
    type,
  };
  const mode = args.create ? "create" : args.edit ? "edit" : "view";
  const url = args.create ? createUrl(content, options) : args.edit ? editorUrl(content, options) : viewerUrl(content, options);
  const shortcut = internetShortcut(url);
  if (args.shortcut) {
    process.stdout.write(shortcut);
  } else if (args.json) {
    process.stdout.write(`${JSON.stringify({ url, mode, type, windowsShortcut: shortcut }, null, 2)}\n`);
  } else {
    process.stdout.write(`${url}\n`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
