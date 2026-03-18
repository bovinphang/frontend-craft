# frontend-craft

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
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

**面向企業級前端團隊的 Claude Code 共享插件。**

整合程式碼審查、安全審查、設計稿還原（Figma/Sketch/MasterGo/Pixso/墨刀/摹客）、無障礙檢查、自動化品質保障與專案規範範本。所有審查、分析與評估報告均自動儲存為 Markdown 檔案至專案 `reports/` 目錄，便於歸檔、追溯與團隊共享。

---

## 🚀 快速開始

2 分鐘內上手：

### 第一步：安裝插件

```bash
# 新增市場
/plugin marketplace add bovinphang/frontend-craft

# 安裝插件
/plugin install frontend-craft@bovinphang-frontend-craft

# 啟用
/reload-plugins
```

### 第二步：初始化專案設定（建議）

```bash
# 將專案範本複製到 .claude/ 目錄
/frontend-craft:init
```

初始化後請依專案實際情況修改：

1. `.claude/CLAUDE.md` — 修改專案基礎資訊、套件管理工具、常用指令
2. `.claude/rules/` — 刪除不適用的規則檔案（如純 React 專案刪除 `vue.md`，不需要 i18n 的專案刪除 `i18n.md`）
3. `.claude/settings.json` — 調整權限白名單

> **為什麼需要這一步？** 插件提供的是可複用的 Skills、Agents 和 Hooks，而 CLAUDE.md 和 rules 是專案級設定，必須位於專案根目錄的 `.claude/` 下才能被 Claude Code 識別。`/init` 指令可協助你快速完成此設定。

### 第三步：開始使用

```bash
# 程式碼審查（輸出至 reports/code-review-*.md）
/frontend-craft:review

# 依規範建立頁面/功能/元件
/frontend-craft:scaffold page UserDetail
/frontend-craft:scaffold component DataTable

# 檢視可用指令
/plugin list frontend-craft@bovinphang-frontend-craft
```

✨ **完成！** 您現在可使用 5 個代理、9 個技能與 3 個指令。

---

## 🌐 跨平台支援

本插件完整支援 **Windows、macOS 與 Linux**。所有鉤子與腳本均以 Node.js 實作，確保跨平台相容。

---

## 📦 內容說明

本倉庫為 **Claude Code 插件**，可直接安裝或透過 `--plugin-dir` 本地載入。

```
frontend-craft/
|-- .claude-plugin/   # 插件與市場清單
|   |-- plugin.json         # 插件元資料
|   |-- marketplace.json    # /plugin marketplace add 的市場目錄
|
|-- agents/           # 委派用的專業子代理
|   |-- frontend-architect.md    # 頁面拆分、元件架構、狀態流設計
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
|   └-- legacy-to-modern-migration/  # jQuery/MPA 遷移至 React/Vue 策略與流程
|
|-- commands/         # 斜線指令
|   |-- init.md        # /init - 初始化專案範本
|   |-- review.md      # /review - 程式碼規範化審查
|   |-- scaffold.md   # /scaffold - 建立 page/feature/component
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
|-- templates/        # 專案設定範本（透過 /init 複製）
|   |-- CLAUDE.md
|   |-- settings.json
|   |-- rules/         # vue、react、design-system、testing 等
|
|-- .mcp.json         # MCP 伺服器設定（Figma、Sketch、MasterGo、Pixso、墨刀）
└-- README.md
```

---

## 📥 安裝

> **需求：** Claude Code v1.0.33+、Node.js >= 18、npm/pnpm/yarn。

### 選項 1：作為插件安裝（建議）

```bash
# 新增市場
/plugin marketplace add bovinphang/frontend-craft

# 安裝插件
/plugin install frontend-craft@bovinphang-frontend-craft
```

或加入 `~/.claude/settings.json` 或專案 `.claude/settings.json`：

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

### 選項 2：團隊專案級自動安裝

於專案根目錄 `.claude/settings.json` 加入上述 `extraKnownMarketplaces` 設定，團隊成員 trust 專案目錄後會自動提示安裝。

### 選項 3：本地開發／測試

克隆倉庫後使用 `--plugin-dir` 載入（不需安裝，適合開發除錯）：

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### 選項 4：Git Submodule（專案級共享）

```bash
# 於專案根目錄下新增為 submodule
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft

git add .gitmodules .claude/plugins/frontend-craft
git commit -m "feat: add frontend-craft as shared Claude Code plugin"
```

團隊成員克隆專案後執行：

```bash
git submodule update --init --recursive
```

然後使用 `--plugin-dir` 載入：

```bash
claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 功能概覽

### Commands（斜線指令）

| 指令 | 用途 | 輸出報告 |
|------|------|----------|
| `/frontend-craft:init` | 將專案範本初始化至 `.claude/` 目錄 | — |
| `/frontend-craft:review` | 對指定或最近變更的檔案執行程式碼規範化審查，輸出分級報告 | `code-review-*.md` |
| `/frontend-craft:scaffold` | 依專案規範建立 page / feature / component 標準目錄結構與樣板檔案 | — |

### Skills（自動啟用）

| Skill | 用途 | 輸出報告 |
|-------|------|----------|
| `frontend-code-review` | 從架構、型別、渲染、樣式、無障礙等維度審查程式碼 | `code-review-*.md` |
| `security-review` | XSS、CSRF、敏感資料外洩、輸入驗證等安全審查 | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA 無障礙檢查 | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript 專案工程規範（結構、元件、路由、狀態、API 層） | — |
| `vue3-project-standard` | Vue 3 + TypeScript 專案工程規範（結構、元件、路由、Pinia、API 層） | — |
| `implement-from-design` | 基於 Figma/Sketch/MasterGo/Pixso/墨刀/摹客設計稿實作 UI | `design-plan-*.md` |
| `test-and-fix` | 執行 lint、type-check、test、build 並修復失敗 | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML 傳統專案的開發與維護規範 | — |
| `legacy-to-modern-migration` | jQuery/MPA 遷移至 React/Vue 3 + TS 的策略、概念對應與分階段流程 | `migration-plan-*.md` |

### Agents（子代理）

| Agent | 用途 | 輸出報告 |
|-------|------|----------|
| `frontend-architect` | 頁面拆分、元件架構、狀態流設計、目錄規劃、大型重構 | `architecture-proposal-*.md` |
| `performance-optimizer` | 分析效能瓶頸（打包體積、渲染效能、網路請求），輸出量化優化方案 | `performance-review-*.md` |
| `ui-checker` | UI 視覺問題排查、設計還原度評估 | `ui-fidelity-review-*.md` |
| `figma-implementer` | 依 Figma/Sketch/MasterGo/Pixso/墨刀/摹客設計稿精確實作 UI | `design-implementation-*.md` |
| `design-token-mapper` | 將設計變數對應至專案 Design Token | `token-mapping-*.md` |

### Hooks（自動執行）

| 事件 | 行為 |
|------|------|
| `SessionStart` | 自動偵測專案框架與套件管理工具 |
| `PreToolUse(Bash)` | 攔截危險指令（rm -rf、force push 等） |
| `PostToolUse(Write/Edit)` | 對修改的檔案自動執行 Prettier |
| `Stop` | 會話結束時執行 lint、type-check、test、build |
| `Notification` | 跨平台桌面通知（macOS / Linux / Windows） |

### MCP 整合

| 服務 | 用途 |
|------|------|
| Figma | 讀取設計上下文、變數定義 |
| Figma Desktop | Figma 桌面端整合 |
| Sketch | 讀取設計選區截圖 |
| MasterGo | 讀取 DSL 結構資料、元件層級與樣式 |
| Pixso | 本地 MCP 取得幀資料、程式碼片段與圖片資源 |
| 墨刀 | 取得原型資料、產生設計描述、匯入 HTML |
| 摹客 | 無 MCP 整合，透過使用者提供的截圖／標註／匯出 CSS 支援 |

### 專案範本（透過 `/init` 初始化）

| 檔案 | 用途 |
|------|------|
| `CLAUDE.md` | 專案說明、常用指令、工作原則、安全要求 |
| `settings.json` | 權限白名單／黑名單、環境變數 |
| `rules/vue.md` | Vue 3 元件規範與反模式 |
| `rules/react.md` | React 元件規範與反模式 |
| `rules/design-system.md` | 設計系統、Token、無障礙規則 |
| `rules/testing.md` | 測試與校驗規則 |
| `rules/git-conventions.md` | Conventional Commits 提交規範 |
| `rules/i18n.md` | 國際化文案規範 |
| `rules/performance.md` | 前端效能優化規則 |
| `rules/api-layer.md` | API 層型別化、錯誤處理規範 |
| `rules/state-management.md` | 狀態分類、管理策略、反模式 |
| `rules/error-handling.md` | 錯誤分層、Error Boundary、降級 UI、上報規範 |
| `rules/naming-conventions.md` | 檔案、元件、變數、路由、API、CSS 統一命名規範 |

---

## ⚙️ 設定

### 前置依賴

- Node.js >= 18
- npm、pnpm 或 yarn
- Git Bash（Windows 使用者需要，用於執行 hook 腳本）

### MCP 伺服器

使用設計稿相關功能前，請依團隊使用的設計工具設定對應環境變數：

| 環境變數 | 對應工具 | 取得方式 |
|----------|----------|----------|
| `FIGMA_API_KEY` | Figma / Figma Desktop | Figma 帳戶設定 > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch 開發者設定 |
| `MG_MCP_TOKEN` | MasterGo | MasterGo 帳戶設定 > 安全設定 > 產生 Token |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI 功能頁面取得存取權杖 |

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

| 報告類型 | 檔名模式 | 來源 |
|----------|----------|------|
| 程式碼審查 | `code-review-YYYY-MM-DD-HHmmss.md` | `/review` 指令、`frontend-code-review` skill |
| 安全審查 | `security-review-YYYY-MM-DD-HHmmss.md` | `security-review` skill |
| 無障礙檢查 | `accessibility-review-YYYY-MM-DD-HHmmss.md` | `accessibility-check` skill |
| 效能分析 | `performance-review-YYYY-MM-DD-HHmmss.md` | `performance-optimizer` agent |
| 架構方案 | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent |
| 設計還原度 | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md` | `ui-checker` agent |
| 設計實作 | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent |
| Token 對應 | `token-mapping-YYYY-MM-DD-HHmmss.md` | `design-token-mapper` agent |
| 設計計畫 | `design-plan-YYYY-MM-DD-HHmmss.md` | `implement-from-design` skill |
| 測試修復 | `test-fix-YYYY-MM-DD-HHmmss.md` | `test-and-fix` skill |
| 遷移計畫 | `migration-plan-YYYY-MM-DD-HHmmss.md` | `legacy-to-modern-migration` skill |

> **建議：** 於 `.gitignore` 中加入 `reports/` 以避免將自動產生的報告提交至程式碼倉庫，或保留提交以便團隊成員檢視歷史審查記錄。

---

## 📥 更新

透過 Marketplace 安裝的插件，請在 Claude Code 中執行：

```
/plugin marketplace update bovinphang-frontend-craft
```

或開啟自動更新，每次啟動 Claude Code 時自動拉取最新版本：

1. 在 Claude Code 中執行 `/plugin` 開啟插件管理器
2. 切換至 **Marketplaces** 標籤頁
3. 選取 `bovinphang-frontend-craft`
4. 選擇 **Enable auto-update**

> 第三方 Marketplace 預設不開啟自動更新，需手動啟用。啟用後 Claude Code 每次啟動時會自動重新整理 Marketplace 資料並更新已安裝的插件。

若使用 Git submodule 方式安裝：

```bash
git submodule update --remote .claude/plugins/frontend-craft
```

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
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 授權條款

MIT - 自由使用、依需求修改，歡迎回饋。

---

**若本倉庫對您有幫助，請給予 Star。打造出色的前端。**
