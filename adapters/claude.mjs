import path from "path";
import { parseMarkdownBundle } from "./shared.mjs";

export function buildClaude(sourceBundle) {
  const { metadata, body } = parseMarkdownBundle(sourceBundle.raw);

  const output =
    `---\n` +
    `name: ${metadata.name}\n` +
    `description: ${metadata.description ?? ""}\n` +
    `---\n\n` +
    `/agent ${metadata.name}\n\n` +
    body +
    `\n`;

  return {
    outputPath: path.join(sourceBundle.outputDir, sourceBundle.fileName),
    content: output,
  };
}
