import fs from "node:fs";
import path from "node:path";
import { hashContent } from "../../src/install/shared/fs.js";
import type { InstallContext } from "../../src/install/types.js";

/** Historical fixture schema, independent of the new codec under test. */
export function writeLegacyManifest(
  ctx: Pick<InstallContext, "baseDir" | "runtime" | "isGlobal" | "language"> &
    Partial<InstallContext> & { packageVersion?: string },
  files: string[],
): void {
  fs.mkdirSync(ctx.baseDir, { recursive: true });
  fs.writeFileSync(
    path.join(ctx.baseDir, "frontend-craft.manifest.json"),
    JSON.stringify({
      packageVersion: ctx.packageVersion ?? "2.9.0",
      runtime: ctx.runtime,
      scope: ctx.isGlobal ? "global" : "local",
      language: ctx.language,
      installedAt: "2026-01-01T00:00:00Z",
      files: files.map((file) => ({
        path: path.relative(ctx.baseDir, file).split(path.sep).join("/"),
        hash: hashContent(fs.readFileSync(file)),
      })),
    }),
  );
}
