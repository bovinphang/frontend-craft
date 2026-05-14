# frontend-craft

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vue](https://img.shields.io/badge/-Vue-4FC08D?logo=vue.js&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white)
![Node](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)

---

<div align="center">

**🌐 Language / 语言 / 語言 / 言語 / 언어**

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](README.md) | [日本語](../ja-JP/README.md) | [한국어](../ko-KR/README.md)

</div>

---

**面向 Claude Code、Codex、Cursor、OpenCode、Gemini CLI、Windsurf、Copilot、OpenClaw 等工具的通用前端插件。**

`frontend-craft` 將前端評審 agents、工作流 skills、斜線指令、hooks、MCP 範本和專案規範集中在同一倉庫中維護。推薦透過 CLI 將同一套前端工程規範安裝到 14 種 AI 程式設計 runtime。若你**僅透過 Claude Code Marketplace**（原生插件流程）安裝，請見 [docs/runtimes/claude.md](../runtimes/claude.md)（[簡體中文](../runtimes/claude.zh-CN.md)）。

---

## 社群與治理

- [貢獻指南](../../CONTRIBUTING.md) - 開發環境、PR 檢查清單與多語言同步規則。
- [安全政策](../../SECURITY.md) - 私密漏洞回報方式與支援範圍。
- [行為準則](../../CODE_OF_CONDUCT.md) - 社群參與規範。

---

## 通用安裝（推薦）

需要 **Node.js 22+**。CLI 會依各工具約定把檔案寫入對應目錄（路徑規則見 [`src/install/runtime-homes.mjs`](../../src/install/runtime-homes.mjs)）。

**在終端機內互動安裝（建議）：** 直接執行 `npx frontend-craft@latest` 或 `npx frontend-craft@latest install` 且不要帶 runtime，可依精靈多選 runtime，並選擇全域或目前專案。若已寫 `install <runtime>` 但未帶 `--global` / `--local`，在 **TTY** 下仍會詢問安裝位置。

**指令稿 / CI：** 請務必加上 **`--global` / `-g`** 或 **`--local` / `-l`**。若 stdin 不是 TTY 且兩者皆未指定，CLI 會預設安裝 **`claude`** 到 **全域** 並輸出提示。

```bash
npx frontend-craft@latest list
npx frontend-craft@latest install --local claude
npx frontend-craft@latest install --global codex
npx frontend-craft@latest install cursor --local
npx frontend-craft@latest install --all --dry-run --global
```

支援的 runtime：`claude`、`codex`、`cursor`、`windsurf`、`opencode`、`kilo`、`gemini`、`copilot`、`antigravity`、`augment`、`trae`、`codebuddy`、`cline`、`openclaw`。

各工具說明見 [`docs/runtimes/`](../runtimes/)。

---

## 快速開始

1. 執行 `npx frontend-craft@latest`（精靈）或 `npx frontend-craft@latest install --local <runtime>` / `install --global <runtime>`（指令稿安裝）。
2. 在 [`docs/runtimes/`](../runtimes/) 開啟對應工具的說明（路徑與注意事項）。
3. **僅 Claude Code Marketplace：** 市場安裝、`/fec-init`、更新等完整步驟見 [docs/runtimes/claude.md](../runtimes/claude.md) · [簡體中文](../runtimes/claude.zh-CN.md)。

---

## 🌐 跨平台支援

本插件完整支援 **Windows、macOS 與 Linux**。所有鉤子與腳本均以 Node.js 實作，確保跨平台相容。

---

## 多代理技能安裝（Skills CLI）

若團隊同時使用 **Claude Code**、**OpenAI Codex**、**Cursor**、**OpenCode**、**Gemini CLI**、**OpenClaw**、**Continue**、**CodeBuddy**、**Trae**、**Kimi Code CLI** 等多種 AI 程式設計代理，可透過 [Skills CLI](https://skills.sh/docs/cli)（`npx skills`）將本倉庫中的**工作流技能**安裝到各工具約定的技能目錄。CLI 支援數十種代理；完整清單以互動提示或上游文件為準。

### Skills CLI 與 frontend-craft CLI 的差異

- **Skills CLI** — 將 [`skills/`](../../skills/) 下的技能封裝安裝到您選擇的代理目錄，便於在多種工具間統一審查與前端規範。
- **`npx frontend-craft`** — 安裝本倉庫支援的 skills、runtime 專用 agents、commands、hooks、rules 和範本。請依上文 **通用安裝** 使用互動精靈；非 TTY 時請為 `install` 加上 `--local` 或 `--global`。

### 環境需求

`frontend-craft` 需要 Node.js 22+；使用 `npx skills` 時以 Skills CLI 自身要求為準。

### 安裝技能

```bash
npx skills add bovinphang/frontend-craft
```

依提示選擇專案層級或全域安裝（`-g`）、符號連結或複製（`--copy`），以及要啟用的代理。若只想檢視倉庫內技能清單而不安裝，可執行 `npx skills add bovinphang/frontend-craft -l`。若需指定技能名稱或代理，可使用 `--skill` / `--agent`（詳見 `npx skills --help`）。

### 更新技能

在已安裝技能的專案目錄下執行（若為全域安裝，請使用對應範圍）：

```bash
npx skills update
```

此指令會將已安裝的技能更新至最新版本。亦可先執行 `npx skills check` 查看可用更新。

**遙測：** CLI 預設可能蒐集匿名遙測。若需關閉，請設定環境變數 `DISABLE_TELEMETRY=1`。說明見 [skills.sh CLI 文件](https://skills.sh/docs/cli)。

---

## 📦 內容說明

本倉庫為 **通用前端插件**，包含多個 AI 程式設計工具的原生布局；Claude Code 插件元資料位於 `.claude-plugin/`。

```text
frontend-craft/
|-- .claude-plugin/   # Claude Code 插件與市場清單
|   |-- plugin.json         # 插件元資料
|   |-- marketplace.json    # Marketplace 目錄元資料
|
|-- agents/           # 委派用的專業子代理
|   |-- frontend-architect.md    # 頁面拆分、元件架構、狀態流設計
|   |-- frontend-code-reviewer.md # 專注前端的程式碼審查（品質、安全、無障礙）
|   |-- frontend-security-reviewer.md # 前端攻擊面：XSS、金鑰、CSP、依賴
|   |-- frontend-e2e-runner.md     # E2E 撰寫執行、flaky、產物與 CI
|   |-- typescript-reviewer.md    # TS/JS 型別、非同步、安全，僅輸出報告
|   |-- performance-optimizer.md # 效能瓶頸分析與優化方案
|   |-- ui-checker.md            # UI 視覺問題、設計還原度評估
|   |-- figma-implementer.md     # 依設計稿精確實作 UI
|   |-- design-token-mapper.md   # 設計變數對應至 Design Token
|
|-- skills/           # 工作流程定義與領域知識
|   |-- frontend-code-review/    # 架構、型別、渲染、樣式、無障礙審查
|   |-- security-review/         # XSS、CSRF、敏感資料、輸入驗證
|   |-- accessibility-check/     # WCAG 2.1 AA 無障礙檢查
|   |-- react-project-standard/ # React + TypeScript 專案規範
|   |-- vue3-project-standard/  # Vue 3 + TypeScript 專案規範
|   |-- implement-from-design/   # 依設計稿實作 UI
|   |-- test-and-fix/           # lint、type-check、test、build 並修復
|   |-- legacy-web-standard/    # JS + jQuery + HTML 傳統專案規範
|   |-- legacy-to-modern-migration/  # jQuery/MPA 遷移至 React/Vue 策略與流程
|   |-- e2e-testing/                # Playwright/Cypress E2E 測試規範
|   |-- nextjs-project-standard/    # Next.js 14+ App Router、SSR/SSG 規範
|   |-- nuxt-project-standard/      # Nuxt 3 SSR/SSG、組合式 API 規範
|   |-- monorepo-project-standard/  # pnpm workspace、Turborepo、Nx 規範
|
|-- commands/         # 斜線指令
|   |-- fec-init.md     # /fec-init - 初始化專案範本
|   |-- fec-review.md   # /fec-review - 程式碼規範化審查
|   |-- fec-scaffold.md # /fec-scaffold - 建立 page/feature/component
|
|-- hooks/            # 事件驅動自動化
|   |-- hooks.json     # PreToolUse、PostToolUse、Stop、Notification 等
|
|-- scripts/          # 跨平台 Node.js 腳本
|   |-- security-check.mjs      # 攔截危險指令
|   |-- format-changed-file.mjs # 自動 Prettier 格式化
|   |-- run-tests.mjs           # 會話結束時執行校驗
|   |-- session-start.mjs       # 會話開始時偵測框架
|   |-- notify.mjs              # 跨平台桌面通知
|
|-- templates/        # 各 runtime 的專案設定範本
|   |-- claude/        # CLAUDE.md 與 settings.json
|   |-- codex/         # AGENTS.md 與 config.toml
|   |-- openclaw/      # AGENTS.md 與 OPENCLAW-CONFIG.md
|   |-- shared/rules/  # vue、react、design-system、testing 等
|
|-- .mcp.json         # MCP 伺服器設定（Figma、Sketch、MasterGo、Pixso、墨刀）
└-- README.md
```

---

## 📋 功能概覽

下表中的**斜線指令**以 Claude Code 為例便於對照；其他 runtime 會以各自安裝的 commands 與範本提供同等能力（見 [`docs/runtimes/`](../runtimes/)）。

### Commands（斜線指令）

| 指令                       | 用途                                                             | 輸出報告           |
| -------------------------- | ---------------------------------------------------------------- | ------------------ |
| `/fec-init`     | 將專案範本初始化至 `.claude/` 目錄                               | —                  |
| `/fec-review`   | 對指定或最近變更的檔案執行程式碼規範化審查，輸出分級報告         | `code-review-*.md` |
| `/fec-scaffold` | 依專案規範建立 page / feature / component 標準目錄結構與樣板檔案 | —                  |

### Skills（自動啟用）

| Skill                        | 用途                                                               | 輸出報告                    |
| ---------------------------- | ------------------------------------------------------------------ | --------------------------- |
| `fec-frontend-code-review`       | 從架構、型別、渲染、樣式、無障礙等維度審查程式碼                   | `code-review-*.md`          |
| `fec-security-review`            | XSS、CSRF、敏感資料外洩、輸入驗證等安全審查                        | `security-review-*.md`      |
| `fec-accessibility-check`        | WCAG 2.1 AA 無障礙檢查                                             | `accessibility-review-*.md` |
| `fec-react-project-standard`     | React + TypeScript 專案工程規範（結構、元件、路由、狀態、API 層）  | —                           |
| `fec-vue3-project-standard`      | Vue 3 + TypeScript 專案工程規範（結構、元件、路由、Pinia、API 層） | —                           |
| `fec-implement-from-design`      | 基於 Figma/Sketch/MasterGo/Pixso/墨刀/摹客設計稿實作 UI            | `design-plan-*.md`          |
| `fec-test-and-fix`               | 執行 lint、type-check、test、build 並修復失敗                      | `test-fix-*.md`             |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 傳統專案的開發與維護規範                        | —                           |
| `fec-legacy-to-modern-migration` | jQuery/MPA 遷移至 React/Vue 3 + TS 的策略、概念對應與分階段流程    | `migration-plan-*.md`       |
| `fec-e2e-testing`                | Playwright/Cypress E2E 測試規範：目錄結構、Page Object、CI 整合    | —                           |
| `fec-nextjs-project-standard`    | Next.js 14+ App Router、SSR/SSG、流式渲染、元資料規範              | —                           |
| `fec-nuxt-project-standard`      | Nuxt 3 SSR/SSG、組合式 API、資料獲取、路由、中介軟體規範           | —                           |
| `fec-monorepo-project-standard`  | pnpm workspace、Turborepo、Nx：目錄結構、依賴管理、任務編排        | —                           |

### Agents（子代理）

| Agent                        | 用途                                                                           | 輸出報告                     |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| `frontend-architect`         | 頁面拆分、元件架構、狀態流設計、目錄規劃、大型重構                             | `architecture-proposal-*.md` |
| `frontend-code-reviewer`     | 前端程式碼審查：React/Vue/Next/Nuxt、TS、樣式、用戶端安全                      | `code-review-*.md`           |
| `frontend-security-reviewer` | 前端安全：XSS、用戶端金鑰、危險 DOM/API、CSP、依賴稽核                         | `security-review-*.md`       |
| `frontend-e2e-runner`        | E2E 撰寫與執行（Playwright/Cypress）、flaky 隔離、Trace/截圖、CI；可選摘要報告 | `e2e-summary-*.md`（可選）   |
| `typescript-reviewer`        | TS/JS 審查：typecheck/eslint、PR 合併就緒、型別與非同步與安全；不直接改程式    | `typescript-review-*.md`     |
| `performance-optimizer`      | 分析效能瓶頸（打包體積、渲染效能、網路請求），輸出量化優化方案                 | `performance-review-*.md`    |
| `ui-checker`                 | UI 視覺問題排查、設計還原度評估                                                | `ui-fidelity-review-*.md`    |
| `figma-implementer`          | 依 Figma/Sketch/MasterGo/Pixso/墨刀/摹客設計稿精確實作 UI                      | `design-implementation-*.md` |
| `design-token-mapper`        | 將設計變數對應至專案 Design Token                                              | `token-mapping-*.md`         |

### Hooks（自動執行）

| 事件                      | 行為                                         |
| ------------------------- | -------------------------------------------- |
| `SessionStart`            | 自動偵測專案框架與套件管理工具               |
| `PreToolUse(Bash)`        | 攔截危險指令（rm -rf、force push 等）        |
| `PostToolUse(Write/Edit)` | 對修改的檔案自動執行 Prettier                |
| `Stop`                    | 會話結束時執行 lint、type-check、test、build |
| `Notification`            | 跨平台桌面通知（macOS / Linux / Windows）    |

### MCP 整合

| 服務          | 用途                                                   |
| ------------- | ------------------------------------------------------ |
| Figma         | 讀取設計上下文、變數定義                               |
| Figma Desktop | Figma 桌面端整合                                       |
| Sketch        | 讀取設計選區截圖                                       |
| MasterGo      | 讀取 DSL 結構資料、元件層級與樣式                      |
| Pixso         | 本地 MCP 取得幀資料、程式碼片段與圖片資源              |
| 墨刀          | 取得原型資料、產生設計描述、匯入 HTML                  |
| 摹客          | 無 MCP 整合，透過使用者提供的截圖／標註／匯出 CSS 支援 |

### 專案範本（透過 `/fec-init` 初始化）

| 檔案                          | 用途                                                              |
| ----------------------------- | ----------------------------------------------------------------- |
| `CLAUDE.md`                   | 專案說明、常用指令、工作原則、安全要求                            |
| `settings.json`               | 權限白名單／黑名單、環境變數                                      |
| `rules/vue.md`                | Vue 3 元件規範與反模式                                            |
| `rules/react.md`              | React 元件規範與反模式                                            |
| `rules/design-system.md`      | 設計系統、Token、無障礙規則                                       |
| `rules/testing.md`            | 測試與校驗規則                                                    |
| `rules/git-conventions.md`    | Conventional Commits 提交規範                                     |
| `rules/i18n.md`               | 國際化文案規範                                                    |
| `rules/performance.md`        | 前端效能優化規則                                                  |
| `rules/api-layer.md`          | API 層型別化、錯誤處理規範                                        |
| `rules/state-management.md`   | 狀態分類、管理策略、反模式                                        |
| `rules/error-handling.md`     | 錯誤分層、Error Boundary、降級 UI、上報規範                       |
| `rules/naming-conventions.md` | 檔案、元件、變數、路由、API、CSS 統一命名規範                     |
| `rules/ci-cd.md`              | CI/CD 流水線階段、GitHub Actions / GitLab CI 範例、金鑰管理       |
| `rules/refactoring.md`        | 重構約束：圖片、樣式、禁止內聯 SVG/樣式、優先 flex 佈局、功能等價 |

---

## ⚙️ 設定

### 前置依賴

- Node.js 22+
- npm、pnpm 或 yarn
- Git Bash（Windows 使用者需要，用於執行 hook 腳本）

### MCP 伺服器

使用設計稿相關功能前，請依團隊使用的設計工具設定對應環境變數：

| 環境變數         | 對應工具              | 取得方式                                  |
| ---------------- | --------------------- | ----------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma 帳戶設定 > Personal Access Tokens   |
| `SKETCH_API_KEY` | Sketch                | Sketch 開發者設定                         |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo 帳戶設定 > 安全設定 > 產生 Token |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 功能頁面取得存取權杖              |

> Pixso 使用本地 MCP 服務，需在 Pixso 用戶端中啟用 MCP 功能，無需額外環境變數。
> 摹客暫無 MCP 整合，透過使用者提供截圖／標註方式工作。

**macOS / Linux：**

```bash
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

**Windows (PowerShell)：**

```powershell
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

建議將環境變數加入 shell 設定檔（`~/.bashrc`、`~/.zshrc`）或 Windows 系統環境變數中。

---

## 📄 報告輸出

所有審查、分析與評估功能均自動將報告儲存為 Markdown 檔案至專案根目錄下的 `reports/` 目錄。

| 報告類型     | 檔名模式                                     | 來源                                                                         |
| ------------ | -------------------------------------------- | ---------------------------------------------------------------------------- |
| 程式碼審查   | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review` 指令、`fec-frontend-code-review` skill、`frontend-code-reviewer` agent |
| TS/JS 審查   | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `typescript-reviewer` agent                                                  |
| 安全審查     | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review` skill、`frontend-security-reviewer` agent                  |
| 無障礙檢查   | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check` skill                                                  |
| 效能分析     | `performance-review-YYYY-MM-DD-HHmmss.md`    | `performance-optimizer` agent                                                |
| 架構方案     | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent                                                   |
| 設計還原度   | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `ui-checker` agent                                                           |
| 設計實作     | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent                                                    |
| Token 對應   | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `design-token-mapper` agent                                                  |
| 設計計畫     | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design` skill                                                |
| 測試修復     | `test-fix-YYYY-MM-DD-HHmmss.md`              | `fec-test-and-fix` skill                                                         |
| E2E 執行摘要 | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `frontend-e2e-runner` agent（可選）                                          |
| 遷移計畫     | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration` skill                                           |

> **建議：** 於 `.gitignore` 中加入 `reports/` 以避免將自動產生的報告提交至程式碼倉庫，或保留提交以便團隊成員檢視歷史審查記錄。

---

## 保持更新

- **CLI 安裝：** 使用相同的 `--local` / `--global` 與 runtime，重新執行 `npx frontend-craft@latest install`，版本說明見 [CHANGELOG.md](../../CHANGELOG.md)。
- **Claude Code Marketplace 或 submodule：** 見 [docs/runtimes/claude.md](../runtimes/claude.md) 的 **Updating** · [簡體中文](../runtimes/claude.zh-CN.md)。

---

## 🎯 關鍵概念

### 代理

子代理以有限範圍處理委派的任務。範例：

```markdown
---
name: performance-optimizer
description: 分析前端效能瓶頸並給出優化方案
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
---

你是一名專注於前端效能分析與優化的高級工程師...
```

### 技能

技能是由指令或代理呼叫的工作流程定義，包含審查維度、輸出格式與報告檔案約定：

```markdown
# 前端程式碼審查

## 審查維度

1. 架構 - 元件邊界、職責分離
2. 型別安全 - any 使用、props 型別
   ...

## 報告檔案輸出

- 目錄：reports/
- 檔名：code-review-YYYY-MM-DD-HHmmss.md
```

### 鉤子

鉤子在工具事件時觸發。範例 — 攔截危險指令：

```json
{
  "event": "PreToolUse",
  "matcher": "tool == \"Bash\"",
  "command": "node \"${FRONTEND_CRAFT_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 授權條款

MIT - 自由使用、依需求修改，歡迎回饋。

---

**若本倉庫對您有幫助，請給予 Star。打造出色的前端。**
