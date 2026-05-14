# frontend-craft: Claude (Claude Code)

Recommended path for most users: install via the repository root README **Universal Install**:

```bash
npx frontend-craft@latest install --local claude
# or
npx frontend-craft@latest install --global claude
```

> **Non-interactive:** append `--local` or `--global` to skip install-location prompts. See the repository README **Universal Install** for interactive vs. scripted behavior.

The sections below are **optional** paths that only apply when you use **Claude Code’s native plugin / Marketplace** flow instead of (or in addition to) the CLI.

---

## Claude Code Marketplace

You can install `frontend-craft` as a Claude Code marketplace plugin. This loads the plugin natively inside Claude Code.

---

## Quick start after Marketplace install

Get started in a few minutes:

### Step 1: Install the plugin

```bash
# Add marketplace
/plugin marketplace add bovinphang/frontend-craft

# Install plugin
/plugin install frontend-craft@bovinphang-frontend-craft

# Activate
/reload-plugins
```

### Step 2: Initialize project config (recommended)

```bash
# Copy project templates to .claude/ directory
/fec-init
```

After initialization, customize for your project:

1. `.claude/CLAUDE.md` — Update project info, package manager, common commands (source templates: `templates/claude/`; `/fec-init` copies into `.claude/`)
2. `.claude/rules/` — Remove inapplicable rules (e.g. delete `vue.md` for React-only projects, delete `i18n.md` if i18n is not needed)
3. `.claude/settings.json` — Adjust permission whitelist

> **Why this step?** The plugin provides reusable Skills, Agents, and Hooks. CLAUDE.md and rules are project-level config and must live under the project root `.claude/` for Claude Code to recognize them. The `/fec-init` command helps you set this up quickly.

### Step 3: Start using

```bash
# Code review (outputs to reports/code-review-*.md)
/fec-review

# Create page/feature/component by convention
/fec-scaffold page UserDetail
/fec-scaffold component DataTable

# List available commands
/plugin list frontend-craft@bovinphang-frontend-craft
```

You now have access to the bundled agents, skills, and commands (see the root README **Feature overview** for the current list).

---

## Alternate install paths (Claude Code only)

> **Requirements:** Claude Code v1.0.33+, Node.js 22+, npm/pnpm/yarn.

### Option 1: Install as plugin (recommended)

Same as **Step 1: Install the plugin** under **Quick start after Marketplace install** above (add marketplace, install plugin, `/reload-plugins`). You can also skip typing those commands in chat and add the marketplace via `~/.claude/settings.json` or project `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "frontend-craft": {
      "source": {
        "source": "github",
        "repo": "bovinphang/frontend-craft"
      }
    }
  }
}
```

### Option 2: Team project-level auto-install

Add the `extraKnownMarketplaces` config above to `.claude/settings.json` in the project root. Team members will be prompted to install when they trust the project directory.

### Option 3: Local development / testing

Clone the repo and load via `--plugin-dir` (no install, suitable for development and debugging):

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### Option 4: Git Submodule (project-level sharing)

```bash
# Add as submodule in project root
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft

git add .gitmodules .claude/plugins/frontend-craft
git commit -m "feat: add frontend-craft as shared Claude Code plugin"
```

After cloning, team members run:

```bash
git submodule update --init --recursive
```

Then load with `--plugin-dir`:

```bash
claude --plugin-dir .claude/plugins/frontend-craft
```

---

## Updating (Marketplace and submodule)

For Marketplace installs, run in Claude Code:

```text
/plugin marketplace update bovinphang-frontend-craft
```

Or enable auto-update so Claude Code pulls the latest on each start:

1. Run `/plugin` in Claude Code to open the plugin manager
2. Switch to the **Marketplaces** tab
3. Select `bovinphang-frontend-craft`
4. Choose **Enable auto-update**

> Third-party Marketplaces do not enable auto-update by default. After enabling, Claude Code will refresh Marketplace data and update installed plugins on each start.

For Git submodule installs:

```bash
git submodule update --remote .claude/plugins/frontend-craft
```

**CLI installs:** re-run `npx frontend-craft@latest install --local claude` or `... --global claude` for the same scope, and read [CHANGELOG.md](../../CHANGELOG.md) for release notes.

---

**Other languages:** [简体中文](claude.zh-CN.md)
