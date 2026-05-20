import { stdin } from "node:process";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

const chunks: Buffer[] = [];
for await (const chunk of stdin) chunks.push(chunk);
const input = Buffer.concat(chunks).toString();

let filePath = "";
try {
  const data = JSON.parse(input);
  filePath = data?.tool_input?.file_path ?? data?.tool_input?.filePath ?? "";
} catch {
  process.exit(0);
}

if (!filePath || !existsSync(filePath)) process.exit(0);

const formattable = /\.(js|jsx|ts|tsx|vue|css|scss|less|json|md|html)$/;
if (!formattable.test(filePath)) process.exit(0);

try {
  execSync(`npx prettier --write "${filePath}"`, { stdio: "ignore" });
} catch {
  // prettier not available or failed, not blocking
}

process.exit(0);
