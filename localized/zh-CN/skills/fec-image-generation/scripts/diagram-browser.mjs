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

/**
 * Export failures must stay within the wording callers match on, so CDP details are wrapped here.
 * @param {string} detail @returns {Error}
 */
const exportFailure = (detail) => new Error(`Browser raster export failed: ${detail}`);

/**
 * Chromium keeps profile files locked until its whole process tree is gone, so cleanup waits for
 * the process instead of sleeping a fixed amount. @param {ReturnType<typeof spawn>} child @param {number} ms @returns {Promise<void>}
 */
const waitForExit = async (child, ms) => {
  if (child.exitCode !== null) return;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;
  await new Promise((resolve) => {
    const finish = () => { if (timer) clearTimeout(timer); child.off("exit", finish); resolve(undefined); };
    timer = setTimeout(finish, ms);
    child.once("exit", finish);
  });
};

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
    const deadline = Date.now() + Math.min(15000, options.timeoutMs);
    const portFile = path.join(profile, "DevToolsActivePort");
    while (!fs.existsSync(portFile) && Date.now() < deadline && (child.exitCode === null || child.exitCode === 0) && !childError) await new Promise((resolve) => setTimeout(resolve, 50));
    if (!fs.existsSync(portFile)) throw exportFailure(`browser did not start a debugging session${childError ? ` (${childError})` : ""}.`);
    const port = Number(fs.readFileSync(portFile, "utf8").split("\n")[0]);
    // A page target is about:blank until its document commits; evaluating during that window races
    // the replacement ("Execution context was destroyed"). Wait for the file URL before attaching.
    /** @type {{webSocketDebuggerUrl?:string}|undefined} */
    let target;
    while (Date.now() < deadline) {
      const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(Math.min(5000, options.timeoutMs)) })).json();
      target = pages.find(/** @param {{type:string,url:string}} p */ (p) => p.type === "page" && p.url.startsWith("file:"));
      if (target) break;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    if (!target?.webSocketDebuggerUrl) throw exportFailure("browser did not create a diagram page.");
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket?.addEventListener("open", resolve, { once: true }); socket?.addEventListener("error", reject, { once: true }); });
    /** @type {Map<number,{resolve:(value:Record<string,unknown>)=>void,reject:(reason:Error)=>void}>} */
    const pending = new Map();
    socket.addEventListener("close", () => { for (const entry of pending.values()) entry.reject(exportFailure("session closed before export completed.")); pending.clear(); });
    let serial = 0;
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      const entry = pending.get(message.id);
      if (!entry) return;
      pending.delete(message.id);
      if (message.error) entry.reject(exportFailure(message.error.message)); else entry.resolve(message.result ?? {});
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
    return await Promise.race([work(), new Promise(/** @param {(reason:Error)=>void} reject */ (_, reject) => { timer = setTimeout(() => reject(exportFailure("export timed out.")), options.timeoutMs); })]);
  } finally {
    if (timer) clearTimeout(timer);
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ id: 999999, method: "Browser.close" }));
    // Browser.close is graceful, so wait for the process rather than guessing with a fixed sleep:
    // Chromium's child processes keep profile files locked until the tree is gone.
    await waitForExit(child, 2000);
    socket?.close();
    if (child.exitCode === null) child.kill();
    // The Chromium profile is owned by this invocation only. Windows may release locks after exit.
    try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }); } catch { /* A locked temporary profile can be removed by OS cleanup. */ }
  }
}
