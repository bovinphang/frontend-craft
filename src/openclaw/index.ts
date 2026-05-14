import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { Type } from "@sinclair/typebox";
import { extractShellCommand, getDangerousExecBlockReason } from "./security.js";
import { pathFromWriteLikeParams, tryPrettierWrite } from "./format-file.js";
import { buildFrameworkHint } from "./framework-hint.js";
import { notifyTaskComplete } from "./notify-complete.js";
import { initFrontendCraftWorkspace } from "./init-workspace.js";

type PluginConfig = {
  notifyOnAgentEnd: boolean;
  formatAfterWrite: boolean;
};

function resolveConfig(pluginConfig: Record<string, unknown> | undefined): PluginConfig {
  const c = pluginConfig ?? {};
  return {
    notifyOnAgentEnd: c.notifyOnAgentEnd !== false,
    formatAfterWrite: c.formatAfterWrite !== false,
  };
}

export default definePluginEntry({
  id: "frontend-craft",
  name: "Frontend Craft",
  description:
    "Frontend skills, OpenClaw workspace templates, optional init tool, exec safety hooks, and post-write formatting.",
  register(api) {
    const config = resolveConfig(api.pluginConfig as Record<string, unknown> | undefined);
    const pluginRoot = api.rootDir ?? "";

    api.on("before_tool_call", async (event) => {
      const toolName = String(event.toolName ?? "");
      const params = event.params as Record<string, unknown> | undefined;
      const command = extractShellCommand(toolName, params);
      if (!command) return {};
      const reason = getDangerousExecBlockReason(command);
      if (reason) return { block: true as const, blockReason: reason };
      return {};
    });

    if (config.formatAfterWrite) {
      api.on("after_tool_call", async (event) => {
        const toolName = String(event.toolName ?? "")
          .trim()
          .toLowerCase();
        if (toolName !== "write" && toolName !== "edit") return;
        const params = event.params as Record<string, unknown> | undefined;
        const filePath = pathFromWriteLikeParams(toolName, params);
        if (filePath) await tryPrettierWrite(filePath);
      });
    }

    const frameworkHintSessions = new Set<string>();
    const maxTrackedSessions = 500;
    api.on("before_prompt_build", async (_event, ctx) => {
      const key = String((ctx as { sessionKey?: string }).sessionKey ?? "");
      if (!key || frameworkHintSessions.has(key)) return {};
      const workspaceDir = (ctx as { workspaceDir?: string }).workspaceDir;
      if (!workspaceDir) return {};
      const hint = buildFrameworkHint(workspaceDir);
      if (!hint) return {};
      frameworkHintSessions.add(key);
      if (frameworkHintSessions.size > maxTrackedSessions) {
        frameworkHintSessions.clear();
      }
      return { prependContext: hint };
    });

    if (config.notifyOnAgentEnd) {
      api.on("agent_end", async (event) => {
        const e = event as { success?: boolean };
        if (!e.success) return;
        notifyTaskComplete("OpenClaw", "任务完成");
      });
    }

    api.registerTool(
      {
        name: "frontend_craft_init_workspace",
        label: "frontend_craft_init_workspace",
        description:
          "Copy frontend-craft templates: AGENTS.md and rules into an OpenClaw workspace directory.",
        parameters: Type.Object({
          workspaceDir: Type.String({
            description:
              "Absolute path to the agent workspace root (often ~/.openclaw/workspace).",
          }),
          overwriteAgents: Type.Optional(
            Type.Boolean({ description: "When true, replace existing AGENTS.md." }),
          ),
        }),
        async execute(
          _toolCallId: string,
          params: { workspaceDir: string; overwriteAgents?: boolean },
        ) {
          const result = initFrontendCraftWorkspace(pluginRoot, params.workspaceDir, {
            overwriteAgents: params.overwriteAgents === true,
          });
          if (!result.ok) {
            return {
              content: [
                { type: "text" as const, text: `frontend-craft init failed: ${result.error}` },
              ],
              isError: true,
              details: {},
            };
          }
          return {
            content: [
              {
                type: "text" as const,
                text: `frontend-craft: workspace files updated.\n${result.copied.join("\n")}`,
              },
            ],
            details: {},
          };
        },
      },
      { optional: true },
    );
  },
});
