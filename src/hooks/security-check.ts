import { stdin } from "node:process";

const chunks: Buffer[] = [];
for await (const chunk of stdin) chunks.push(chunk);
const input = Buffer.concat(chunks).toString();

let command = "";
try {
  const data = JSON.parse(input);
  command = data?.tool_input?.command ?? "";
} catch {
  process.exit(0);
}

if (!command) process.exit(0);

const dangerous = [
  /rm\s+-rf\s+\//i,
  /rm\s+-rf\s+\/\*/i,
  /\bremove-item\b.*\b-recurse\b.*\b-force\b.*(?:[a-z]:\\|\/|~)/i,
  /\brmdir\b.*\/s\b.*\/q\b/i,
  /\bdel\b.*\/[fsq]\b/i,
  /\bchmod\b\s+-R\s+777\b/i,
  /\bchown\b\s+-R\b/i,
  /git\s+push\s+.*--force/i,
  /\bgit\s+clean\b.*-[^\s]*f[^\s]*d/i,
  /\bmkfs\b/i,
  /\bdd\s+if=/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
  /curl\s+.*\|\s*sh/i,
  /wget\s+.*\|\s*sh/i,
  /\biwr\b.*\|\s*iex\b/i,
  /\binvoke-webrequest\b.*\|\s*invoke-expression\b/i,
  /\b(printenv|env|set)\b.*(TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY)/i,
  /\bcat\b.*\.(env|npmrc|pypirc)\b/i,
  /\bnpm\s+run\b.*(?:postinstall|preinstall|prepare).*(?:curl|wget|iwr|iex|rm\s+-rf)/i,
  /DROP\s+TABLE/i,
  /DROP\s+DATABASE/i,
  /format\s+c:/i,
  />\s*\/dev\/sda/i,
];

for (const pattern of dangerous) {
  if (pattern.test(command)) {
    process.stderr.write(
      `Blocked potentially dangerous command by frontend-craft: matched pattern '${pattern}'`
    );
    process.exit(2);
  }
}

const longRunning = [
  /\b(npm|pnpm|yarn|bun)\s+(run\s+)?dev\b/i,
  /\b(npm|pnpm|yarn|bun)\s+(run\s+)?(test|build)\b/i,
  /\b(vitest|playwright|cypress)\b/i,
];

if (longRunning.some((pattern) => pattern.test(command))) {
  process.stderr.write(
    "frontend-craft note: long-running frontend commands are easier to debug when their logs stay visible in a persistent terminal or CI artifact.\n",
  );
}

process.exit(0);
