const DANGEROUS = [
  /rm\s+-rf\s+\//i,
  /rm\s+-rf\s+\/\*/i,
  /git\s+push\s+.*--force/i,
  /\bmkfs\b/i,
  /\bdd\s+if=/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
  /curl\s+.*\|\s*sh/i,
  /wget\s+.*\|\s*sh/i,
  /DROP\s+TABLE/i,
  /DROP\s+DATABASE/i,
  /format\s+c:/i,
  />\s*\/dev\/sda/i,
];

export function getDangerousExecBlockReason(command: string): string | undefined {
  const trimmed = command.trim();
  if (!trimmed) return undefined;
  for (const pattern of DANGEROUS) {
    if (pattern.test(trimmed)) {
      return `Blocked potentially dangerous command (frontend-craft): matched pattern ${pattern}`;
    }
  }
  return undefined;
}

export function extractShellCommand(
  toolName: string,
  params: Record<string, unknown> | undefined,
): string {
  if (!params || typeof params !== "object") return "";
  const cmd = params.command;
  if (typeof cmd === "string") return cmd;
  const tn = toolName.trim().toLowerCase();
  if (tn === "exec" || tn === "bash") {
    const alt = params.shell_command ?? params.cmd;
    if (typeof alt === "string") return alt;
  }
  return "";
}
