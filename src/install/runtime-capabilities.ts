export type RuntimeTier = "full" | "medium" | "skills-rules-only";

export interface RuntimeCapabilities {
  tier: RuntimeTier;
  skills: boolean;
  agents: boolean;
  commands: boolean;
  hooks: boolean;
  rules: boolean;
  templates: boolean;
  mcp: boolean;
  reports: boolean;
  init: "native" | "rules" | "none";
}

export const RUNTIME_CAPABILITIES: Record<string, RuntimeCapabilities> = {
  claude: {
    tier: "full",
    skills: true,
    agents: true,
    commands: true,
    hooks: true,
    rules: true,
    templates: true,
    mcp: true,
    reports: true,
    init: "native",
  },
  codex: {
    tier: "full",
    skills: true,
    agents: true,
    commands: false,
    hooks: false,
    rules: true,
    templates: true,
    mcp: false,
    reports: true,
    init: "native",
  },
  openclaw: {
    tier: "full",
    skills: true,
    agents: false,
    commands: true,
    hooks: false,
    rules: false,
    templates: true,
    mcp: false,
    reports: true,
    init: "native",
  },
  qoder: {
    tier: "full",
    skills: true,
    agents: true,
    commands: true,
    hooks: true,
    rules: true,
    templates: true,
    mcp: false,
    reports: true,
    init: "native",
  },
  opencode: {
    tier: "medium",
    skills: true,
    agents: false,
    commands: true,
    hooks: false,
    rules: false,
    templates: true,
    mcp: false,
    reports: true,
    init: "rules",
  },
  kilo: {
    tier: "medium",
    skills: true,
    agents: false,
    commands: true,
    hooks: false,
    rules: false,
    templates: false,
    mcp: false,
    reports: true,
    init: "rules",
  },
  cursor: {
    tier: "medium",
    skills: true,
    agents: false,
    commands: false,
    hooks: false,
    rules: true,
    templates: false,
    mcp: false,
    reports: true,
    init: "rules",
  },
  windsurf: {
    tier: "medium",
    skills: true,
    agents: false,
    commands: true,
    hooks: false,
    rules: true,
    templates: false,
    mcp: false,
    reports: true,
    init: "rules",
  },
  gemini: {
    tier: "medium",
    skills: true,
    agents: false,
    commands: false,
    hooks: false,
    rules: false,
    templates: true,
    mcp: false,
    reports: true,
    init: "rules",
  },
  copilot: {
    tier: "medium",
    skills: false,
    agents: false,
    commands: true,
    hooks: false,
    rules: true,
    templates: false,
    mcp: false,
    reports: true,
    init: "rules",
  },
  antigravity: {
    tier: "skills-rules-only",
    skills: true,
    agents: false,
    commands: false,
    hooks: false,
    rules: false,
    templates: false,
    mcp: false,
    reports: true,
    init: "none",
  },
  augment: {
    tier: "skills-rules-only",
    skills: true,
    agents: false,
    commands: false,
    hooks: false,
    rules: false,
    templates: false,
    mcp: false,
    reports: true,
    init: "none",
  },
  trae: {
    tier: "skills-rules-only",
    skills: false,
    agents: false,
    commands: false,
    hooks: false,
    rules: true,
    templates: false,
    mcp: false,
    reports: true,
    init: "none",
  },
  codebuddy: {
    tier: "skills-rules-only",
    skills: true,
    agents: false,
    commands: false,
    hooks: false,
    rules: false,
    templates: false,
    mcp: false,
    reports: true,
    init: "none",
  },
  cline: {
    tier: "skills-rules-only",
    skills: false,
    agents: false,
    commands: false,
    hooks: false,
    rules: true,
    templates: false,
    mcp: false,
    reports: true,
    init: "none",
  },
};

export function renderRuntimeCapabilityMatrix(runtimes: string[]): string {
  const columns = ["Runtime", "Tier", "Skills", "Agents", "Commands", "Hooks", "Rules", "Templates", "MCP", "Reports", "Init"];
  const rows = runtimes.map((runtime) => {
    const cap = RUNTIME_CAPABILITIES[runtime];
    if (!cap) throw new Error(`Missing capability declaration for runtime: ${runtime}`);
    return [
      runtime,
      cap.tier,
      yesNo(cap.skills),
      yesNo(cap.agents),
      yesNo(cap.commands),
      yesNo(cap.hooks),
      yesNo(cap.rules),
      yesNo(cap.templates),
      yesNo(cap.mcp),
      yesNo(cap.reports),
      cap.init,
    ];
  });

  const widths = columns.map((column, index) =>
    Math.max(column.length, ...rows.map((row) => row[index].length)),
  );
  const formatRow = (row: string[]) => row.map((value, index) => value.padEnd(widths[index])).join("  ").trimEnd();
  return [formatRow(columns), ...rows.map(formatRow)].join("\n");
}

function yesNo(value: boolean): string {
  return value ? "yes" : "no";
}
