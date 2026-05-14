import { existsSync, readFileSync, writeFileSync } from "node:fs";

const FORMATTABLE = /\.(js|jsx|ts|tsx|vue|css|scss|less|json|md|html)$/;

export async function tryPrettierWrite(absPath: string): Promise<void> {
  if (!absPath || !existsSync(absPath)) return;
  if (!FORMATTABLE.test(absPath)) return;
  try {
    const prettier = await import("prettier");
    const input = readFileSync(absPath, "utf8");
    const output = await prettier.format(input, { filepath: absPath });
    writeFileSync(absPath, output);
  } catch {
    // prettier missing or failed — non-blocking
  }
}

export function pathFromWriteLikeParams(
  toolName: string,
  params: Record<string, unknown> | undefined,
): string {
  if (!params) return "";
  const p =
    params.path ?? params.file_path ?? params.filePath ?? params.target_file;
  return typeof p === "string" ? p.trim() : "";
}
