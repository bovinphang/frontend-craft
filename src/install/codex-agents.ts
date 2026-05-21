/**
 * Convert Claude-style agent markdown to Codex agent TOML.
 * @param {string} raw
 * @param {string} filename
 */
export function agentMdToToml(raw, filename) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter: ${filename}`);
  const fm = m[1];
  const body = m[2]
    .trim()
    .replace(/\.claude\/rules/g, ".codex/rules")
    .replace(/\bCLAUDE\.md\b/g, "AGENTS.md");
  const nameM = fm.match(/^name:\s*(.+)$/m);
  if (!nameM) throw new Error(`no name in frontmatter: ${filename}`);
  const name = nameM[1].trim();
  const dm = fm.match(/^description:\s*(.+)$/m);
  const desc = dm ? dm[1].trim() : "";
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return (
    `name = "${name}"\n` +
    `description = "${esc(desc)}"\n\n` +
    `model = "gpt-5.4"\n` +
    `model_reasoning_effort = "high"\n\n` +
    `developer_instructions = """\n` +
    body +
    `\n"""\n`
  );
}
