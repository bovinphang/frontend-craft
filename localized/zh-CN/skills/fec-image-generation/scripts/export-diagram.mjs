#!/usr/bin/env node
// @ts-check

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SUPPORTED_FORMATS = new Set(["svg", "png", "jpg", "jpeg"]);
const JPEG_FORMATS = new Set(["jpg", "jpeg"]);

try {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(requireArg(args, "input"));
  const format = requireArg(args, "format").toLowerCase();
  const scale = args.scale === undefined ? 2 : parseScale(args.scale);
  const background = args.background ?? "#0f172a";

  if (!SUPPORTED_FORMATS.has(format)) {
    throw usageError(`Unsupported --format "${format}". Expected svg, png, jpg, or jpeg.`);
  }
  if (!fs.existsSync(inputPath)) {
    throw usageError(`Input file does not exist: ${inputPath}`);
  }

  const svg = extractSvg(inputPath);
  const outputPath = path.resolve(resolveOutputPath(inputPath, format, args.output));

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  if (format === "svg") {
    fs.writeFileSync(outputPath, `${svg.trim()}\n`, "utf8");
  } else {
    exportRaster(svg, outputPath, format, scale, background);
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
function exportRaster(svg, outputPath, format, scale, background) {
  const browser = findBrowser();
  if (!browser) {
    throw usageError(
      "PNG/JPG export requires a local Chromium browser (Chrome, Edge, Chromium, Brave, or Vivaldi) because Node.js has no built-in SVG rasterizer. Export SVG instead, or install a Chromium browser and rerun this command.",
    );
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-diagram-export-"));
  const htmlPath = path.join(tempDir, "diagram.html");
  const screenshotPath = path.join(tempDir, "diagram.png");
  const { width, height } = measureSvg(svg);
  const viewportWidth = Math.ceil(width * scale);
  const viewportHeight = Math.ceil(height * scale);

  try {
    fs.writeFileSync(htmlPath, renderScreenshotHtml(svg, width, height, scale, background), "utf8");

    const result = spawnSync(browser, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${viewportWidth},${viewportHeight}`,
      `--screenshot=${screenshotPath}`,
      pathToFileURL(htmlPath).href,
    ], {
      encoding: "utf8",
      timeout: 30000,
      windowsHide: true,
    });

    if (result.status !== 0 || !fs.existsSync(screenshotPath)) {
      throw usageError(`Browser raster export failed: ${result.stderr || result.stdout || `exit code ${result.status}`}`.trim());
    }

    if (JPEG_FORMATS.has(format)) {
      convertPngToJpeg(screenshotPath, outputPath);
    } else {
      fs.copyFileSync(screenshotPath, outputPath);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

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

function findBrowser() {
  const envBrowser = process.env.CHROME_PATH || process.env.EDGE_PATH || process.env.BROWSER;
  const candidates = [
    envBrowser,
    process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : undefined,
    process.platform === "win32" ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" : undefined,
    process.platform === "win32" ? "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe" : undefined,
    process.platform === "win32" ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" : undefined,
    process.platform === "darwin" ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" : undefined,
    process.platform === "darwin" ? "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" : undefined,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "microsoft-edge",
    "msedge",
    "brave-browser",
    "vivaldi",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    if (path.isAbsolute(candidate) && fs.existsSync(candidate)) return candidate;
    if (!path.isAbsolute(candidate)) {
      const result = spawnSync(candidate, ["--version"], { encoding: "utf8", timeout: 5000, windowsHide: true });
      if (result.status === 0) return candidate;
    }
  }
  return null;
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
