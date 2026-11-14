import { prepareContent, checkSourceContent } from "./prepare-content.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncProductSnapshot } from "@bovinphang/craft-common";
import { SNAPSHOT_DECLARATIONS } from "../src/install/shared/snapshot-declarations.js";
export function syncCommonContent(input: {
  productRoot: string;
  commonRoot: string;
  check: boolean;
}): void {
  syncProductSnapshot({ ...input, ...SNAPSHOT_DECLARATIONS });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const rootIndex = args.indexOf("--common-root");
  const commonRoot =
    rootIndex < 0
      ? path.resolve(
          path.dirname(
            fileURLToPath(import.meta.resolve("@bovinphang/craft-common")),
          ),
          "..",
        )
      : args[rootIndex + 1];
  if (!commonRoot) throw new Error("--common-root 需要包目录");
  const sourceRoot = path.resolve(import.meta.dirname, "..");
  if (args.includes("--check")) {
    checkSourceContent(sourceRoot);
    syncCommonContent({
      productRoot: path.join(sourceRoot, "dist/package"),
      commonRoot,
      check: true,
    });
  } else prepareContent({ sourceRoot, commonRoot });
  console.log(
    args.includes("--check") ? "公共内容快照一致" : "已同步公共内容快照",
  );
}
