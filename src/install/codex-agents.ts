import path from "node:path";
import { parseAgentDocument } from "./shared/frontmatter.js";

/**
 * Convert Claude-style agent markdown to Codex agent TOML.
 * @param {string} raw
 * @param {string} filename
 */
export function agentMdToToml(raw: string, filename: string): string {
  const parsed = parseAgentDocument(
    raw,
    filename,
    path.basename(filename, ".md"),
  );
  const body = parsed.body
    .trim()
    .replace(/\.claude\/rules/g, ".codex/rules")
    .replace(/\bCLAUDE\.md\b/g, "AGENTS.md");
  const { name, description } = parsed.metadata;
  // JSON string escapes also encode TOML basic strings; encode other control characters explicitly.
  const encode = (value: string): string =>
    JSON.stringify(value).replace(/[\u007f]/g, "\\u007f");
  return (
    `name = ${encode(name)}\n` +
    `description = ${encode(description)}\n\n` +
    `developer_instructions = ${encode(body)}\n`
  );
}
