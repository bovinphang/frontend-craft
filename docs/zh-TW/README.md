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

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](README.md) | [日本語](../../docs/ja-JP/README.md) | [한국어](../ko-KR/README.md)


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

初始化後請依專案實際情況修改 `.claude/CLAUDE.md`、`rules/` 與 `settings.json`。

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

✨ **完成！** 您現在可使用 5 個代理、8 個技能與 3 個指令。

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
|   |-- react-project-standard/  # React + TypeScript 專案規範
|   |-- vue3-project-standard/  # Vue 3 + TypeScript 專案規範
|   |-- implement-from-design/   # 依設計稿實作 UI
|   |-- test-and-fix/            # lint、type-check、test、build 並修復
|   |-- legacy-web-standard/     # JS + jQuery + HTML 傳統專案規範
|
|-- commands/         # 斜線指令
|   |-- init.md        # /init - 初始化專案範本
|   |-- review.md      # /review - 程式碼審查
|   |-- scaffold.md    # /scaffold - 建立 page/feature/component
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
```

---

## 📥 安裝

> **需求：** Claude Code v1.0.33+、Node.js >= 18、npm/pnpm/yarn。

### 選項 1：作為插件安裝（建議）

```bash
/plugin marketplace add bovinphang/frontend-craft
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

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### 選項 4：Git Submodule（專案級共享）

```bash
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft
# 團隊：git submodule update --init --recursive
# 載入：claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 功能概覽

### Commands（斜線指令）

| 指令 | 用途 | 輸出報告 |
|------|------|----------|
| `/frontend-craft:init` | 將專案範本初始化至 `.claude/` 目錄 | — |
| `/frontend-craft:review` | 對指定或最近變更的檔案執行程式碼審查 | `code-review-*.md` |
| `/frontend-craft:scaffold` | 建立 page / feature / component 標準結構 | — |

### Skills（自動啟用）

| Skill | 用途 | 輸出報告 |
|-------|------|----------|
| `frontend-code-review` | 架構、型別、渲染、樣式、無障礙審查 | `code-review-*.md` |
| `security-review` | XSS、CSRF、敏感資料、輸入驗證 | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA 無障礙檢查 | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript 專案規範 | — |
| `vue3-project-standard` | Vue 3 + TypeScript 專案規範 | — |
| `implement-from-design` | 依設計稿實作 UI | `design-plan-*.md` |
| `test-and-fix` | lint、type-check、test、build 並修復 | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML 傳統專案規範 | — |

### Agents（子代理）

| Agent | 用途 | 輸出報告 |
|-------|------|----------|
| `frontend-architect` | 頁面拆分、元件架構、狀態流設計、重構 | `architecture-proposal-*.md` |
| `performance-optimizer` | 效能瓶頸分析、量化優化方案 | `performance-review-*.md` |
| `ui-checker` | UI 視覺問題、設計還原度評估 | `ui-fidelity-review-*.md` |
| `figma-implementer` | 依設計稿精確實作 UI | `design-implementation-*.md` |
| `design-token-mapper` | 設計變數對應至 Design Token | `token-mapping-*.md` |

### Hooks（自動執行）

| 事件 | 行為 |
|------|------|
| `SessionStart` | 自動偵測專案框架與套件管理工具 |
| `PreToolUse(Bash)` | 攔截危險指令（rm -rf、force push 等） |
| `PostToolUse(Write/Edit)` | 對修改的檔案自動執行 Prettier |
| `Stop` | 會話結束時執行 lint、type-check、test、build |
| `Notification` | 跨平台桌面通知 |

### MCP 整合

| 服務 | 用途 |
|------|------|
| Figma / Figma Desktop | 讀取設計上下文、變數定義 |
| Sketch | 讀取設計選區截圖 |
| MasterGo | 讀取 DSL 結構資料 |
| Pixso | 本地 MCP 取得幀資料、程式碼片段 |
| 墨刀 | 取得原型資料、產生設計描述 |
| 摹客 | 無 MCP，透過使用者截圖／標註支援 |

---

## 📄 報告輸出

所有審查、分析與評估功能均自動將報告儲存為 Markdown 檔案至專案 `reports/` 目錄。

| 報告類型 | 檔名模式 | 來源 |
|----------|----------|------|
| 程式碼審查 | `code-review-*.md` | `/review`、`frontend-code-review` |
| 安全審查 | `security-review-*.md` | `security-review` |
| 無障礙檢查 | `accessibility-review-*.md` | `accessibility-check` |
| 效能分析 | `performance-review-*.md` | `performance-optimizer` |
| 架構方案 | `architecture-proposal-*.md` | `frontend-architect` |
| 設計還原度 | `ui-fidelity-review-*.md` | `ui-checker` |
| 設計實作 | `design-implementation-*.md` | `figma-implementer` |
| Token 對應 | `token-mapping-*.md` | `design-token-mapper` |
| 設計計畫 | `design-plan-*.md` | `implement-from-design` |
| 測試修復 | `test-fix-*.md` | `test-and-fix` |

> **建議：** 於 `.gitignore` 加入 `reports/` 或依需求提交以保留歷史記錄。

---

## ⚙️ 設定

### MCP 環境變數

| 變數 | 工具 | 取得方式 |
|------|------|----------|
| `FIGMA_API_KEY` | Figma | Figma 帳戶 > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch 開發者設定 |
| `MG_MCP_TOKEN` | MasterGo | MasterGo 帳戶 > 安全設定 |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI 功能頁面 |

Pixso 使用本地 MCP（需於客戶端啟用）；摹客透過使用者截圖／標註支援。

---

## 📥 更新

```bash
# Marketplace 安裝
/plugin marketplace update bovinphang-frontend-craft

# 啟用自動更新：/plugin → Marketplaces → 選取 → Enable auto-update

# Submodule 安裝
git submodule update --remote .claude/plugins/frontend-craft
```

---

## 📄 授權條款

MIT — 自由使用、依需求修改，歡迎回饋。

---

**若本倉庫對您有幫助，請給予 Star。打造出色的前端。**
