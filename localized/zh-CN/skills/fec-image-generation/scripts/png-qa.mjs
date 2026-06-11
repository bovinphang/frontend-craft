#!/usr/bin/env node
// @ts-nocheck
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const args = parseArgs(process.argv.slice(2));

if (!args.png || args.help) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}

try {
  const image = readPng(args.png);
  const manifest = args.manifest ? readManifest(args.manifest) : undefined;
  const report = analyze(image, manifest, Boolean(args.strict));
  if ((args.format ?? "markdown") === "json") {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(renderMarkdown(report));
  }
  process.exit(report.ok ? 0 : 2);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

function parseArgs(values) {
  const parsed = { format: "markdown", strict: false, help: false };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") parsed.help = true;
    else if (value === "--strict") parsed.strict = true;
    else if (value === "--png") parsed.png = values[++index];
    else if (value === "--manifest") parsed.manifest = values[++index];
    else if (value === "--format") parsed.format = values[++index];
    else throw new Error(`Unknown argument: ${value}`);
  }
  if (parsed.format !== "json" && parsed.format !== "markdown") {
    throw new Error("--format must be json or markdown");
  }
  return parsed;
}

function printHelp() {
  console.log(`Usage: node skills/fec-image-generation/scripts/png-qa.mjs --png <file> [--manifest <layout.json>] [--format json|markdown] [--strict]`);
}

function readManifest(filePath) {
  const manifest = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return {
    canvas: manifest.canvas,
    boxes: Array.isArray(manifest.boxes) ? manifest.boxes : [],
    connectors: Array.isArray(manifest.connectors) ? manifest.connectors : [],
  };
}

function readPng(filePath) {
  const buffer = fs.readFileSync(filePath);
  const signature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== signature) {
    throw new Error(`Not a PNG file: ${filePath}`);
  }

  let offset = 8;
  let ihdr;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (type === "IHDR") {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (!ihdr) throw new Error("PNG is missing IHDR");
  if (ihdr.bitDepth !== 8) throw new Error(`Unsupported PNG bit depth: ${ihdr.bitDepth}`);
  if (ihdr.compression !== 0 || ihdr.filter !== 0 || ihdr.interlace !== 0) {
    throw new Error("Unsupported PNG compression/filter/interlace settings");
  }

  const channels = channelsForColorType(ihdr.colorType);
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const pixels = unfilter(inflated, ihdr.width, ihdr.height, channels);
  return {
    path: path.resolve(filePath),
    width: ihdr.width,
    height: ihdr.height,
    colorType: ihdr.colorType,
    channels,
    pixels,
  };
}

function channelsForColorType(colorType) {
  if (colorType === 0) return 1;
  if (colorType === 2) return 3;
  if (colorType === 4) return 2;
  if (colorType === 6) return 4;
  throw new Error(`Unsupported PNG color type: ${colorType}`);
}

function unfilter(data, width, height, channels) {
  const stride = width * channels;
  const output = Buffer.alloc(stride * height);
  let sourceOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filterType = data[sourceOffset];
    sourceOffset += 1;
    const rowOffset = y * stride;
    const previousRowOffset = (y - 1) * stride;

    for (let x = 0; x < stride; x += 1) {
      const raw = data[sourceOffset + x];
      const left = x >= channels ? output[rowOffset + x - channels] : 0;
      const up = y > 0 ? output[previousRowOffset + x] : 0;
      const upLeft = y > 0 && x >= channels ? output[previousRowOffset + x - channels] : 0;
      let value;
      if (filterType === 0) value = raw;
      else if (filterType === 1) value = raw + left;
      else if (filterType === 2) value = raw + up;
      else if (filterType === 3) value = raw + Math.floor((left + up) / 2);
      else if (filterType === 4) value = raw + paeth(left, up, upLeft);
      else throw new Error(`Unsupported PNG filter type: ${filterType}`);
      output[rowOffset + x] = value & 0xff;
    }
    sourceOffset += stride;
  }

  return output;
}

function paeth(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);
  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  if (upDistance <= upLeftDistance) return up;
  return upLeft;
}

function analyze(image, manifest, strict) {
  const issues = [];
  const nextActions = new Set();
  const ink = measureInk(image, strict ? 10 : 18);

  if (image.width < 64 || image.height < 64) {
    addIssue(issues, nextActions, "image-too-small", "PNG is too small for reliable visual QA.", "Export a larger PNG before review.");
  }

  if (ink.coverage < (strict ? 0.001 : 0.0002)) {
    addIssue(issues, nextActions, "blank-image", "PNG appears blank or nearly blank.", "Check the renderer/export target and regenerate the image.");
  }

  if (ink.bounds) {
    const pad = strict ? 6 : 3;
    if (ink.bounds.minX <= pad || ink.bounds.minY <= pad || image.width - ink.bounds.maxX <= pad || image.height - ink.bounds.maxY <= pad) {
      addIssue(issues, nextActions, "edge-clipping", "Visible content is very close to the PNG edge.", "Increase canvas/viewBox padding or reduce subject scale.");
    }
  }

  if (manifest) analyzeManifest(image, manifest, issues, nextActions, strict);

  return {
    ok: issues.length === 0,
    image: {
      path: image.path,
      width: image.width,
      height: image.height,
      colorType: image.colorType,
      inkCoverage: Number(ink.coverage.toFixed(6)),
      inkBounds: ink.bounds,
    },
    issues,
    nextActions: [...nextActions],
  };
}

function measureInk(image, threshold) {
  const first = samplePixel(image, 0, 0);
  let inkPixels = 0;
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const pixel = samplePixel(image, x, y);
      const differs = colorDistance(pixel, first) > threshold && pixel.a > 8;
      if (differs) {
        inkPixels += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    coverage: inkPixels / (image.width * image.height),
    bounds: inkPixels > 0 ? { minX, minY, maxX, maxY } : null,
  };
}

function samplePixel(image, x, y) {
  const offset = (y * image.width + x) * image.channels;
  if (image.channels === 1) {
    const value = image.pixels[offset];
    return { r: value, g: value, b: value, a: 255 };
  }
  if (image.channels === 2) {
    const value = image.pixels[offset];
    return { r: value, g: value, b: value, a: image.pixels[offset + 1] };
  }
  return {
    r: image.pixels[offset],
    g: image.pixels[offset + 1],
    b: image.pixels[offset + 2],
    a: image.channels === 4 ? image.pixels[offset + 3] : 255,
  };
}

function colorDistance(left, right) {
  return Math.abs(left.r - right.r) + Math.abs(left.g - right.g) + Math.abs(left.b - right.b) + Math.abs(left.a - right.a);
}

function analyzeManifest(image, manifest, issues, nextActions, strict) {
  if (manifest.canvas && (manifest.canvas.width !== image.width || manifest.canvas.height !== image.height)) {
    addIssue(
      issues,
      nextActions,
      "manifest-canvas-mismatch",
      `Manifest canvas ${manifest.canvas.width}x${manifest.canvas.height} does not match PNG ${image.width}x${image.height}.`,
      "Regenerate the manifest from the final export dimensions.",
    );
  }

  const boxes = manifest.boxes.map(normalizeBox).filter(Boolean);
  for (const box of boxes) {
    if (box.x < 0 || box.y < 0 || box.x + box.width > image.width || box.y + box.height > image.height) {
      addIssue(issues, nextActions, "box-out-of-bounds", `Box "${box.id}" is outside the canvas.`, "Move out-of-bounds nodes inside the canvas or expand the canvas.");
    }
    if (box.label && estimateLabelOverflow(box, strict)) {
      addIssue(issues, nextActions, "label-overflow", `Box "${box.id}" label is likely to overflow.`, "Wrap or shorten labels, widen boxes, or increase export scale.");
    }
  }

  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const overlap = overlapArea(boxes[i], boxes[j]);
      if (overlap > 0) {
        addIssue(issues, nextActions, "box-overlap", `Boxes "${boxes[i].id}" and "${boxes[j].id}" overlap by ${Math.round(overlap)}px^2.`, "Increase node spacing or split dense groups.");
      }
    }
  }

  const boxById = new Map(boxes.map((box) => [box.id, box]));
  const segments = [];
  for (const connector of manifest.connectors) {
    const points = normalizePoints(connector.points);
    for (let index = 0; index < points.length - 1; index += 1) {
      const segment = { connector, a: points[index], b: points[index + 1] };
      segments.push(segment);
      for (const box of boxes) {
        if (box.id === connector.from || box.id === connector.to) continue;
        if (segmentIntersectsBox(segment, box)) {
          addIssue(issues, nextActions, "connector-through-label", `Connector "${connector.id ?? "unnamed"}" crosses box "${box.id}".`, "Add waypoints around labels or use orthogonal routing.");
        }
      }
    }
    if ((connector.from && !boxById.has(connector.from)) || (connector.to && !boxById.has(connector.to))) {
      addIssue(issues, nextActions, "connector-endpoint-missing", `Connector "${connector.id ?? "unnamed"}" references a missing endpoint.`, "Update connector endpoints to match manifest box ids.");
    }
  }

  for (let i = 0; i < segments.length; i += 1) {
    for (let j = i + 1; j < segments.length; j += 1) {
      if (segments[i].connector === segments[j].connector) continue;
      if (segmentsStack(segments[i], segments[j], strict ? 4 : 2)) {
        addIssue(issues, nextActions, "connector-stacking", "Two connector segments are stacked or nearly stacked.", "Offset parallel connectors or bundle them into a labeled shared route.");
      }
    }
  }
}

function normalizeBox(box) {
  if (!box || typeof box.id !== "string") return null;
  const normalized = {
    id: box.id,
    x: Number(box.x),
    y: Number(box.y),
    width: Number(box.width),
    height: Number(box.height),
    label: typeof box.label === "string" ? box.label : "",
  };
  if ([normalized.x, normalized.y, normalized.width, normalized.height].some((value) => !Number.isFinite(value))) return null;
  return normalized;
}

function normalizePoints(points) {
  if (!Array.isArray(points)) return [];
  return points
    .map((point) => {
      if (Array.isArray(point)) return { x: Number(point[0]), y: Number(point[1]) };
      return { x: Number(point?.x), y: Number(point?.y) };
    })
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

function estimateLabelOverflow(box, strict) {
  const label = box.label.trim();
  if (!label) return false;
  const lines = label.split(/\r?\n/);
  const maxLine = Math.max(...lines.map((line) => visualLength(line)));
  const estimatedWidth = maxLine * (strict ? 7.5 : 7);
  const estimatedHeight = lines.length * (strict ? 18 : 16);
  return estimatedWidth > Math.max(0, box.width - 12) || estimatedHeight > Math.max(0, box.height - 8);
}

function visualLength(value) {
  return [...value].reduce((total, char) => total + (/[\u4e00-\u9fff]/.test(char) ? 2 : 1), 0);
}

function overlapArea(left, right) {
  const width = Math.max(0, Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x));
  const height = Math.max(0, Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y));
  return width * height;
}

function segmentIntersectsBox(segment, box) {
  if (pointInsideBox(segment.a, box) || pointInsideBox(segment.b, box)) return true;
  const edges = [
    [{ x: box.x, y: box.y }, { x: box.x + box.width, y: box.y }],
    [{ x: box.x + box.width, y: box.y }, { x: box.x + box.width, y: box.y + box.height }],
    [{ x: box.x + box.width, y: box.y + box.height }, { x: box.x, y: box.y + box.height }],
    [{ x: box.x, y: box.y + box.height }, { x: box.x, y: box.y }],
  ];
  return edges.some(([a, b]) => segmentsIntersect(segment.a, segment.b, a, b));
}

function pointInsideBox(point, box) {
  return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
}

function segmentsIntersect(a, b, c, d) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  if (o1 !== o2 && o3 !== o4) return true;
  return false;
}

function orientation(a, b, c) {
  const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (Math.abs(value) < 0.0001) return 0;
  return value > 0 ? 1 : 2;
}

function segmentsStack(left, right, tolerance) {
  const leftHorizontal = Math.abs(left.a.y - left.b.y) <= tolerance;
  const rightHorizontal = Math.abs(right.a.y - right.b.y) <= tolerance;
  const leftVertical = Math.abs(left.a.x - left.b.x) <= tolerance;
  const rightVertical = Math.abs(right.a.x - right.b.x) <= tolerance;

  if (leftHorizontal && rightHorizontal && Math.abs(left.a.y - right.a.y) <= tolerance) {
    return rangesOverlap([left.a.x, left.b.x], [right.a.x, right.b.x]) > tolerance;
  }
  if (leftVertical && rightVertical && Math.abs(left.a.x - right.a.x) <= tolerance) {
    return rangesOverlap([left.a.y, left.b.y], [right.a.y, right.b.y]) > tolerance;
  }
  return false;
}

function rangesOverlap(left, right) {
  const a = [Math.min(...left), Math.max(...left)];
  const b = [Math.min(...right), Math.max(...right)];
  return Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0]));
}

function addIssue(issues, nextActions, code, message, action) {
  issues.push({ code, message, action });
  nextActions.add(action);
}

function renderMarkdown(report) {
  const lines = [
    "# PNG QA Report",
    "",
    `- Status: ${report.ok ? "ok" : "issues-found"}`,
    `- Image: ${report.image.width}x${report.image.height}`,
    `- Ink coverage: ${report.image.inkCoverage}`,
  ];
  if (report.image.inkBounds) {
    lines.push(`- Ink bounds: ${JSON.stringify(report.image.inkBounds)}`);
  }
  lines.push("", "## Issues");
  if (report.issues.length === 0) {
    lines.push("- None");
  } else {
    for (const issue of report.issues) {
      lines.push(`- ${issue.code}: ${issue.message}`);
    }
  }
  lines.push("", "## Next Actions");
  if (report.nextActions.length === 0) {
    lines.push("- None");
  } else {
    for (const action of report.nextActions) lines.push(`- ${action}`);
  }
  return `${lines.join("\n")}\n`;
}
