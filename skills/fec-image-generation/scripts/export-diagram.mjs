#!/usr/bin/env node
// @ts-check

import { analyzeManifest } from "./png-qa.mjs";
import { withDiagramPage } from "./diagram-browser.mjs";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
/** @typedef {{id:string,x:number,y:number,width:number,height:number,[key:string]:unknown}} LabelRect */
/** @typedef {{canvas:{width:number,height:number},boxes:LabelRect[],groups?:LabelRect[],labels?:LabelRect[],connectors:Array<{points:Array<[number,number]>,[key:string]:unknown}>,[key:string]:unknown}} Manifest */

const SUPPORTED_FORMATS = new Set(["svg", "png", "jpg", "jpeg"]);
const JPEG_FORMATS = new Set(["jpg", "jpeg"]);

try {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(requireArg(args, "input"));
  const format = requireArg(args, "format").toLowerCase();
  const scale = args.scale === undefined ? 2 : parseScale(args.scale);
  const background = args.background ?? (args.theme === "dark" ? "#0f172a" : "#ffffff");

  if (!SUPPORTED_FORMATS.has(format)) {
    throw usageError(`Unsupported --format "${format}". Expected svg, png, jpg, or jpeg.`);
  }
  if (!fs.existsSync(inputPath)) {
    throw usageError(`Input file does not exist: ${inputPath}`);
  }

  let svg = extractSvg(inputPath);
  const theme = args.theme ?? "light";
  if (theme !== "light" && theme !== "dark") throw usageError("--theme must be light or dark");
  svg = svg.replace(/data-theme=["'][^"']*["']/, `data-theme="${theme}"`);
  /** @type {Manifest|null} */
  const manifest = args.manifest ? JSON.parse(fs.readFileSync(path.resolve(args.manifest), "utf8")) : null;
  const outputPath = path.resolve(resolveOutputPath(inputPath, format, args.output));

  for(const metadataPath of [args["output-manifest"],args["qa-report"]]) if(metadataPath) fs.mkdirSync(path.dirname(path.resolve(metadataPath)),{recursive:true});
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  if (format === "svg") {
    fs.writeFileSync(outputPath, `${svg.trim()}\n`, "utf8");
    if (manifest && args["output-manifest"]) fs.writeFileSync(path.resolve(args["output-manifest"]), JSON.stringify({...manifest,coordinateSpace:"svg",scale:1,measurement:"estimated"},null,2)+"\n");
    if (args["qa-report"]) fs.writeFileSync(path.resolve(args["qa-report"]),JSON.stringify({status:"estimated",measurement:"estimated",theme,issues:manifest?.issues??[],visualQA:"pending"},null,2)+"\n");
  } else {
    const dimensions = measureSvg(svg);
    const pageHtml = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:${background};}svg.tech-diagram,body>svg{display:block;width:${dimensions.width}px;min-width:0;height:${dimensions.height}px;}</style>${svg}`;
    const result = await withDiagramPage(pageHtml, { theme, timeoutMs: 30000 }, async (session) => {
      await session.evaluate(`(async()=>{let last="";for(let i=0;i<8;i++){let next=Array.from(document.querySelectorAll('[data-label-id]')).map(el=>el.getBBox().width).join(',');if(next===last)return;last=next;await new Promise(r=>requestAnimationFrame(r));}throw new Error('Text layout did not stabilize');})()`);
      const labels = await session.evaluate(`Array.from(document.querySelectorAll('[data-label-id]')).map(el=>{const r=el.getBBox();return {id:el.getAttribute('data-label-id'),x:r.x,y:r.y,width:r.width,height:r.height,fontFamily:getComputedStyle(el).fontFamily,fontSize:getComputedStyle(el).fontSize};})`);
      const png = await session.screenshot(dimensions.width, dimensions.height, scale);
      return { png, labels };
    });
    if (result.png.length < 24 || result.png.readUInt32BE(16) !== Math.ceil(dimensions.width * scale) || result.png.readUInt32BE(20) !== Math.ceil(dimensions.height * scale)) throw usageError("Browser raster export failed: unexpected image dimensions.");
    if(manifest) {
      const measured=/** @type {LabelRect[]} */ (result.labels);
      const missing=(manifest.labels??[]).filter(label=>!measured.some(actual=>actual.id===label.id));
      if(missing.length) throw usageError("Browser measurement missing manifest labels: "+missing.map(label=>label.id).join(", "));
    }
    if (JPEG_FORMATS.has(format)) {
      const temp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-diagram-jpeg-"));
      try { const pngPath = path.join(temp, "image.png"); fs.writeFileSync(pngPath, result.png); convertPngToJpeg(pngPath, outputPath); } finally { fs.rmSync(temp, { recursive: true, force: true }); }
    } else fs.writeFileSync(outputPath, result.png);
    if (manifest) {
      manifest.labels = (manifest.labels ?? []).map((label) => ({ ...label, .../** @type {LabelRect[]} */ (result.labels).find((actual) => actual.id === label.id) }));
      manifest.measurement = "browser";
      if (args["output-manifest"]) fs.writeFileSync(path.resolve(args["output-manifest"]), JSON.stringify(scaleManifest(manifest, scale), null, 2) + "\n");
    }
    /** @type {Array<{code:string,message:string}>} */
    const boundaryIssues=[];
    if(manifest) analyzeManifest({width:Math.ceil(dimensions.width*scale),height:Math.ceil(dimensions.height*scale)},scaleManifest(manifest,scale),boundaryIssues,new Set(),false);
    if (args["qa-report"]) fs.writeFileSync(path.resolve(args["qa-report"]), JSON.stringify({ status: boundaryIssues.length ? "partial" : "measured", issues:boundaryIssues, measurement: "browser", theme, width: dimensions.width * scale, height: dimensions.height * scale, note: "Run PNG QA and inspect the final image; browser measurement alone is not approval." }, null, 2) + "\n");
  }

  console.log(`Exported ${format.toUpperCase()} diagram: ${outputPath}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

/**
 * @param {string[]} argv
 * @returns {Record<string, string | undefined>}
 */
function parseArgs(argv) {
  /** @type {Record<string, string | undefined>} */
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      throw usageError(`Unexpected positional argument "${token}".`);
    }
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw usageError(`Missing value for --${key}.`);
    }
    parsed[key] = value;
    index += 1;
  }
  return parsed;
}

/**
 * @param {Record<string, string | undefined>} args
 * @param {string} key
 */
function requireArg(args, key) {
  const value = args[key];
  if (!value) throw usageError(`Missing required --${key}.`);
  return value;
}

/**
 * @param {string} value
 */
function parseScale(value) {
  const scale = Number(value);
  if (!Number.isFinite(scale) || scale <= 0) {
    throw usageError("--scale must be a positive number.");
  }
  return scale;
}

/**
 * @param {string} inputPath
 * @param {string} format
 * @param {string | undefined} output
 */
function resolveOutputPath(inputPath, format, output) {
  if (output) return output;
  const extension = JPEG_FORMATS.has(format) ? ".jpg" : `.${format}`;
  return inputPath.replace(/\.[^.\\/]+$/, "") + extension;
}

/**
 * @param {string} inputPath
 */
function extractSvg(inputPath) {
  const content = fs.readFileSync(inputPath, "utf8");
  if (inputPath.toLowerCase().endsWith(".svg")) {
    if (!/<svg[\s>]/i.test(content)) {
      throw usageError("SVG input does not contain an <svg> root.");
    }
    return content;
  }

  const svgStart = content.search(/<svg[\s>]/i);
  if (svgStart === -1) {
    throw usageError("HTML input does not contain an inline <svg> element.");
  }
  const afterStart = content.slice(svgStart);
  const svgEnd = afterStart.search(/<\/svg>/i);
  if (svgEnd === -1) {
    throw usageError("HTML input contains an <svg> start tag without a closing </svg>.");
  }
  return afterStart.slice(0, svgEnd + "</svg>".length);
}

/**
 * @param {string} svg
 * @param {string} outputPath
 * @param {string} format
 * @param {number} scale
 * @param {string} background
 */
/**
 * @param {string} pngPath
 * @param {string} outputPath
 */
function convertPngToJpeg(pngPath, outputPath) {
  const converters = [
    () => convertWithMagick(pngPath, outputPath),
    () => convertWithFfmpeg(pngPath, outputPath),
    () => process.platform === "win32" ? convertWithPowerShell(pngPath, outputPath) : false,
    () => process.platform === "darwin" ? convertWithSips(pngPath, outputPath) : false,
  ];

  for (const convert of converters) {
    try {
      if (convert() && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) return;
    } catch {
      // Try the next system converter.
    }
  }

  throw usageError("JPG/JPEG export needs a local image converter after Chromium captures the SVG. Install ImageMagick, FFmpeg, macOS sips, or use SVG/PNG output.");
}

/**
 * @param {string} pngPath
 * @param {string} outputPath
 */
function convertWithMagick(pngPath, outputPath) {
  for (const command of ["magick", "convert"]) {
    const result = spawnSync(command, [pngPath, "-background", "white", "-alpha", "remove", "-quality", "95", outputPath], {
      encoding: "utf8",
      timeout: 15000,
      windowsHide: true,
    });
    if (result.status === 0) return true;
  }
  return false;
}

/**
 * @param {string} pngPath
 * @param {string} outputPath
 */
function convertWithFfmpeg(pngPath, outputPath) {
  const result = spawnSync("ffmpeg", ["-y", "-i", pngPath, "-q:v", "2", outputPath], {
    encoding: "utf8",
    timeout: 15000,
    windowsHide: true,
  });
  return result.status === 0;
}

/**
 * @param {string} pngPath
 * @param {string} outputPath
 */
function convertWithPowerShell(pngPath, outputPath) {
  const script = [
    "Add-Type -AssemblyName System.Drawing",
    `$img = [System.Drawing.Image]::FromFile(${quotePowerShell(pngPath)})`,
    "$bmp = New-Object System.Drawing.Bitmap $img.Width, $img.Height",
    "$graphics = [System.Drawing.Graphics]::FromImage($bmp)",
    "$graphics.Clear([System.Drawing.Color]::White)",
    "$graphics.DrawImage($img, 0, 0, $img.Width, $img.Height)",
    `$bmp.Save(${quotePowerShell(outputPath)}, [System.Drawing.Imaging.ImageFormat]::Jpeg)`,
    "$graphics.Dispose(); $bmp.Dispose(); $img.Dispose()",
  ].join("; ");
  const result = spawnSync("powershell", ["-NoProfile", "-Command", script], {
    encoding: "utf8",
    timeout: 15000,
    windowsHide: true,
  });
  return result.status === 0;
}

/**
 * @param {string} pngPath
 * @param {string} outputPath
 */
function convertWithSips(pngPath, outputPath) {
  fs.copyFileSync(pngPath, outputPath);
  const result = spawnSync("sips", ["-s", "format", "jpeg", outputPath, "--out", outputPath], {
    encoding: "utf8",
    timeout: 15000,
  });
  return result.status === 0;
}

/**
 * @param {string} value
 */
function quotePowerShell(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * @param {string} svg
 */
function measureSvg(svg) {
  const openTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  const width = numberAttr(openTag, "width");
  const height = numberAttr(openTag, "height");
  if (width && height) return { width, height };

  const viewBox = openTag.match(/\bviewBox=(["'])(.*?)\1/i)?.[2]?.trim().split(/\s+/).map(Number);
  if (viewBox && viewBox.length === 4 && viewBox.every(Number.isFinite)) {
    return { width: viewBox[2], height: viewBox[3] };
  }
  return { width: 1280, height: 720 };
}

/**
 * @param {string} tag
 * @param {string} name
 */
function numberAttr(tag, name) {
  const value = tag.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"))?.[2];
  if (!value) return null;
  const number = Number.parseFloat(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

/**
 * @param {string} svg
 * @param {number} width
 * @param {number} height
 * @param {number} scale
 * @param {string} background
 */
function renderScreenshotHtml(svg, width, height, scale, background) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
html, body {
  margin: 0;
  width: ${Math.ceil(width * scale)}px;
  height: ${Math.ceil(height * scale)}px;
  overflow: hidden;
  background: ${background};
}
svg {
  display: block;
  width: ${Math.ceil(width * scale)}px;
  height: ${Math.ceil(height * scale)}px;
}
</style>
</head>
<body>${svg}</body>
</html>
`;
}

/**
 * @param {string} message
 */
function usageError(message) {
  return new Error(message);
}

/** @param {Manifest} manifest @param {number} scale */
function scaleManifest(manifest, scale) {
  /** @param {LabelRect} r */
  const rect = (r) => ({ ...r, x: r.x * scale, y: r.y * scale, width: r.width * scale, height: r.height * scale });
  return { ...manifest, coordinateSpace: "png", scale, canvas: { width: Math.ceil(manifest.canvas.width * scale), height: Math.ceil(manifest.canvas.height * scale) }, boxes: manifest.boxes.map(rect), groups: (manifest.groups ?? []).map(rect), labels: (manifest.labels ?? []).map(rect), connectors: manifest.connectors.map((c) => ({ ...c, points: c.points.map(([x, y]) => [x * scale, y * scale]) })) };
}
