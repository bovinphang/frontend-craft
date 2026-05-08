import path from "path";
import { parseMarkdownBundle } from "./shared.mjs";

export function buildOpenclaw(sourceBundle) {
  const { metadata, body } = parseMarkdownBundle(sourceBundle.raw);

  const output = JSON.stringify(
    {
      metadata: {
        title: metadata.name,
        summary: metadata.description ?? "",
        platform: "openclaw",
      },
      commandPrefix: "openclaw",
      instruction: body,
    },
    null,
    2,
  );

  return {
    outputPath: path.join(sourceBundle.outputDir, sourceBundle.fileName.replace(/\.md$/, ".openclaw.json")),
    content: output + "\n",
  };
}
