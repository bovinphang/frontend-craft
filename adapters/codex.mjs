import path from "path";
import { escapeTomlBasicString, parseMarkdownBundle } from "./shared.mjs";

export function buildCodex(sourceBundle) {
  const { metadata, body } = parseMarkdownBundle(sourceBundle.raw);

  const normalizedBody = body
    .replace(/\.claude\/rules/g, ".codex/rules")
    .replace(/\bCLAUDE\.md\b/g, "AGENTS.md");

  const output =
    `name = "${metadata.name}"\n` +
    `description = "${escapeTomlBasicString(metadata.description ?? "")}"\n\n` +
    `model = "gpt-5.4"\n` +
    `model_reasoning_effort = "high"\n\n` +
    `developer_instructions = """\n` +
    `${normalizedBody}\n` +
    `"""\n`;

  return {
    outputPath: path.join(sourceBundle.outputDir, sourceBundle.fileName.replace(/\.md$/, ".toml")),
    content: output,
  };
}
