export function parseMarkdownBundle(raw) {
  const matched = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!matched) {
    throw new Error("Missing frontmatter section");
  }

  const frontmatter = matched[1];
  const body = matched[2].trim();

  const data = Object.fromEntries(
    frontmatter
      .split(/\r?\n/)
      .map((line) => line.match(/^([^:]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key.trim(), value.trim()]),
  );

  return { metadata: data, body };
}

export function escapeTomlBasicString(value) {
  return value.replace(/\\/g, "\\\\").replace(/\"/g, '\\\"');
}
