// @ts-check
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export function findBrowser() {
  const candidates = [process.env.FEC_BROWSER_PATH,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "google-chrome", "chromium", "chromium-browser", "msedge", "brave-browser", "vivaldi"];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (path.isAbsolute(candidate) ? fs.existsSync(candidate) : spawnSync(candidate, ["--version"], { timeout: 5000, windowsHide: true, stdio: "ignore" }).status === 0) return candidate;
  }
  return null;
}

/** @typedef {{evaluate:(expression:string)=>Promise<unknown>,screenshot:(width:number,height:number,scale?:number)=>Promise<Buffer>}} DiagramSession */

/** @template T @param {string} html @param {{theme:'light'|'dark',timeoutMs:number}} options @param {(session:DiagramSession)=>Promise<T>} action @returns {Promise<T>} */
export async function withDiagramPage(html, options, action) {
  const browser = findBrowser();
  if (!browser) throw new Error("PNG/JPG export requires a local Chromium browser. Export SVG instead, or install a Chromium browser and rerun this command.");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-diagram-browser-"));
  const page = path.join(dir, "diagram.html"), profile = path.join(dir, "profile");
  fs.writeFileSync(page, html);
  const child = spawn(browser, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--remote-debugging-port=0", "--remote-allow-origins=http://localhost", `--user-data-dir=${profile}`, pathToFileURL(page).href], { windowsHide: true, stdio: "ignore" });
  let childError = "";
  child.on("error", (error) => { childError = error.message; });
  /** @type {WebSocket | undefined} */
  let socket;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;
  try {
    const work = async () => {
    const deadline = Date.now() + Math.min(5000, options.timeoutMs);
    const portFile = path.join(profile, "DevToolsActivePort");
    while (!fs.existsSync(portFile) && Date.now() < deadline && (child.exitCode === null || child.exitCode === 0) && !childError) await new Promise((resolve) => setTimeout(resolve, 50));
    if (!fs.existsSync(portFile)) throw new Error(`Browser raster export failed: browser did not start a debugging session${childError ? ` (${childError})` : ""}.`);
    const port = Number(fs.readFileSync(portFile, "utf8").split("\n")[0]);
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(Math.min(5000, options.timeoutMs)) })).json();
    const target = pages.find(/** @param {{type:string}} p */ (p) => p.type === "page");
    if (!target?.webSocketDebuggerUrl) throw new Error("Browser did not create a diagram page.");
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket?.addEventListener("open", resolve, { once: true }); socket?.addEventListener("error", reject, { once: true }); });
    /** @type {Map<number,{resolve:(value:Record<string,unknown>)=>void,reject:(reason:Error)=>void}>} */
    const pending = new Map();
    socket.addEventListener("close", () => { for (const entry of pending.values()) entry.reject(new Error("Browser session closed before export completed.")); pending.clear(); });
    let serial = 0;
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message)); else entry.resolve(message.result ?? {});
    });
    /** @param {string} method @param {Record<string,unknown>} [params] @returns {Promise<Record<string,unknown>>} */
    const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++serial; pending.set(id, { resolve, reject }); socket?.send(JSON.stringify({ id, method, params })); });
    /** @param {string} expression */
    const evaluate = async (expression) => {
      const result = await call("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(`Diagram evaluation failed: ${JSON.stringify(result.exceptionDetails)}`);
      return /** @type {{value?:unknown}} */ (result.result).value;
    };
    /** @type {DiagramSession} */
    const session = { evaluate, screenshot: async (width, height, scale = 1) => {
      await call("Emulation.setDeviceMetricsOverride", { width: Math.ceil(width), height: Math.ceil(height), deviceScaleFactor: scale, mobile: false });
      const result = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
      return Buffer.from(String(result.data), "base64");
    } };
    await evaluate(`(async()=>{if(document.readyState!=="complete")await new Promise(r=>window.addEventListener("load",r,{once:true}));await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));})()`);
    return await action(session);
    };
    return await Promise.race([work(), new Promise(/** @param {(reason:Error)=>void} reject */ (_, reject) => { timer = setTimeout(() => reject(new Error("Browser export timed out.")), options.timeoutMs); })]);
  } finally {
    if (timer) clearTimeout(timer);
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ id: 999999, method: "Browser.close" }));
    await new Promise((resolve) => setTimeout(resolve, 120));
    socket?.close();
    child.kill();
    // The Chromium profile is owned by this invocation only. Windows may release locks after exit.
    await new Promise((resolve) => setTimeout(resolve, 120));
    try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }); } catch { /* A locked temporary profile can be removed by OS cleanup. */ }
  }
}
