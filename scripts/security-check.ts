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
  /git\s+push\s+.*--force/i,
  /\bmkfs\b/i,
  /\bdd\s+if=/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
  /curl\s+.*\|\s*sh/i,
  /wget\s+.*\|\s*sh/i,
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

process.exit(0);
