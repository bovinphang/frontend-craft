// @ts-check

/** @typedef {{x:number,y:number,width:number,height:number}} Rect */
/** @typedef {[number,number]} Point */
/** @typedef {{code:string,id:string,message:string}} QualityIssue */
/** @typedef {{lines:string[],width:number,height:number,fontSize:number,lineHeight:number}} TextLayout */
/** @typedef {Rect & {id:string,label:string,sublabel:string,type:string,actor?:string,step?:string,shape?:"box"|"diamond"|"terminal"}} Box */

/** @param {string} text @param {number} fontSize */
function textWidth(text, fontSize) {
  return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)]
    .reduce((sum, item) => sum + (/^[\x00-\x7f]+$/.test(item.segment) ? fontSize * 0.6 : fontSize), 0);
}

/** @param {string} text @param {number} maxWidth @param {number} [fontSize] @param {number} [lineHeight] @returns {TextLayout} */
export function layoutText(text, maxWidth, fontSize = 14, lineHeight = 20) {
  const limit = Math.max(fontSize, maxWidth);
  /** @type {string[]} */
  const lines = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const { segment: word } of new Intl.Segmenter(undefined, { granularity: "word" }).segment(paragraph)) {
      if (line && textWidth(word,fontSize) <= limit && textWidth(line+word,fontSize)>limit) {lines.push(line);line="";}
      for (const { segment } of new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(word)) {
      if (line && textWidth(line + segment, fontSize) > limit) {
        lines.push(line);
        line = "";
      }
      line += segment;
      }
    }
    lines.push(line);
  }
  return { lines, width: Math.max(0, ...lines.map((line) => textWidth(line, fontSize))), height: lines.length * lineHeight, fontSize, lineHeight };
}

/** @param {Box} source @param {{width:boolean,height:boolean}} explicit */
export function fitNodeText(source, explicit) {
  const box = { ...source };
  if (![box.width, box.height].every((v) => Number.isFinite(v) && v > 0)) throw new Error(`Invalid size for node "${box.id}".`);
  const diamond = box.shape === "diamond" || box.type === "decision";
  const semantic = ["agent", "model", "memory", "vectorstore", "graphdb", "tool", "document", "queue", "browser", "user", "gateway"].includes(box.type);
  if (!explicit.width) box.width = Math.max(box.width, diamond ? 240 : 200);
  const available = diamond ? box.width * 0.5 - 12 : (box.type === "queue" ? box.width - 64 : box.width - 32);
  const main = layoutText(box.label, available);
  const sub = layoutText(box.sublabel, available, 12, 16);
  const header = ["database", "vectorstore"].includes(box.type) ? 30 : box.type === "queue" ? 20 : semantic ? 46 : box.actor ? 40 : 20;
  const contentHeight = main.height + (box.sublabel ? sub.height + 6 : 0);
  const needed = diamond ? (contentHeight + 24) * 2 : header + contentHeight + (["database", "vectorstore"].includes(box.type) ? 30 : 18);
  if (!explicit.height) box.height = Math.max(box.height, needed, 72);
  /** @type {QualityIssue[]} */
  const issues = [];
  if (box.height < needed || available < main.width) issues.push({ code: "node-text-overflow", id: box.id, message: `Node "${box.id}" has an explicit size too small for its complete text.` });
  return { box, labels: [main, sub], issues };
}

/** @param {Rect} box @param {'top'|'right'|'bottom'|'left'} side @returns {Point} */
export function boundaryPort(box, side) {
  if (side === "top") return [box.x + box.width / 2, box.y];
  if (side === "bottom") return [box.x + box.width / 2, box.y + box.height];
  if (side === "left") return [box.x, box.y + box.height / 2];
  return [box.x + box.width, box.y + box.height / 2];
}

/** Strict interior intersection; boundary contact is allowed. @param {Point} a @param {Point} b @param {Rect} r */
export function segmentHits(a, b, r) {
  let lo = 0, hi = 1;
  for (const axis of [0, 1]) {
    const start = axis === 0 ? r.x : r.y;
    const end = start + (axis === 0 ? r.width : r.height);
    const delta = b[axis] - a[axis];
    if (Math.abs(delta) < 1e-8) {
      if (a[axis] <= start + 1e-6 || a[axis] >= end - 1e-6) return false;
    } else {
      const t1 = (start - a[axis]) / delta, t2 = (end - a[axis]) / delta;
      lo = Math.max(lo, Math.min(t1, t2)); hi = Math.min(hi, Math.max(t1, t2));
    }
  }
  return hi - lo > 1e-6;
}

/** @param {Rect} a @param {Rect} b */
export function overlaps(a, b) {
  return Math.min(a.x + a.width, b.x + b.width) > Math.max(a.x, b.x) + 1e-6 && Math.min(a.y + a.height, b.y + b.height) > Math.max(a.y, b.y) + 1e-6;
}

/** @param {Point[]} points @returns {Point[]} */
function simplify(points) {
  return points.filter((p, i) => {
    if (i && p[0] === points[i - 1][0] && p[1] === points[i - 1][1]) return false;
    if (!i || i === points.length - 1) return true;
    const prev = points[i - 1], next = points[i + 1];
    return !((prev[0] === p[0] && next[0] === p[0]) || (prev[1] === p[1] && next[1] === p[1]));
  });
}

/** @param {Rect & {id:string}} from @param {Rect & {id:string}} to @param {Rect[]} obstacles @param {Point[][]} occupied @param {Point[]} [waypoints] */
export function routeConnector(from, to, obstacles, occupied, waypoints) {
  const horizontal = Math.abs(to.x - from.x) >= Math.abs(to.y - from.y);
  const forward = horizontal ? to.x >= from.x : to.y >= from.y;
  const start = boundaryPort(from, horizontal ? (forward ? "right" : "left") : (forward ? "bottom" : "top"));
  const end = boundaryPort(to, horizontal ? (forward ? "left" : "right") : (forward ? "top" : "bottom"));
  /** @type {QualityIssue[]} */
  const issues = [];
  if (waypoints) {
    const points = [start, ...waypoints, end];
    if (points.some((p, i) => i > 0 && obstacles.some((r) => segmentHits(points[i - 1], p, r)))) issues.push({ code: "route-obstructed", id: `${from.id}-${to.id}`, message: "Explicit waypoints cross a non-endpoint node." });
    return { points, issues };
  }
  if (from.id === to.id) {
    const x = from.x + from.width + 40 + occupied.length * 4;
    return { points: /** @type {Point[]} */ ([[from.x + from.width, from.y + from.height / 3], [x, from.y + from.height / 3], [x, from.y + from.height * 2 / 3], [from.x + from.width, from.y + from.height * 2 / 3]]), issues };
  }
  const padded = obstacles.map((r) => ({ x: r.x - 12, y: r.y - 12, width: r.width + 24, height: r.height + 24 }));
  const xSet = new Set([start[0], end[0], 28]), ySet = new Set([start[1], end[1], 28]);
  for (const r of [...padded, from, to]) { xSet.add(r.x - 16); xSet.add(r.x + r.width + 16); ySet.add(r.y - 16); ySet.add(r.y + r.height + 16); }
  for (const route of occupied) for (const [x, y] of route) { xSet.add(x - 16); xSet.add(x + 16); ySet.add(y - 16); ySet.add(y + 16); }
  const xs = [...xSet].filter((x) => x >= 24).sort((a, b) => a - b), ys = [...ySet].filter((y) => y >= 24).sort((a, b) => a - b);
  if (xs.length > 128 || ys.length > 128) return { points: [start, end], issues: [{ code: "route-unresolved", id: `${from.id}-${to.id}`, message: "Routing grid exceeded its bounded search budget." }] };
  const nx = xs.length, ny = ys.length;
  const startId = ys.indexOf(start[1]) * nx + xs.indexOf(start[0]), endId = ys.indexOf(end[1]) * nx + xs.indexOf(end[0]);
  /** @param {number} id @returns {Point} */
  const point = (id) => [xs[id % nx], ys[Math.floor(id / nx)]];
  /** @type {Array<{node:number,dir:number,cost:number,key:string}>} */
  const pending = [{ node: startId, dir: 0, cost: 0, key: `${startId}:0` }];
  const best = new Map([[`${startId}:0`, 0]]), previous = new Map();
  let finish = "";
  while (pending.length) {
    pending.sort((a, b) => a.cost - b.cost || a.node - b.node || a.dir - b.dir);
    const current = pending.shift();
    if (!current || current.cost !== best.get(current.key)) continue;
    if (current.node === endId) { finish = current.key; break; }
    const ix = current.node % nx, iy = Math.floor(current.node / nx);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      if (ix + dx < 0 || ix + dx >= nx || iy + dy < 0 || iy + dy >= ny) continue;
      const next = (iy + dy) * nx + ix + dx, a = point(current.node), b = point(next);
      if ([...padded, from, to].some((r) => segmentHits(a, b, r))) continue;
      const dir = dx ? 1 : 2;
      let penalty = 0;
      for (const route of occupied) for (let i = 1; i < route.length; i++) {
        const p = route[i - 1], q = route[i];
        if ((a[0] === b[0] && p[0] === q[0] && a[0] === p[0] && Math.min(b[1], a[1]) < Math.max(p[1], q[1]) && Math.max(b[1], a[1]) > Math.min(p[1], q[1])) || (a[1] === b[1] && p[1] === q[1] && a[1] === p[1] && Math.min(b[0], a[0]) < Math.max(p[0], q[0]) && Math.max(b[0], a[0]) > Math.min(p[0], q[0]))) penalty += 80;
      }
      const cost = current.cost + Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) + (current.dir && current.dir !== dir ? 24 : 0) + penalty;
      const key = `${next}:${dir}`;
      if (cost < (best.get(key) ?? Infinity)) { best.set(key, cost); previous.set(key, current.key); pending.push({ node: next, dir, cost, key }); }
    }
  }
  if (!finish) return { points: [start, end], issues: [{ code: "route-unresolved", id: `${from.id}-${to.id}`, message: "No obstacle-free route exists without moving explicit nodes." }] };
  /** @type {Point[]} */
  const route = [];
  for (let key = finish; key; key = previous.get(key)) route.unshift(point(Number(key.split(":")[0])));
  return { points: simplify(route), issues };
}

/** @param {Point[]} points @param {TextLayout} layout @param {Rect[]} obstacles @param {Point[][]} [routes] */
export function placeEdgeLabel(points, layout, obstacles, routes = []) {
  const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let remaining = lengths.reduce((a, b) => a + b, 0) / 2;
  let cx = points[0][0], cy = points[0][1];
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const ratio = lengths[i] ? remaining / lengths[i] : 0;
      cx = points[i][0] + (points[i + 1][0] - points[i][0]) * ratio;
      cy = points[i][1] + (points[i + 1][1] - points[i][1]) * ratio;
      break;
    }
    remaining -= lengths[i];
  }
  let rect = { x: cx - layout.width / 2, y: cy - layout.height - 12, width: layout.width, height: layout.height };
  for (const offset of [12,24,36,52,72,96]) for (const direction of ["above","below","left","right"]) {
    const candidate = direction === "above" ? {...rect,y:cy-layout.height-offset} : direction === "below" ? {...rect,y:cy+offset} : direction === "left" ? {...rect,x:cx-layout.width-offset,y:cy-layout.height/2} : {...rect,x:cx+offset,y:cy-layout.height/2};
    if (candidate.x >= 24 && candidate.y >= 24 && !obstacles.some((r) => overlaps(candidate, r)) && !routes.some(route=>route.slice(1).some((point,index)=>segmentHits(route[index],point,{x:candidate.x-4,y:candidate.y-4,width:candidate.width+8,height:candidate.height+8})))) return { rect: candidate, issues: /** @type {QualityIssue[]} */ ([]) };
  }
  return { rect, issues: [{ code: "edge-label-collision", id: "edge", message: "No free label position near route midpoint." }] };
}
