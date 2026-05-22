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

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](../zh-TW/README.md) | [日本語](README.md) | [한국어](../ko-KR/README.md)

</div>

---

**Claude Code、Codex、Cursor、OpenCode、Gemini CLI、Qoder、Kilo、Windsurf、Copilot、Antigravity、Augment、Trae、CodeBuddy、Cline、OpenClaw などに対応する汎用フロントエンドプラグイン。**

`frontend-craft` は、フロントエンドレビュー agents、ワークフロー skills、スラッシュコマンド、hooks、MCP テンプレート、プロジェクトルールを 1 つのリポジトリで管理します。CLI で同じ標準を 15 種類の AI コーディング runtime に導入できます。**Claude Code Marketplace のみ**でネイティブプラグインとして入れる手順は [docs/runtimes/claude.md](../runtimes/claude.md)（[簡体字中国語](../runtimes/claude.zh-CN.md)）を参照してください。

---

## Community and Governance

- [Contributing Guide](../../CONTRIBUTING.md) - development setup, PR checklist, and localization policy.
- [Security Policy](../../SECURITY.md) - private vulnerability reporting and supported scope.
- [Code of Conduct](../../CODE_OF_CONDUCT.md) - community standards for participation.

---

## Universal Install（推奨）

**Node.js 22+** が必要です。CLI は各ツールの規約に沿ったレイアウトへファイルを書き込みます（パス規則は [`src/install/runtime-homes.ts`](../../src/install/runtime-homes.ts)）。

**ターミナルでの対話インストール（推奨）：** `npx frontend-craft@latest` または `npx frontend-craft@latest install` を runtime なしで実行すると、複数 runtime の選択と Global / Local の選択に進みます。`install <runtime>` のみ指定し `--global` / `--local` を省略した場合も、**TTY** 上ではインストール先を確認します。

**スクリプト / CI：** 常に **`--global` / `-g`** または **`--local` / `-l`** を付けてください。stdin が TTY でなく、どちらもない場合は **`claude` の global インストール** にフォールバックし、短い案内を表示します。

```bash
npx frontend-craft@latest list
npx frontend-craft@latest install --local claude
npx frontend-craft@latest install --global codex
npx frontend-craft@latest install cursor --local
npx frontend-craft@latest install --all --dry-run --global
```

対応 runtime: `claude`, `codex`, `cursor`, `windsurf`, `opencode`, `kilo`, `gemini`, `copilot`, `antigravity`, `augment`, `trae`, `codebuddy`, `cline`, `openclaw`, `qoder`.

各 runtime のメモは [`docs/runtimes/`](../runtimes/) を参照してください。

---

## クイックスタート

1. `npx frontend-craft@latest`（ウィザード）または `npx frontend-craft@latest install --local <runtime>` / `install --global <runtime>`（スクリプト向け）を実行します。
2. [`docs/runtimes/`](../runtimes/) で利用ツールのメモを開きます（パスや注意点）。
3. **Claude Code Marketplace のみ：** マーケットプレイスでの導入、`/fec-init`、更新手順の全文は [docs/runtimes/claude.md](../runtimes/claude.md) · [簡体字中国語](../runtimes/claude.zh-CN.md)。

---

## 🌐 クロスプラットフォーム対応

本プラグインは **Windows、macOS、Linux** を完全サポート。すべてのフックとスクリプトは Node.js で実装され、クロスプラットフォーム互換性を確保しています。

---

## マルチエージェント向けスキル（Skills CLI）

**Claude Code**、**OpenAI Codex**、**Cursor**、**OpenCode**、**Gemini CLI**、**OpenClaw**、**Continue**、**CodeBuddy**、**Trae**、**Kimi Code CLI** など複数の AI コーディングエージェントを使う場合、[Skills CLI](https://skills.sh/docs/cli)（`npx skills`）で本リポジトリの**ワークフロースキル**を、各ツールが参照するスキルディレクトリにインストールできます。CLI は数十種類のエージェントに対応します。一覧は対話プロンプトまたは公式ドキュメントを参照してください。

### Skills CLI と frontend-craft CLI の違い

- **Skills CLI** — [`skills/`](../../skills/) 配下のスキルパッケージを、選択したエージェント用ディレクトリに配置します。ツール横断でレビューやフロントエンド規約を揃えたいとき向けです。
- **`npx frontend-craft`** — 本リポジトリが対応する skills、runtime 別 agents、commands、hooks、rules、テンプレートを導入します。手順は上の **Universal Install** を参照（対話ウィザード、または非対話では `install` に `--local` / `--global`）。

### 要件

`frontend-craft` は Node.js 22+ が必要です。`npx skills` を使う場合は Skills CLI 側の要件に従ってください。

### スキルのインストール

```bash
npx skills add bovinphang/frontend-craft
```

プロジェクト／グローバル（`-g`）、シンボリックリンク／コピー（`--copy`）、対象エージェントなどはプロンプトに従って選択します。インストールせずリポジトリ内のスキル一覧だけ見る場合は `npx skills add bovinphang/frontend-craft -l` を使います。特定のスキルやエージェントだけ入れる場合は `--skill` / `--agent`（`npx skills --help` 参照）。

### スキルの更新

スキルをインストールしたプロジェクトのディレクトリで（グローバル導入の場合はそのスコープで）実行します。

```bash
npx skills update
```

インストール済みスキルを最新版に更新します。事前に `npx skills check` で更新の有無を確認できます。

**テレメトリ:** CLI は既定で匿名テレメトリを収集する場合があります。無効化するには環境変数 `DISABLE_TELEMETRY=1` を設定してください。詳細は [skills.sh CLI ドキュメント](https://skills.sh/docs/cli) を参照してください。

---

## 📦 内容

本リポジトリは **汎用フロントエンドプラグイン**で、複数の AI コーディングツール向けのネイティブレイアウトを含みます。Claude Code プラグインのメタデータは `.claude-plugin/` にあります。

本リポジトリは **agents**、**skills**、**commands**、**hooks**、**scripts**、**templates** を 1 つのインストール単位にまとめています。詳細なディレクトリ構造とファイルの役割は [プロジェクト構造の詳細](../project-structure.md) を参照してください。

**主な内容：**

- **13 個の専門 agent** — コードレビュー、セキュリティ、テスト、パフォーマンス、アーキテクチャ、UI 忠実度、デザイン実装
- **31 個の自動スキル** — React/Vue/Next/Nuxt 規約、アクセシビリティ、セキュリティ、フォーム、データ取得、PWA、E2E など
- **9 個のスラッシュコマンド** — `/fec-init`、`/fec-review`、`/fec-test-plan`、`/fec-scaffold`、`/fec-plan`、`/fec-tdd`、`/fec-build-fix`、`/fec-refactor-clean`、`/fec-doc-sync`
- **5 個のイベント駆動フック** — セッション検出、セキュリティチェック、自動フォーマット、バリデーション、通知
- **MCP 統合** — Figma、Sketch、MasterGo、Pixso、墨刀、摹客
- **プロジェクトテンプレート** — CLAUDE.md、ルール（Vue/React/デザインシステム/テストなど）、settings.json

---

## 📋 機能概要

下表の**スラッシュコマンド**は対照用に Claude Code を例示しています。他の runtime はインストールされた commands とテンプレートで同等の機能を提供します（[`docs/runtimes/`](../runtimes/)）。

### Commands（スラッシュコマンド）

| コマンド         | 用途                                                                     | レポート出力       |
| ---------------- | ------------------------------------------------------------------------ | ------------------ |
| `/fec-init`      | プロジェクトテンプレートを `.claude/` に初期化                           | —                  |
| `/fec-review`    | 指定または最近変更したファイルのコードレビュー、段階別レポート出力       | `code-review-*.md` |
| `/fec-test-plan` | フロントエンドテスト階層、リスクカバレッジ、実行順を計画                 | `test-plan-*.md`   |
| `/fec-scaffold`  | 規約に従い page / feature / component の標準構造とボイラープレートを作成 | —                  |

### Skills（自動有効化）

| Skill                            | 用途                                                                                           | レポート出力                |
| -------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------- |
| `fec-frontend-code-review`       | アーキテクチャ、型、レンダリング、スタイル、a11y の観点でコードレビュー                        | `code-review-*.md`          |
| `fec-security-review`            | XSS、CSRF、機密データ漏洩、入力検証などのセキュリティレビュー                                  | `security-review-*.md`      |
| `fec-accessibility-check`        | WCAG 2.1 AA アクセシビリティチェック                                                           | `accessibility-review-*.md` |
| `fec-react-project-standard`     | React + TypeScript プロジェクト規約（構造、コンポーネント、ルーティング、状態、API 層）        | —                           |
| `fec-vue3-project-standard`      | Vue 3 + TypeScript プロジェクト規約（構造、コンポーネント、ルーティング、Pinia、API 層）       | —                           |
| `fec-implement-from-design`      | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 のデザインから UI を実装                                 | `design-plan-*.md`          |
| `fec-validation-fix`             | lint、type-check、test、build を実行し失敗を修正                                               | `validation-fix-*.md`       |
| `fec-tdd-workflow`               | テストファーストのフロントエンド実装、Bug 修正、red-green-refactor                            | —                           |
| `fec-refactor-clean`             | デッドコード、未使用 export、スタイル、ルート、依存関係の安全な清理                            | `refactor-clean-*.md`       |
| `fec-doc-sync`                   | 公開 docs と scripts、skills、agents、commands、templates を同期                               | —                           |
| `fec-legacy-web-standard`        | JS + jQuery + HTML レガシープロジェクトの開発・保守規約                                        | —                           |
| `fec-legacy-to-modern-migration` | jQuery/MPA から React/Vue 3 + TS への移行戦略、概念マッピング、段階的ワークフロー              | `migration-plan-*.md`       |
| `fec-testing-strategy`           | テスト階層選択、リスクマトリクス、カバレッジ計画                                               | `test-plan-*.md`            |
| `fec-e2e-testing`                | Playwright/Cypress E2E テスト規約：ディレクトリ構造、Page Object、CI 統合                      | —                           |
| `fec-nextjs-project-standard`    | Next.js 14+ App Router、SSR/SSG、ストリーミング、メタデータ規約                                | —                           |
| `fec-nuxt-project-standard`      | Nuxt 3 SSR/SSG、Composition API、データ取得、ルーティング、ミドルウェア規約                    | —                           |
| `fec-monorepo-project-standard`  | pnpm workspace、Turborepo、Nx：ディレクトリ構造、依存管理、タスク編成                          | —                           |
| `fec-data-fetching`              | TanStack Query / サーバー状態取得、キャッシュ、無効化、楽観的更新                              | —                           |
| `fec-form-handling`              | React Hook Form + Zod フォーム、動的フィールド、アップロード、マルチステップ                   | —                           |
| `fec-browser-storage`            | localStorage/sessionStorage/IndexedDB/Cookies の選定と安全な永続化                             | —                           |
| `fec-route-protection`           | React Router、Next.js、Vue Router、Nuxt の認証・権限ルーティング保護                           | —                           |
| `fec-component-testing`          | React Testing Library / Vue Test Utils コンポーネントテストとリグレッション                    | —                           |
| `fec-storybook-component-doc`    | Storybook コンポーネントドキュメント、Addon、MDX、インタラクションテスト・ビジュアルテスト統合 | —                           |
| `fec-list-virtualization`        | react-window / TanStack Virtual 大規模リスト仮想化と測定戦略                                   | —                           |
| `fec-ui-design-direction`        | プロダクト固有の UI 方向性、ファーストビュー階層、ドメイントーン、視覚戦略                     | —                           |
| `fec-interface-polish`           | 余白、タイポグラフィ、角丸、影、ヒット領域、状態、トランジションの磨き込み                     | —                           |
| `fec-vite-project-standard`      | Vite 設定、環境変数安全性、HMR、開発プロキシ、ビルド最適化、ライブラリモード                   | —                           |
| `fec-pwa-implementation`         | Manifest、サービスワーカー、オフラインキャッシュ、インストールプロンプト、更新管理             | —                           |
| `fec-web-workers`                | Web Worker、Transferable、Comlink、Worker プール                                               | —                           |
| `fec-canvas-threejs`             | Canvas 2D、Three.js、React Three Fiber、WebGL パフォーマンスとアクセシビリティ                 | —                           |
| `fec-svg-animation`              | CSS、Framer Motion、GSAP SVG アニメーションと reduced-motion 代替                              | —                           |

### Agents（サブエージェント）

| Agent                        | 用途                                                                                                        | レポート出力                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `frontend-architect`         | ページ分割、コンポーネントアーキテクチャ、状態フロー、ディレクトリ計画、大規模リファクタリング              | `architecture-proposal-*.md` |
| `frontend-code-reviewer`     | フロントエンドコードレビュー：React/Vue/Next/Nuxt、TS、スタイル、クライアント側セキュリティ                 | `code-review-*.md`           |
| `frontend-security-reviewer` | フロントエンドセキュリティ：XSS、クライアントシークレット、危険な DOM/API、CSP、依存監査                    | `security-review-*.md`       |
| `frontend-test-planner`      | フロントエンドテスト戦略: リスクを静的、単体、コンポーネント、E2E、視覚、a11y、セキュリティ、性能に対応付け | `test-plan-*.md`             |
| `frontend-build-fixer`       | lint、type-check、test、build、CI 失敗を段階的に修正                                      | `validation-fix-*.md`        |
| `frontend-refactor-cleaner`  | 未使用のフロントエンドコード、export、スタイル、ルート、依存関係を分類して安全に清理          | `refactor-clean-*.md`        |
| `frontend-doc-updater`       | README、runtime docs、プロジェクト構造、能力表、公開 metadata を同期                         | —                            |
| `frontend-e2e-runner`        | E2E 作成・実行（Playwright/Cypress）、flaky 隔離、Trace/スクリーンショット、CI；任意で要約レポート          | `e2e-summary-*.md`（任意）   |
| `typescript-reviewer`        | TS/JS レビュー：typecheck/eslint、PR マージ可否、型・非同期・セキュリティ；コード改変なし                   | `typescript-review-*.md`     |
| `performance-optimizer`      | パフォーマンスボトルネック分析（バンドルサイズ、レンダリング、ネットワーク）、定量化された最適化案          | `performance-review-*.md`    |
| `ui-checker`                 | UI ビジュアル問題のデバッグ、デザイン忠実度評価                                                             | `ui-fidelity-review-*.md`    |
| `figma-implementer`          | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 のデザインから正確に UI を実装                                        | `design-implementation-*.md` |
| `design-token-mapper`        | デザイン変数をプロジェクトの Design Token にマッピング                                                      | `token-mapping-*.md`         |

### Hooks（自動実行）

| イベント                  | 動作                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `SessionStart`            | プロジェクトフレームワークとパッケージマネージャーを検出          |
| `PreToolUse(Bash)`        | 危険なコマンドをブロック（rm -rf、force push など）               |
| `PostToolUse(Write/Edit)` | 変更ファイルに自動 Prettier                                       |
| `Stop`                    | セッション終了時に lint、type-check、test、build を実行           |
| `Notification`            | クロスプラットフォームデスクトップ通知（macOS / Linux / Windows） |

### MCP 連携

| サービス      | 用途                                                                  |
| ------------- | --------------------------------------------------------------------- |
| Figma         | デザインコンテキスト、変数定義の読み取り                              |
| Figma Desktop | Figma デスクトップ連携                                                |
| Sketch        | デザイン選択スクリーンショットの読み取り                              |
| MasterGo      | DSL 構造データ、コンポーネント階層とスタイルの読み取り                |
| Pixso         | ローカル MCP でフレームデータ、コードスニペット、画像リソース取得     |
| 墨刀          | プロトタイプデータ取得、デザイン説明生成、HTML インポート             |
| 摹客          | MCP なし、ユーザーのスクリーンショット／注釈／エクスポート CSS で対応 |

### プロジェクトテンプレート（`/fec-init` で初期化）

| ファイル                      | 用途                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| `CLAUDE.md`                   | プロジェクト説明、常用コマンド、作業原則、セキュリティ要件                                       |
| `settings.json`               | 権限ホワイトリスト／ブラックリスト、環境変数                                                     |
| `rules/vue.md`                | Vue 3 コンポーネント規約とアンチパターン                                                         |
| `rules/react.md`              | React コンポーネント規約とアンチパターン                                                         |
| `rules/design-system.md`      | デザインシステム、Token、アクセシビリティルール                                                  |
| `rules/testing.md`            | テストと検証ルール                                                                               |
| `rules/git-conventions.md`    | Conventional Commits 規約                                                                        |
| `rules/i18n.md`               | 国際化コピー規約                                                                                 |
| `rules/performance.md`        | フロントエンドパフォーマンス最適化ルール                                                         |
| `rules/api-layer.md`          | API 層の型付け、エラーハンドリング規約                                                           |
| `rules/state-management.md`   | 状態分類、管理戦略、アンチパターン                                                               |
| `rules/error-handling.md`     | エラー階層、Error Boundary、フォールバック UI、レポート規約                                      |
| `rules/naming-conventions.md` | ファイル、コンポーネント、変数、ルート、API、CSS の統一命名規約                                  |
| `rules/ci-cd.md`              | CI/CD パイプライン段階、GitHub Actions / GitLab CI 例、シークレット管理                          |
| `rules/refactoring.md`        | リファクタリング制約：画像、スタイル、インライン SVG/スタイル禁止、flex レイアウト優先、機能同等 |
| `rules/agent-workflow.md`     | サブエージェント協作境界と委任ガイド                                      |
| `rules/working-modes.md`      | 調査、計画、開発、レビュー、完了モードのガイド                          |

---

## ⚙️ 設定

### 前提条件

- Node.js 22+
- npm、pnpm、yarn のいずれか
- Git Bash（Windows ではフックスクリプト実行に必要）

### MCP サーバー

デザイン関連機能を使う前に、使用するデザインツールに応じて環境変数を設定してください：

| 環境変数         | ツール                | 取得方法                                            |
| ---------------- | --------------------- | --------------------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma アカウント設定 > Personal Access Tokens       |
| `SKETCH_API_KEY` | Sketch                | Sketch 開発者設定                                   |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo アカウント設定 > セキュリティ > Token 生成 |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 機能ページでアクセストークン取得            |

> Pixso はローカル MCP を使用。Pixso クライアントで MCP を有効化。追加の環境変数は不要。
> 摹客は MCP なし。ユーザーのスクリーンショット／注釈で対応。

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

シェル設定（`~/.bashrc`、`~/.zshrc`）または Windows のシステム環境変数に追加することを推奨します。

---

## 📄 レポート出力

すべてのレビュー・分析・評価結果はプロジェクトの `reports/` ディレクトリに Markdown ファイルとして自動保存されます。

| レポート種別         | ファイル名パターン                                       | ソース                                                                                           |
| -------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| コードレビュー       | `code-review-YYYY-MM-DD-HHmmss.md`                       | `/fec-review` コマンド、`fec-frontend-code-review` スキル、`frontend-code-reviewer` エージェント |
| `/fec-test-plan`     | フロントエンドテスト階層、リスクカバレッジ、実行順を計画 | `test-plan-*.md`                                                                                 |
| TS/JS レビュー       | `typescript-review-YYYY-MM-DD-HHmmss.md`                 | `typescript-reviewer` エージェント                                                               |
| セキュリティレビュー | `security-review-YYYY-MM-DD-HHmmss.md`                   | `fec-security-review` スキル、`frontend-security-reviewer` エージェント                          |
| アクセシビリティ     | `accessibility-review-YYYY-MM-DD-HHmmss.md`              | `fec-accessibility-check` スキル                                                                 |
| パフォーマンス       | `performance-review-YYYY-MM-DD-HHmmss.md`                | `performance-optimizer` エージェント                                                             |
| アーキテクチャ       | `architecture-proposal-YYYY-MM-DD-HHmmss.md`             | `frontend-architect` エージェント                                                                |
| デザイン忠実度       | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`                | `ui-checker` エージェント                                                                        |
| デザイン実装         | `design-implementation-YYYY-MM-DD-HHmmss.md`             | `figma-implementer` エージェント                                                                 |
| Token マッピング     | `token-mapping-YYYY-MM-DD-HHmmss.md`                     | `design-token-mapper` エージェント                                                               |
| デザイン計画         | `design-plan-YYYY-MM-DD-HHmmss.md`                       | `fec-implement-from-design` スキル                                                               |
| テスト計画           | `test-plan-YYYY-MM-DD-HHmmss.md`                         | `fec-testing-strategy` スキル / `frontend-test-planner` エージェント                             |
| 検証修正             | `validation-fix-YYYY-MM-DD-HHmmss.md`                    | `fec-validation-fix` スキル                                                                      |
| リファクタ清理       | `refactor-clean-YYYY-MM-DD-HHmmss.md`                    | `/fec-refactor-clean`、`fec-refactor-clean` スキル、`frontend-refactor-cleaner` エージェント       |
| E2E 実行サマリー     | `e2e-summary-YYYY-MM-DD-HHmmss.md`                       | `frontend-e2e-runner` エージェント（任意）                                                       |
| 移行計画             | `migration-plan-YYYY-MM-DD-HHmmss.md`                    | `fec-legacy-to-modern-migration` スキル                                                          |

> **ヒント：** `.gitignore` に `reports/` を追加して自動生成レポートのコミットを避けるか、チームの履歴のためにコミットを残してください。

---

## アップデート

- **CLI インストール:** 同じ `--local` / `--global` と runtime で `npx frontend-craft@latest install` を再実行し、[CHANGELOG.md](../../CHANGELOG.md) を確認してください。
- **Claude Code Marketplace または submodule:** [docs/runtimes/claude.md](../runtimes/claude.md) の **Updating** · [簡体字中国語](../runtimes/claude.zh-CN.md)。

---

## 🎯 重要概念

### エージェント

サブエージェントは委任されたタスクを限定的な範囲で処理します。例：

```markdown
---
name: performance-optimizer
description: フロントエンドのパフォーマンスボトルネックを分析し最適化案を提示
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
---

あなたはフロントエンドのパフォーマンス分析と最適化に特化したシニアエンジニアです...
```

### スキル

スキルはコマンドやエージェントから呼び出されるワークフロー定義で、レビュー観点、出力形式、レポートファイルの規約を含みます：

```markdown
# フロントエンドコードレビュー

## レビュー観点

1. アーキテクチャ - コンポーネント境界、責務の分離
2. 型安全性 - any の使用、props の型
   ...

## レポートファイル出力

- ディレクトリ: reports/
- ファイル名: code-review-YYYY-MM-DD-HHmmss.md
```

### フック

フックはツールイベント時に実行されます。例 — 危険なコマンドをブロック：

```json
{
  "event": "PreToolUse",
  "matcher": "tool == \"Bash\"",
  "command": "node \"${FRONTEND_CRAFT_ROOT}/dist/hooks/security-check.js\""
}
```

---

## 📄 ライセンス

MIT — 自由に使用、必要に応じて変更、可能であれば貢献を。

---

**このリポジトリが役に立ったら、Star をお願いします。素晴らしいフロントエンドを。**
