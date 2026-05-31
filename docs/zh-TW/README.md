<div align="center">

# frontend-craft

### 一套工具，適配所有 AI 程式設計助手，落地生產級前端規範。

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/frontend-craft)](https://www.npmjs.com/package/frontend-craft)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)
![Node](https://img.shields.io/badge/Node.js-22+-5FA04E?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vue](https://img.shields.io/badge/-Vue-4FC08D?logo=vue.js&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white)

**🌐 Language / 语言 / 語言 / 言語 / 언어**

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [**繁體中文**](README.md) · [日本語](../ja-JP/README.md) · [한국어](../ko-KR/README.md)

</div>

---

`frontend-craft` 是一個**通用前端插件**，為以下 **15 款 AI 程式設計助手**注入統一的前端工程規範：

`claude` `codex` `cursor` `windsurf` `opencode`
`kilo` `gemini` `copilot` `antigravity` `augment`
`trae` `codebuddy` `cline` `openclaw` `qoder`

各執行時的路徑與注意事項詳見 [`docs/runtimes/`](../runtimes/)。

它將 **13 個專業 agent**、**40 個自動啟用 skill**、**8 個斜線指令**、**5 個事件驅動 hook**、面向 6 個設計工具端點的 **MCP 整合**以及一整套**規則庫**打包為一個可安裝單元。執行一條指令，團隊裡的每一次 AI 會話都將以相同的方式編寫 React、Vue、Next.js 或 Nuxt——型別安全、可存取、安全、一致。

---

## 為什麼選擇 frontend-craft？

| 痛點                                            | frontend-craft 的解法                                                   |
| ----------------------------------------------- | ----------------------------------------------------------------------- |
| AI 助手寫出的前端程式碼風格不一、缺型別、不安全 | **40 個 skill** 將團隊規範編碼為可自動啟用的工作流                      |
| 每款 AI 工具都有自己的插件格式                  | **一條 CLI 指令** 把相同的規則、agent 和 hook 安裝到 15 個執行時        |
| 設計稿到程式碼的交接總有資訊損失                | **MCP 整合** 從 Figma、Figma Desktop、Sketch、MasterGo、Pixso、墨刀引入更完整設計上下文 |
| 程式碼審查隨意、淺層                            | **13 個 agent** 輸出分級報告：程式碼、安全、無障礙、效能、TS、UI 還原度 |
| 沒人記得跑 lint 和測試                          | **事件驅動 hook** 在儲存和會話結束時自動校驗                            |
| 新專案每次都從零開始                            | **`/fec-init`** 幾秒內腳手架化 CLAUDE.md、規則和 settings               |

---

## 安裝

需要 **Node.js 22+**。完整支援 **Windows、macOS 和 Linux**（所有鉤子和腳本均使用 Node.js 實作）。

### 方式一：全域 CLI 初始化專案（推薦）

```bash
npm install -g frontend-craft@latest
cd your-project
fec init
fec init codex      # 初始化指定執行時
fec init claude     # 初始化 Claude Code
```

`fec init` 是終端機中的 CLI 初始化指令，用來初始化目前專案。在互動式終端機中，不傳 runtime 時會顯示選擇提示；在非互動環境中，不傳 runtime 時 CLI 預設使用 `claude`。`init` 預設安裝到目前專案，除非明確傳入 `--global`，例如 `fec init codex --global`。AI 助手內的 `/fec-init` 斜線指令是另一個入口，需要先把 frontend-craft 安裝到對應執行時後再使用。

### 方式二：免全域安裝的互動精靈

```bash
npx frontend-craft@latest
```

不想全域安裝 `fec` 指令時使用這種方式。精靈會走完整安裝流程：先選擇一個或多個執行時，再決定安裝到全域還是目前專案。

### 方式三：腳本化安裝

```bash
# 安裝到目前專案
npx frontend-craft@latest install --local claude

# 全域安裝到某個執行時
npx frontend-craft@latest install --global codex

# 預覽所有執行時的安裝內容（不實際寫入）
npx frontend-craft@latest install --all --dry-run --global

# 列出支援的執行時
npx frontend-craft@latest list
```

> **CI / 腳本場景：** 務必帶上 `--global` / `-g` 或 `--local` / `-l`。非 TTY 且未指定時，CLI 預設安裝到 `claude --global`。

### 方式四：Claude Code Marketplace

如果只透過 **Claude Code Marketplace**（原生插件流程）安裝，完整步驟見 [docs/runtimes/claude.zh-CN.md](../runtimes/claude.zh-CN.md) · [English](../runtimes/claude.md)。

---

## 快速開始

安裝完成後，你在每一次 AI 會話中都擁有一套完整的前端工程工具箱：

```text
你："Review my recent changes"
→ fec-code-reviewer agent 被調度，輸出 reports/code-review-*.md

你："/fec-review"
→ 按架構、型別、渲染、樣式、可存取性等維度執行結構化審查

你："根據這個 Figma 連結實現結算頁"
→ fec-figma-implementer agent 透過 MCP 讀取設計稿，輸出元件和報告

你："/fec-scaffold dashboard feature"
→ 依專案約定建立 page / feature / component 標準目錄結構

你："/fec-refactor-clean"
→ 分類並安全清理死程式碼、未使用匯出、樣式和依賴
```

下文斜線指令以 **Claude Code** 為例；其他執行時透過各自的指令系統提供同等能力（詳見 [`docs/runtimes/`](../runtimes/)）。

---

## 範例提示詞

完整的按場景組織提示詞庫請參考 [docs/example-prompts.md](../example-prompts.md)。

```text
你：「合併前請審查我最近的改動。重點看架構、型別安全、渲染行為、樣式、可存取性和缺失測試。」
你：「先不要寫程式碼，請規劃帳號帳單功能：路由結構、元件邊界、資料流、狀態歸屬、驗證流程和上線風險。」
你：「請用 React Hook Form + Zod 建構多步註冊表單，包含檔案上傳、條件欄位、非同步驗證和可存取錯誤提示。」
你：「請按 Figma 節點 123:456 實作 UI。複用現有 design token 和元件，匹配間距與響應式狀態，並說明假設。」
你：「`/fec-refactor-clean` 請清理這個模組裡的死程式碼。」
```

---

## 裡面有什麼

### 指令（Commands）

斜線指令是結構化工作流的主入口，多數會輸出帶時間戳記的 Markdown 報告到 `reports/`。

| 指令                  | 用途                                                        | 報告                                             |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| `/fec-init`           | 初始化專案範本（CLAUDE.md、規則、settings）                 | —                                                |
| `/fec-review`         | 對指定或最近變更的檔案執行結構化審查                        | `code-review-*.md`                               |
| `/fec-scaffold`       | 依規範建立 page / feature / component 樣板                  | —                                                |
| `/fec-plan`           | 統一規劃入口：實現架構或測試策略                            | `architecture-proposal-*.md` 或 `test-plan-*.md` |
| `/fec-tdd`            | 紅 → 綠 → 重構的前端 TDD 循環                               | —                                                |
| `/fec-debug`          | 前端問題診斷與修復：建置失敗、執行時錯誤、UI 異常、介面問題 | `debug-*.md`                                     |
| `/fec-refactor-clean` | 分類並安全清理死程式碼、未使用匯出、樣式和依賴              | `refactor-clean-*.md`                            |
| `/fec-doc-sync`       | 同步 README、runtime 文件、能力表和公開 metadata            | —                                                |

### 技能（Skills，自動啟用）

技能是根據檔案模式、框架或任務上下文**自動啟用**的工作流定義，編碼了審查維度、輸出約定和報告格式。

下方按使用場景分組列出全部自動啟用的技能，便於快速找到專案規範、實作、測試、審查、設計、遷移和文件維護能力。

**專案規範** — 偵測到對應框架時自動生效：

| 技能                            | 範圍                                                  |
| ------------------------------- | ----------------------------------------------------- |
| `fec-react-project-standard`    | React + TypeScript（結構、元件、路由、狀態、API 層）  |
| `fec-vue3-project-standard`     | Vue 3 + TypeScript（結構、元件、路由、Pinia、API 層） |
| `fec-nextjs-project-standard`   | Next.js 14+ App Router、SSR/SSG、流式渲染、元資料     |
| `fec-nuxt-project-standard`     | Nuxt 3 SSR/SSG、組合式 API、資料獲取、中介軟體        |
| `fec-vite-project-standard`     | Vite 設定、環境變數安全、HMR、開發代理、建置最佳化    |
| `fec-monorepo-project-standard` | pnpm workspace、Turborepo、Nx 結構與任務編排          |

**實作能力** — 建構特定前端能力時啟用：

| 技能                      | 範圍                                                       |
| ------------------------- | ---------------------------------------------------------- |
| `fec-data-fetching`       | TanStack Query / 服務端狀態獲取、快取、樂觀更新            |
| `fec-api-integration`     | 型別化 API client、鑑權刷新、上傳、即時整合                |
| `fec-form-handling`       | React Hook Form + Zod、動態欄位、上傳、多步流程            |
| `fec-browser-storage`     | localStorage / sessionStorage / IndexedDB / Cookies 選型   |
| `fec-route-protection`    | React Router、Next.js、Vue Router、Nuxt 的登入態與權限路由 |
| `fec-pwa-implementation`  | manifest、Service Worker、離線快取、安裝提示               |
| `fec-web-workers`         | Web Worker、Transferable、Comlink、Worker 池               |
| `fec-canvas-threejs`      | Canvas 2D、Three.js、React Three Fiber、WebGL              |
| `fec-svg-animation`       | CSS / Framer Motion / GSAP SVG 動畫與 reduced-motion       |
| `fec-list-virtualization` | react-window / TanStack Virtual 大清單虛擬滾動             |

**測試** — 規劃或撰寫前端測試覆蓋時啟用：

| 技能                    | 範圍                                                      |
| ----------------------- | --------------------------------------------------------- |
| `fec-testing-strategy`  | 靜態檢查、單元、元件、整合、E2E、視覺測試分層             |
| `fec-component-testing` | React Testing Library / Vue Test Utils 元件測試與回歸用例 |
| `fec-e2e-testing`       | Playwright / Cypress E2E 與 Page Object 和 CI 整合        |
| `fec-tdd-workflow`      | 測試先行的前端實作，紅綠重構循環                          |

**審查與品質** — 程式碼審查、驗證或清理時啟用：

| 技能                           | 範圍                                                    |
| ------------------------------ | ------------------------------------------------------- |
| `fec-code-review`              | 架構、型別、渲染、樣式、可存取性審查                    |
| `fec-security-review`          | XSS、CSRF、敏感資料外洩、輸入驗證                       |
| `fec-accessibility-check`      | WCAG 2.2、鍵盤、焦點、觸控和螢幕閱讀器行為              |
| `fec-dependency-upgrade`       | 依賴升級、lockfile 審查、CVE 修復和遷移驗證             |
| `fec-validation-fix`           | 一次性執行並修復 lint、type-check、test、build          |
| `fec-performance-optimization` | Core Web Vitals、包體、渲染、記憶體、網路與效能預算審查 |
| `fec-refactor-clean`           | 安全清理死程式碼、未使用匯出、樣式、路由和依賴          |

**設計 UI** — 設計實作、設計系統或視覺打磨時啟用：

| 技能                          | 範圍                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `fec-ui-design`               | UI 方向、視覺識別、界面打磨、狀態、視覺 QA               |
| `fec-tailwind-design-system`  | Tailwind token、主題擴展、元件變體、class 治理和暗色模式 |
| `fec-responsive-layout`       | 移動優先布局、容器查詢、資料密集型響應式界面             |
| `fec-motion-interaction`      | 互動動效、頁面轉場、滾動動畫、reduced-motion             |
| `fec-implement-from-design`   | 基於 Figma/Sketch/MasterGo/Pixso/墨刀設計稿或摹客素材實現 UI |
| `fec-storybook-component-doc` | Storybook 元件文件、設計系統呈現、隔離狀態預覽           |

**遺留遷移** — 現代化遷移時啟用：

| 技能                             | 範圍                                           |
| -------------------------------- | ---------------------------------------------- |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 傳統專案的開發與維護規範    |
| `fec-legacy-to-modern-migration` | jQuery/MPA → React/Vue 3 + TS 策略與分階段流程 |

**文件維護** — 文件維護時啟用：

| 技能                            | 範圍                                       |
| ------------------------------- | ------------------------------------------ |
| `fec-doc-sync`                  | 讓公開文件與腳本、技能、代理、指令保持同步 |
| `fec-source-driven-development` | 以專案事實和官方來源驗證版本敏感的前端決策 |

### 代理（Agents）

代理是由主助手調度的專業子代理，專注處理單一任務並返回結構化報告。

| 代理                        | 聚焦領域                                                  | 報告                         |
| --------------------------- | --------------------------------------------------------- | ---------------------------- |
| `fec-code-reviewer`         | React/Vue/Next/Nuxt、TS、樣式、用戶端安全（按置信度降噪） | `code-review-*.md`           |
| `fec-typescript-reviewer`   | 型別安全、非同步正確性、慣用模式（只報告不修改）          | `typescript-review-*.md`     |
| `fec-security-reviewer`     | XSS、用戶端金鑰、危險 DOM/API、CSP、依賴稽核              | `security-review-*.md`       |
| `fec-performance-optimizer` | 打包體積、渲染效能、網路瓶頸                              | `performance-review-*.md`    |
| `fec-architect`             | 頁面拆分、元件架構、狀態流、目錄規劃                      | `architecture-proposal-*.md` |
| `fec-test-planner`          | 風險-層級映射：靜態、單元、元件、E2E、視覺、無障礙、安全  | `test-plan-*.md`             |
| `fec-debugger`              | 複雜前端診斷：建置、執行時、UI 和介面問題                 | `debug-*.md`                 |
| `fec-refactor-cleaner`      | 分類並安全清理未使用程式碼、匯出、樣式、路由和依賴        | `refactor-clean-*.md`        |
| `fec-e2e-runner`            | E2E 撰寫與執行（Playwright/Cypress）、flaky 隔離、Trace   | `e2e-summary-*.md`           |
| `fec-doc-updater`           | 同步 README、runtime 文件、結構、能力表和 metadata        | —                            |
| `fec-ui-checker`            | 視覺問題排查與設計還原度評估                              | `ui-fidelity-review-*.md`    |
| `fec-figma-implementer`     | 依 Figma/Sketch/MasterGo/Pixso/墨刀設計稿精確實作 UI      | `design-implementation-*.md` |
| `fec-design-token-mapper`   | 將設計變數對應至專案 Design Token                         | `token-mapping-*.md`         |

### 鉤子（Hooks，事件驅動）

鉤子在 AI 助手事件觸發時**自動執行**，無需手動呼叫。

| 事件                      | 行為                                         |
| ------------------------- | -------------------------------------------- |
| `SessionStart`            | 清理 Claude 快取，然後自動偵測專案框架與套件管理工具 |
| `PreToolUse(Bash)`        | 攔截危險指令（`rm -rf`、force push 等）      |
| `PostToolUse(Write/Edit)` | 對修改的檔案自動執行 Prettier                |
| `Stop`                    | 會話結束時執行 lint、type-check、test、build |
| `Notification`            | 跨平台桌面通知（macOS / Linux / Windows）    |

### MCP 整合

將 AI 助手接入設計工具，建構帶有更完整設計上下文的設計轉程式碼工作流。

| 服務              | 能力                                   |
| ----------------- | -------------------------------------- |
| **Figma**         | 讀取設計上下文與變數定義               |
| **Figma Desktop** | Figma 桌面端整合                       |
| **Sketch**        | 讀取設計選區截圖                       |
| **MasterGo**      | 讀取 DSL 結構、元件層級與樣式          |
| **Pixso**         | 本地 MCP：幀資料、程式碼片段、圖片資源 |
| **墨刀**          | 原型資料、設計描述、HTML 匯入          |
| **摹客**          | 截圖／標註／匯出 CSS 工作流（無 MCP）  |

### 專案範本（`/fec-init`）

執行 `/fec-init` 即可將一套開箱即用的規則庫和專案設定腳手架化到 `.claude/`：

<details>
<summary>查看全部 20 個範本檔案</summary>

| 檔案                                     | 用途                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `CLAUDE.md`                              | 專案說明、常用指令、工作原則、安全要求                                |
| `settings.json`                          | 權限白名單／黑名單、環境變數                                          |
| `rules/fec-vue.md`                       | Vue 3 元件規範與反模式                                                |
| `rules/fec-react.md`                     | React 元件規範與反模式                                                |
| `rules/fec-design-system.md`             | 設計系統、Token、可存取性規則                                         |
| `rules/fec-testing.md`                   | 測試與校驗規則                                                        |
| `rules/fec-git-conventions.md`           | Conventional Commits 提交規範                                         |
| `rules/fec-i18n.md`                      | 國際化文案規範                                                        |
| `rules/fec-performance.md`               | 前端效能最佳化規則                                                    |
| `rules/fec-rendering-patterns.md`        | 渲染生命週期、hydration、SSR/CSR 與更新模式                           |
| `rules/fec-responsive-design.md`         | 響應式佈局、斷點、觸控目標與視口行為                                  |
| `rules/fec-source-driven-development.md` | Source-driven decisions, official docs, version-sensitive assumptions |
| `rules/fec-api-layer.md`                 | API 層型別化與錯誤處理規範                                            |
| `rules/fec-state-management.md`          | 狀態分類、管理策略與反模式                                            |
| `rules/fec-error-handling.md`            | 錯誤分層、Error Boundary、降級 UI、上報規範                           |
| `rules/fec-naming-conventions.md`        | 檔案、元件、變數、路由、API、CSS 統一命名                             |
| `rules/fec-code-comments.md`             | 何時以及如何寫前端註釋                                                |
| `rules/fec-ci-cd.md`                     | CI/CD 流水線階段、GitHub Actions / GitLab CI、金鑰管理                |
| `rules/fec-refactoring.md`               | 重構約束與功能等價要求                                                |
| `rules/fec-agent-workflow.md`            | 子代理協作邊界與委託規則                                              |
| `rules/fec-working-modes.md`             | 調研、計畫、開發、評審、收尾模式指引                                  |

</details>

---

## 設定

### 前置條件

- **Node.js 22+**
- **npm、pnpm 或 yarn**
- **Git Bash 或相容 shell**（僅 Windows，當 AI 執行時需要呼叫 shell 指令時）

### MCP 設計工具令牌

根據團隊使用的設計工具設定對應環境變數：

| 環境變數         | 工具                  | 取得方式                                  |
| ---------------- | --------------------- | ----------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma 帳戶設定 → Personal Access Tokens   |
| `SKETCH_API_KEY` | Sketch                | Sketch 開發者設定                         |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo 帳戶設定 → 安全設定 → 產生 Token |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 功能頁面 → 存取權杖               |

> **Pixso** 使用本地 MCP 服務 — 在 Pixso 用戶端中啟用即可，無需額外環境變數。
> **摹客** 暫無 MCP 整合 — 透過截圖和匯出 CSS 方式工作。

加入 shell 設定檔以持久化：

```bash
# macOS / Linux — 追加到 ~/.bashrc 或 ~/.zshrc
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

```powershell
# Windows — 設為系統環境變數，或在 PowerShell 中臨時設定：
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

---

## 報告輸出

每一次審查、分析和評估都會輸出帶時間戳記的 Markdown 報告到 `reports/`，可作為稽核記錄和 PR 交付物。

<details>
<summary>查看全部 15 種報告類型</summary>

| 報告類型       | 檔名模式                                     | 來源                                                                |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| 程式碼審查     | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`、`fec-code-review`、`fec-code-reviewer`               |
| TS/JS 專項審查 | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `fec-typescript-reviewer`                                           |
| 安全審查       | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`、`fec-security-reviewer`                      |
| 無障礙檢查     | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                           |
| 效能分析       | `performance-review-YYYY-MM-DD-HHmmss.md`    | `fec-performance-optimizer`                                         |
| 架構方案       | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `fec-architect`                                                     |
| 設計還原度     | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `fec-ui-checker`                                                    |
| 設計實現       | `design-implementation-YYYY-MM-DD-HHmmss.md` | `fec-figma-implementer`                                             |
| Token 對應     | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `fec-design-token-mapper`                                           |
| 設計計畫       | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                         |
| 測試計畫       | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-plan`、`fec-testing-strategy`、`fec-test-planner`             |
| 驗證修復       | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                |
| 重構清理       | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`、`fec-refactor-clean`、`fec-refactor-cleaner` |
| E2E 執行摘要   | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-e2e-runner`（可選）                                            |
| 遷移計畫       | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                    |

</details>

> **建議：** 在 `.gitignore` 中加入 `reports/` 以避免將自動產生的報告提交至程式碼倉庫，或保留提交以便團隊檢視歷史審查記錄。

---

## 保持更新

```bash
# 更新 CLI 安裝（作用域與初次安裝一致）
npx frontend-craft@latest update <runtime> --local
npx frontend-craft@latest update <runtime> --global
# `upgrade` 是 `update` 的別名
```

CLI 會在 runtime 目錄寫入 `frontend-craft.manifest.json`，並**跳過你本地修改過的檔案**——自訂內容在更新後依然保留。

**Claude Code Marketplace** 或 **submodule** 安裝的更新方式見 [docs/runtimes/claude.zh-CN.md](../runtimes/claude.zh-CN.md) · [English](../runtimes/claude.md)。

---

## 舊版 Skills CLI

如果團隊已在使用獨立的 [Skills CLI](https://skills.sh/docs/cli)，它仍然可以只安裝 [`skills/`](../../skills/) 下的工作流技能包：

```bash
npx skills add bovinphang/frontend-craft   # 按提示操作，加 -g 可全域安裝
npx skills update                          # 更新至最新版本
npx skills check                           # 預覽可用更新
```

| CLI                  | 安裝內容                                      |
| -------------------- | --------------------------------------------- |
| `npx frontend-craft` | 技能 + 執行時專屬代理、指令、鉤子、規則、範本 |
| `npx skills`         | 僅技能（適用於已有 Skills CLI 工作流）        |

關閉遙測：`DISABLE_TELEMETRY=1`。詳見 [skills.sh CLI 文件](https://skills.sh/docs/cli)。

---

## 社群

- [貢獻指南](../../CONTRIBUTING.md) — 開發環境、PR 檢查清單與多語言同步規則（[简体中文](../../CONTRIBUTING.zh-CN.md)）
- [安全政策](../../SECURITY.md) — 私密漏洞回報方式與支援範圍（[简体中文](../../SECURITY.zh-CN.md)）
- [行為準則](../../CODE_OF_CONDUCT.md) — 社群參與規範（[简体中文](../../CODE_OF_CONDUCT.zh-CN.md)）
- [變更日誌](../../CHANGELOG.md) — 版本說明（[简体中文](../../CHANGELOG.zh-CN.md)）
- [專案結構](../project-structure.md) — 完整目錄佈局與檔案職責

---

## 授權條款

[MIT](../../LICENSE) — 自由使用、依需求修改，歡迎回饋。

---

<div align="center">

**如果 frontend-craft 幫助了你的團隊，[請給它一個 Star](https://github.com/bovinphang/frontend-craft)。**

</div>
