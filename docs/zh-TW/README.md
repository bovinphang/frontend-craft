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

**面向 Claude Code、Codex、Cursor、OpenCode、Gemini CLI、Qoder、Kilo、Windsurf、Copilot、Antigravity、Augment、Trae、CodeBuddy、Cline、OpenClaw 等工具的通用前端插件。**

`frontend-craft` 將前端評審 agents、工作流 skills、斜線指令、hooks、MCP 範本和專案規範集中在同一倉庫中維護。推薦透過 CLI 將同一套前端工程規範安裝到 15 種 AI 程式設計 runtime。若你**僅透過 Claude Code Marketplace**（原生插件流程）安裝，請見 [docs/runtimes/claude.md](../runtimes/claude.md)（[簡體中文](../runtimes/claude.zh-CN.md)）。

---

## 社群與治理

- [貢獻指南](../../CONTRIBUTING.md) - 開發環境、PR 檢查清單與多語言同步規則。
- [安全政策](../../SECURITY.md) - 私密漏洞回報方式與支援範圍。
- [行為準則](../../CODE_OF_CONDUCT.md) - 社群參與規範。

---

## 通用安裝（推薦）

需要 **Node.js 22+**。CLI 會依各工具約定把檔案寫入對應目錄（路徑規則見 [`src/install/runtime-homes.ts`](../../src/install/runtime-homes.ts)）。

**在終端機內互動安裝（建議）：** 直接執行 `npx frontend-craft@latest` 或 `npx frontend-craft@latest install` 且不要帶 runtime，可依精靈多選 runtime，並選擇全域或目前專案。若已寫 `install <runtime>` 但未帶 `--global` / `--local`，在 **TTY** 下仍會詢問安裝位置。

**指令稿 / CI：** 請務必加上 **`--global` / `-g`** 或 **`--local` / `-l`**。若 stdin 不是 TTY 且兩者皆未指定，CLI 會預設安裝 **`claude`** 到 **全域** 並輸出提示。

```bash
npx frontend-craft@latest list
npx frontend-craft@latest install --local claude
npx frontend-craft@latest install --global codex
npx frontend-craft@latest install cursor --local
npx frontend-craft@latest install --all --dry-run --global
```

支援的 runtime：`claude`、`codex`、`cursor`、`windsurf`、`opencode`、`kilo`、`gemini`、`copilot`、`antigravity`、`augment`、`trae`、`codebuddy`、`cline`、`openclaw`、`qoder`。

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

本倉庫將 **agents**、**skills**、**commands**、**hooks**、**scripts** 和 **templates** 打包為一個可安裝單元。完整目錄結構及檔案職責見 [詳細專案結構](../project-structure.md)。

**核心內容：**

- **13 個專業 agent** — 程式碼審查、安全、測試、效能、架構、UI 還原度、設計實現
- **31 個自動激活 skill** — React/Vue/Next/Nuxt 規範、無障礙、安全、表單、資料獲取、PWA、E2E 等
- **9 個斜線指令** — `/fec-init`、`/fec-review`、`/fec-test-plan`、`/fec-scaffold`、`/fec-plan`、`/fec-tdd`、`/fec-build-fix`、`/fec-refactor-clean`、`/fec-doc-sync`
- **5 個事件驅動 hook** — 會話檢測、安全檢查、自動格式化、校驗、通知
- **MCP 整合** — Figma、Sketch、MasterGo、Pixso、墨刀、摹客
- **專案範本** — CLAUDE.md、規則（Vue/React/設計系統/測試等）、settings.json

---

## 📋 功能概覽

下表中的**斜線指令**以 Claude Code 為例便於對照；其他 runtime 會以各自安裝的 commands 與範本提供同等能力（見 [`docs/runtimes/`](../runtimes/)）。

### Commands（斜線指令）

| 指令             | 用途                                                             | 輸出報告           |
| ---------------- | ---------------------------------------------------------------- | ------------------ |
| `/fec-init`      | 將專案範本初始化至 `.claude/` 目錄                               | —                  |
| `/fec-review`    | 對指定或最近變更的檔案執行程式碼規範化審查，輸出分級報告         | `code-review-*.md` |
| `/fec-test-plan` | 規劃前端測試分層、風險覆蓋與執行順序                             | `test-plan-*.md`   |
| `/fec-scaffold`  | 依專案規範建立 page / feature / component 標準目錄結構與樣板檔案 | —                  |

### Skills（自動啟用）

| Skill                            | 用途                                                               | 輸出報告                    |
| -------------------------------- | ------------------------------------------------------------------ | --------------------------- |
| `fec-frontend-code-review`       | 從架構、型別、渲染、樣式、無障礙等維度審查程式碼                   | `code-review-*.md`          |
| `fec-security-review`            | XSS、CSRF、敏感資料外洩、輸入驗證等安全審查                        | `security-review-*.md`      |
| `fec-accessibility-check`        | WCAG 2.1 AA 無障礙檢查                                             | `accessibility-review-*.md` |
| `fec-react-project-standard`     | React + TypeScript 專案工程規範（結構、元件、路由、狀態、API 層）  | —                           |
| `fec-vue3-project-standard`      | Vue 3 + TypeScript 專案工程規範（結構、元件、路由、Pinia、API 層） | —                           |
| `fec-implement-from-design`      | 基於 Figma/Sketch/MasterGo/Pixso/墨刀/摹客設計稿實作 UI            | `design-plan-*.md`          |
| `fec-validation-fix`             | 執行 lint、type-check、test、build 並修復失敗                      | `validation-fix-*.md`       |
| `fec-tdd-workflow`               | 測試先行的前端實作、Bug 修復與紅綠重構流程                         | —                           |
| `fec-refactor-clean`             | 安全清理死程式碼、未使用匯出、樣式、路由和依賴                      | `refactor-clean-*.md`       |
| `fec-doc-sync`                   | 將公開文件與 scripts、skills、agents、commands 和 templates 同步   | —                           |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 傳統專案的開發與維護規範                        | —                           |
| `fec-legacy-to-modern-migration` | jQuery/MPA 遷移至 React/Vue 3 + TS 的策略、概念對應與分階段流程    | `migration-plan-*.md`       |
| `fec-testing-strategy`           | 測試分層選擇、風險矩陣與覆蓋規劃                                   | `test-plan-*.md`            |
| `fec-e2e-testing`                | Playwright/Cypress E2E 測試規範：目錄結構、Page Object、CI 整合    | —                           |
| `fec-nextjs-project-standard`    | Next.js 14+ App Router、SSR/SSG、流式渲染、元資料規範              | —                           |
| `fec-nuxt-project-standard`      | Nuxt 3 SSR/SSG、組合式 API、資料獲取、路由、中介軟體規範           | —                           |
| `fec-monorepo-project-standard`  | pnpm workspace、Turborepo、Nx：目錄結構、依賴管理、任務編排        | —                           |
| `fec-data-fetching`              | TanStack Query / 服務端狀態獲取、緩存、失效、樂觀更新              | —                           |
| `fec-form-handling`              | React Hook Form + Zod 表單、動態欄位、上傳、多步流程               | —                           |
| `fec-browser-storage`            | localStorage/sessionStorage/IndexedDB/Cookies 選型與安全持久化     | —                           |
| `fec-route-protection`           | React Router、Next.js、Vue Router、Nuxt 的登入態與權限路由保護     | —                           |
| `fec-component-testing`          | React Testing Library / Vue Test Utils 元件測試與回歸用例          | —                           |
| `fec-storybook-component-doc`    | Storybook 元件文件、Addon、MDX、互動測試與視覺測試整合             | —                           |
| `fec-list-virtualization`        | react-window / TanStack Virtual 大數據列表虛擬滾動與測量策略       | —                           |
| `fec-ui-design-direction`        | 產品化 UI 方向、首屏層級、業務語氣與視覺策略                       | —                           |
| `fec-interface-polish`           | 間距、排版、圓角、陰影、命中區域、狀態與動效細節打磨               | —                           |
| `fec-vite-project-standard`      | Vite 設定、環境變數安全、HMR、開發代理、建置最佳化與函式庫模式     | —                           |
| `fec-pwa-implementation`         | Manifest、Service Worker、離線緩存、安裝提示與更新管理             | —                           |
| `fec-web-workers`                | Web Worker、Transferable、Comlink、Worker 池                       | —                           |
| `fec-canvas-threejs`             | Canvas 2D、Three.js、React Three Fiber、WebGL 效能與無障礙         | —                           |
| `fec-svg-animation`              | CSS、Framer Motion、GSAP SVG 動畫與 reduced-motion 降級            | —                           |

### Agents（子代理）

| Agent                        | 用途                                                                           | 輸出報告                     |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| `frontend-architect`         | 頁面拆分、元件架構、狀態流設計、目錄規劃、大型重構                             | `architecture-proposal-*.md` |
| `frontend-code-reviewer`     | 前端程式碼審查：React/Vue/Next/Nuxt、TS、樣式、用戶端安全                      | `code-review-*.md`           |
| `frontend-security-reviewer` | 前端安全：XSS、用戶端金鑰、危險 DOM/API、CSP、依賴稽核                         | `security-review-*.md`       |
| `frontend-test-planner`      | 前端測試策略：按風險映射靜態、單元、元件、E2E、視覺、無障礙、安全與效能覆蓋    | `test-plan-*.md`             |
| `frontend-build-fixer`       | 增量修復 lint、type-check、test、build 與 CI 失敗                         | `validation-fix-*.md`        |
| `frontend-refactor-cleaner`  | 分類並安全清理未使用前端程式碼、匯出、樣式、路由和依賴                 | `refactor-clean-*.md`        |
| `frontend-doc-updater`       | 同步 README、runtime 文件、專案結構、能力表和公開 metadata             | —                            |
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
| `rules/agent-workflow.md`     | 子代理協作邊界與委託規則                                      |
| `rules/working-modes.md`      | 調研、計畫、開發、評審、收尾模式指引                          |

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

| 報告類型         | 檔名模式                                     | 來源                                                                                 |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| 程式碼審查       | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review` 指令、`fec-frontend-code-review` skill、`frontend-code-reviewer` agent |
| `/fec-test-plan` | 規劃前端測試分層、風險覆蓋與執行順序         | `test-plan-*.md`                                                                     |
| TS/JS 審查       | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `typescript-reviewer` agent                                                          |
| 安全審查         | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review` skill、`frontend-security-reviewer` agent                      |
| 無障礙檢查       | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check` skill                                                      |
| 效能分析         | `performance-review-YYYY-MM-DD-HHmmss.md`    | `performance-optimizer` agent                                                        |
| 架構方案         | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent                                                           |
| 設計還原度       | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `ui-checker` agent                                                                   |
| 設計實作         | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent                                                            |
| Token 對應       | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `design-token-mapper` agent                                                          |
| 設計計畫         | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design` skill                                                    |
| 測試計畫         | `test-plan-YYYY-MM-DD-HHmmss.md`             | `fec-testing-strategy` skill / `frontend-test-planner` agent                         |
| 驗證修復         | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix` skill                                                           |
| 重構清理         | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`、`fec-refactor-clean` skill、`frontend-refactor-cleaner` agent |
| E2E 執行摘要     | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `frontend-e2e-runner` agent（可選）                                                  |
| 遷移計畫         | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration` skill                                               |

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
  "command": "node \"${FRONTEND_CRAFT_ROOT}/dist/scripts/security-check.js\""
}
```

---

## 📄 授權條款

MIT - 自由使用、依需求修改，歡迎回饋。

---

**若本倉庫對您有幫助，請給予 Star。打造出色的前端。**
