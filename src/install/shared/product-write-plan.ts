import type { FileMutation } from "@bovinphang/craft-common";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
let draft: Map<string, FileMutation> | undefined;
const hash = (bytes: Buffer): string =>
  createHash("sha256").update(bytes).digest("hex");
export const isPlanningWrites = (): boolean => Boolean(draft);
export const getPlannedProductMutations = (): readonly FileMutation[] => [
  ...(draft?.values() ?? []),
];
function stage(file: string, after: Buffer | null): void {
  const target = path.resolve(file);
  const previous = draft?.get(target);
  const beforeHash = previous
    ? previous.beforeHash
    : fs.existsSync(target)
      ? hash(fs.readFileSync(target))
      : null;
  draft!.set(target, { path: target, beforeHash, after });
}
export function writeProductFile(file: string, bytes: Buffer): void {
  if (draft) {
    stage(file, bytes);
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
}
export function removeProductFile(file: string): void {
  if (draft) {
    stage(file, null);
    return;
  }
  fs.rmSync(file, { force: true });
}
export function readProductFile(file: string): Buffer {
  const pending = draft?.get(path.resolve(file));
  if (pending?.after) return pending.after;
  if (pending?.after === null)
    throw Object.assign(new Error(`已计划删除：${file}`), { code: "ENOENT" });
  return fs.readFileSync(file);
}
export function productFileExists(file: string): boolean {
  const pending = draft?.get(path.resolve(file));
  return pending ? pending.after !== null : fs.existsSync(file);
}
export async function planProductMutations(
  operation: () => Promise<void>,
): Promise<FileMutation[]> {
  if (draft) throw new Error("产品写入规划不允许嵌套或并发");
  draft = new Map();
  try {
    await operation();
    return [...draft.values()].filter((file) =>
      file.after === null
        ? file.beforeHash !== null
        : hash(file.after) !== file.beforeHash,
    );
  } finally {
    draft = undefined;
  }
}
