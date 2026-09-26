import { isMap, LineCounter, parseDocument } from "yaml";

export interface BaseMetadata {
  name: string;
  description: string;
}

export interface CommandMetadata extends BaseMetadata {
  "argument-hint"?: string;
}

export interface AgentMetadata extends BaseMetadata {
  tools?: string;
  model?: string;
  permissionMode?: "default" | "acceptEdits";
  maxTurns?: number;
  skills?: string[];
  mcpServers?: string[];
}

export function parseFrontmatter(
  raw: string,
  source: string,
): { fields: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${source}: missing frontmatter`);
  const lineCounter = new LineCounter();
  const doc = parseDocument(match[1], {
    lineCounter,
    uniqueKeys: true,
    strict: true,
  });
  if (doc.errors.length) {
    const error = doc.errors[0];
    const position = lineCounter.linePos(error.pos[0]);
    throw new Error(
      `${source}: ${error.code} at line ${position.line + 1}, column ${position.col}: ${error.message}`,
    );
  }
  if (!isMap(doc.contents))
    throw new Error(`${source}: frontmatter must be a mapping`);
  const fields: unknown = doc.toJS({ maxAliasCount: 10 });
  if (!fields || typeof fields !== "object" || Array.isArray(fields))
    throw new Error(`${source}: frontmatter must be a mapping`);
  return { fields: fields as Record<string, unknown>, body: match[2] };
}

function stringField(
  fields: Record<string, unknown>,
  key: string,
  source: string,
): string {
  const value = fields[key];
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${source}: ${key} must be a nonempty string`);
  return value;
}

function baseMetadata(
  fields: Record<string, unknown>,
  source: string,
  expectedName?: string,
): BaseMetadata {
  const name = stringField(fields, "name", source);
  if (
    !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name) ||
    (expectedName !== undefined && name !== expectedName)
  ) {
    throw new Error(`${source}: invalid or mismatched name ${name}`);
  }
  return { name, description: stringField(fields, "description", source) };
}

function assertKeys(
  fields: Record<string, unknown>,
  allowed: string[],
  source: string,
): void {
  for (const key of Object.keys(fields)) {
    if (!allowed.includes(key))
      throw new Error(`${source}: unknown field ${key}`);
  }
}

export function parseSkillDocument(
  raw: string,
  source: string,
  expectedName?: string,
): { metadata: BaseMetadata; body: string } {
  const { fields, body } = parseFrontmatter(raw, source);
  assertKeys(fields, ["name", "description"], source);
  return { metadata: baseMetadata(fields, source, expectedName), body };
}

export function parseCommandDocument(
  raw: string,
  source: string,
  expectedName?: string,
): { metadata: CommandMetadata; body: string } {
  const { fields, body } = parseFrontmatter(raw, source);
  assertKeys(fields, ["name", "description", "argument-hint"], source);
  const metadata: CommandMetadata = baseMetadata(fields, source, expectedName);
  if (fields["argument-hint"] !== undefined)
    metadata["argument-hint"] = stringField(fields, "argument-hint", source);
  return { metadata, body };
}

export function parseAgentDocument(
  raw: string,
  source: string,
  expectedName?: string,
): { metadata: AgentMetadata; body: string } {
  const { fields, body } = parseFrontmatter(raw, source);
  assertKeys(
    fields,
    [
      "name",
      "description",
      "tools",
      "model",
      "permissionMode",
      "maxTurns",
      "skills",
      "mcpServers",
    ],
    source,
  );
  const metadata: AgentMetadata = baseMetadata(fields, source, expectedName);
  for (const key of ["tools", "model"] as const) {
    if (fields[key] !== undefined)
      metadata[key] = stringField(fields, key, source);
  }
  if (fields.permissionMode !== undefined) {
    if (
      fields.permissionMode !== "default" &&
      fields.permissionMode !== "acceptEdits"
    )
      throw new Error(`${source}: invalid permissionMode`);
    metadata.permissionMode = fields.permissionMode;
  }
  if (fields.maxTurns !== undefined) {
    if (
      typeof fields.maxTurns !== "number" ||
      !Number.isInteger(fields.maxTurns) ||
      fields.maxTurns < 1
    )
      throw new Error(`${source}: maxTurns must be a positive integer`);
    metadata.maxTurns = fields.maxTurns;
  }
  for (const key of ["skills", "mcpServers"] as const) {
    const value = fields[key];
    if (value === undefined) continue;
    if (
      !Array.isArray(value) ||
      !value.length ||
      !value.every(
        (item: unknown) => typeof item === "string" && item.trim().length > 0,
      ) ||
      new Set(value).size !== value.length
    ) {
      throw new Error(
        `${source}: ${key} must be a nonempty, unique string array`,
      );
    }
    metadata[key] = value;
  }
  return { metadata, body };
}
