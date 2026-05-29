<div align="center">

# frontend-craft

### ひとつのツールキット。すべての AI コーディングアシスタント。本番品質のフロントエンド標準。

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/frontend-craft)](https://www.npmjs.com/package/frontend-craft)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)
![Node](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vue](https://img.shields.io/badge/-Vue-4FC08D?logo=vue.js&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white)

**🌐 Language / 语言 / 語言 / 言語 / 언어**

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](../zh-TW/README.md) · [**日本語**](README.md) · [한국어](../ko-KR/README.md)

</div>

---

`frontend-craft` は、以下の **15 の AI コーディングアシスタント**に統一されたフロントエンドエンジニアリング標準をもたらす**汎用フロントエンドプラグイン**です：

`claude` `codex` `cursor` `windsurf` `opencode`
`kilo` `gemini` `copilot` `antigravity` `augment`
`trae` `codebuddy` `cline` `openclaw` `qoder`

各ランタイムのパスと注意事項は [`docs/runtimes/`](../runtimes/) にあります。

**13 の専門エージェント**、**39 の自動起動スキル**、**8 のスラッシュコマンド**、**5 のイベント駆動フック**、6 つのデザインツール向け **MCP テンプレート**、そして完全な**ルールライブラリ**をひとつのパッケージにまとめています。コマンドひとつ実行するだけで、チームのすべての AI セッションが React、Vue、Next.js、Nuxt を同じように書きます——型安全で、アクセシブルで、セキュアで、一貫性を持って。

```bash
npx frontend-craft@latest
```

これだけです。ウィザードが残りの手順を案内します。

---

## なぜ frontend-craft なのか？

| 課題                                                                          | frontend-craft の解決策                                                                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| AI アシスタントが一貫性のない、型なしの、安全でないフロントエンドコードを書く | **39 のスキル**がチーム標準をエンコード——該当ファイルに触れると自動起動                                      |
| AI ツールごとにプラグイン形式が異なる                                         | **ひとつの CLI** で同じルール、エージェント、フックを 15 のランタイムにインストール                          |
| デザインからコードへの受け渡しで情報が失われる                                | **MCP テンプレート**が Figma、Sketch、MasterGo、Pixso、墨刀、摹客を直接読み取り                              |
| レビューが場当たり的で浅い                                                    | **13 のエージェント**がグレード付きレポートを出力：コード、セキュリティ、a11y、パフォーマンス、TS、UI 忠実度 |
| 誰も lint やテストを実行するのを忘れる                                        | **イベント駆動フック**が保存時とセッション終了時に自動検証                                                   |
| 新規プロジェクトが毎回ゼロから始まる                                          | **`/fec-init`** が CLAUDE.md、ルール、設定を数秒でスキャフォールド                                           |

---

## インストール

**Node.js 22+** が必要です。**Windows、macOS、Linux** で動作します（すべてのフックとスクリプトは Node.js で実装）。

### 方法 1：対話ウィザード（推奨）

```bash
npx frontend-craft@latest
```

ウィザードで 1 つ以上のランタイムを選択し、グローバルまたはプロジェクト単位でのインストールを決定します。最もわかりやすい始め方です。

### 方法 2：スクリプト向けインストール

```bash
# 現在のプロジェクトにインストール
npx frontend-craft@latest install --local claude

# あるランタイムにグローバルインストール
npx frontend-craft@latest install --global codex

# すべてのランタイムへのインストール内容をプレビュー（実際には書き込まない）
npx frontend-craft@latest install --all --dry-run --global

# 対応ランタイムを一覧表示
npx frontend-craft@latest list
```

> **CI / スクリプト環境：** 常に `--global` / `-g` または `--local` / `-l` を指定してください。TTY でなく未指定の場合、CLI は `claude --global` をデフォルトとします。

### 方法 3：Claude Code Marketplace

**Claude Code Marketplace**（ネイティブプラグインフロー）のみでインストールする場合は、[docs/runtimes/claude.md](../runtimes/claude.md) · [简体中文](../runtimes/claude.zh-CN.md) に完全な手順があります。

---

## クイックスタート

インストール後、すべての AI セッションで完全なフロントエンドエンジニアリングツールキットを利用できます：

```text
あなた："Review my recent changes"
→ fec-code-reviewer エージェントが起動し、reports/code-review-*.md を出力

あなた："/fec-review"
→ アーキテクチャ、型、レンダリング、スタイル、a11y の観点で構造化レビューを実行

あなた："この Figma リンクからチェックアウトページを実装して"
→ fec-figma-implementer エージェントが MCP 経由でデザインを読み取り、コンポーネントとレポートを出力

あなた："/fec-scaffold dashboard feature"
→ プロジェクト規約に従い page / feature / component のディレクトリツリーを作成

あなた："/fec-refactor-clean"
→ デッドコード、未使用 export、スタイル、依存関係を分類して安全に削除
```

以下のスラッシュコマンドは **Claude Code** を例に示しています。他のランタイムも各自のコマンドシステムで同等の機能を提供します（[`docs/runtimes/`](../runtimes/) を参照）。

---

## 内容

### コマンド

スラッシュコマンドは構造化ワークフローの主要なエントリーポイントです。ほとんどが `reports/` にタイムスタンプ付き Markdown レポートを出力します。

| コマンド              | 用途                                                                | レポート                                             |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| `/fec-init`           | プロジェクトテンプレート（CLAUDE.md、ルール、設定）を初期化         | —                                                    |
| `/fec-review`         | 指定または最近変更したファイルの構造化レビュー                      | `code-review-*.md`                                   |
| `/fec-scaffold`       | 規約に従い page / feature / component のボイラープレートを作成      | —                                                    |
| `/fec-plan`           | 統合計画：実装アーキテクチャまたはテスト戦略                        | `architecture-proposal-*.md` または `test-plan-*.md` |
| `/fec-tdd`            | 赤 → 緑 → リファクタリングのフロントエンド TDD ループ               | —                                                    |
| `/fec-debug`          | フロントエンド問題の診断と修復：ビルド、ランタイム、UI、API 障害    | `debug-*.md`                                         |
| `/fec-refactor-clean` | デッドコード、未使用 export、スタイル、依存関係を分類して安全に削除 | `refactor-clean-*.md`                                |
| `/fec-doc-sync`       | README、ランタイムドキュメント、機能表、メタデータを同期            | —                                                    |

### スキル（自動起動）

スキルはファイルパターン、フレームワーク、タスクコンテキストに基づいて**自動起動**するワークフロー定義です。レビュー観点、出力規約、レポート形式をエンコードしています。

分類境界は意図的に狭くしています。実装機能は具体的なフロントエンド挙動、デザイン UI はデザインソース、デザインシステム表示、視覚方向、UI polish、テストはテスト戦略とテスト作成、レビューと品質は監査、検証修復、クリーンアップを扱います。ドキュメント保守は、今後のリリースワークフローや metadata 同期を拡張する入口として独立させています。

**プロジェクト標準** — 該当フレームワークが検出されると自動適用：

| スキル                          | 範囲                                                                    |
| ------------------------------- | ----------------------------------------------------------------------- |
| `fec-react-project-standard`    | React + TypeScript（構造、コンポーネント、ルーティング、状態、API 層）  |
| `fec-vue3-project-standard`     | Vue 3 + TypeScript（構造、コンポーネント、ルーティング、Pinia、API 層） |
| `fec-nextjs-project-standard`   | Next.js 14+ App Router、SSR/SSG、ストリーミング、メタデータ             |
| `fec-nuxt-project-standard`     | Nuxt 3 SSR/SSG、Composition API、データ取得、ミドルウェア               |
| `fec-vite-project-standard`     | Vite 設定、環境変数安全性、HMR、開発プロキシ、ビルド最適化              |
| `fec-monorepo-project-standard` | pnpm workspace、Turborepo、Nx の構造とタスクオーケストレーション        |

**実装機能** — 特定のフロントエンド機能を構築する際に起動：

| スキル                    | 範囲                                                                         |
| ------------------------- | ---------------------------------------------------------------------------- |
| `fec-data-fetching`       | TanStack Query / サーバー状態取得、キャッシュ、楽観的更新                    |
| `fec-api-integration`     | 型付き API client、認証 refresh、アップロード、リアルタイム統合              |
| `fec-form-handling`       | React Hook Form + Zod、動的フィールド、アップロード、マルチステップ          |
| `fec-browser-storage`     | localStorage / sessionStorage / IndexedDB / Cookies の選定                   |
| `fec-route-protection`    | React Router、Next.js、Vue Router、Nuxt の認証・権限ルーティング             |
| `fec-pwa-implementation`  | マニフェスト、サービスワーカー、オフラインキャッシュ、インストールプロンプト |
| `fec-web-workers`         | Web Worker、Transferable、Comlink、ワーカープール                            |
| `fec-canvas-threejs`      | Canvas 2D、Three.js、React Three Fiber、WebGL                                |
| `fec-svg-animation`       | CSS / Framer Motion / GSAP SVG アニメーションと reduced-motion               |
| `fec-list-virtualization` | react-window / TanStack Virtual による大規模リスト仮想化                     |

**テスト** — フロントエンドテストの計画や作成時に起動：

| スキル                  | 範囲                                                            |
| ----------------------- | --------------------------------------------------------------- |
| `fec-testing-strategy`  | 静的、ユニット、コンポーネント、統合、E2E、視覚テストの階層選択 |
| `fec-component-testing` | React Testing Library / Vue Test Utils とリグレッションシナリオ |
| `fec-e2e-testing`       | Playwright / Cypress E2E と Page Object、CI 統合                |
| `fec-tdd-workflow`      | テストファーストのフロントエンド実装、赤緑リファクタリング      |

**レビューと品質** — レビュー、検証、クリーンアップ時に起動：

| スキル                         | 範囲                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `fec-code-review`              | アーキテクチャ、型、レンダリング、スタイル、a11y レビュー                     |
| `fec-security-review`          | XSS、CSRF、機密データ漏洩、入力検証                                           |
| `fec-accessibility-check`      | WCAG 2.2、キーボード、フォーカス、タッチ、スクリーンリーダー動作              |
| `fec-dependency-upgrade`       | 依存関係アップグレード、lockfile レビュー、CVE 修正、移行検証                 |
| `fec-validation-fix`           | lint、type-check、test、build を一度に実行して修復                            |
| `fec-performance-optimization` | Core Web Vitals、バンドル、レンダリング、メモリ、ネットワーク、予算レビュー   |
| `fec-refactor-clean`           | デッドコード、未使用 export、スタイル、ルート、依存関係の安全なクリーンアップ |

**デザイン UI** — デザイン実装、デザインシステム、視覚仕上げで起動：

| スキル                        | 範囲                                                                      |
| ----------------------------- | ------------------------------------------------------------------------- |
| `fec-ui-design`               | UI 方向性、ビジュアル識別、ポリッシュ、状態、ビジュアル QA                |
| `fec-tailwind-design-system`  | Tailwind token、テーマ拡張、variants、class 管理、ダークモード            |
| `fec-responsive-layout`       | モバイルファースト、container queries、データ密集 responsive UI           |
| `fec-motion-interaction`      | インタラクション motion、ページ遷移、スクロール animation、reduced-motion |
| `fec-implement-from-design`   | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 のデザインから UI を実装            |
| `fec-storybook-component-doc` | Storybook コンポーネント文書、デザインシステム表示、隔離状態プレビュー    |

**レガシー移行** — モダナイゼーション時に起動：

| スキル                           | 範囲                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| `fec-legacy-web-standard`        | JS + jQuery + HTML のレガシープロジェクト開発・保守基準        |
| `fec-legacy-to-modern-migration` | jQuery/MPA → React/Vue 3 + TS への移行戦略と段階的ワークフロー |

**ドキュメント保守** — ドキュメント作業時に起動：

| スキル                          | 範囲                                                               |
| ------------------------------- | ------------------------------------------------------------------ |
| `fec-doc-sync`                  | 公開ドキュメントをスクリプト、スキル、エージェント、コマンドと同期 |
| `fec-source-driven-development` | プロジェクト事実と公式ソースでバージョン依存の判断を検証           |

### エージェント

エージェントはメインアシスタントから起動される専門サブエージェントで、特定のタスクに集中して構造化レポートを返します。

| エージェント                | 焦点                                                                                 | レポート                     |
| --------------------------- | ------------------------------------------------------------------------------------ | ---------------------------- |
| `fec-code-reviewer`         | React/Vue/Next/Nuxt、TS、スタイル、クライアント側セキュリティ（信頼度ベース）        | `code-review-*.md`           |
| `fec-typescript-reviewer`   | 型安全性、非同期の正しさ、慣用的パターン（レポートのみ）                             | `typescript-review-*.md`     |
| `fec-security-reviewer`     | XSS、クライアントシークレット、危険な DOM/API、CSP、依存関係監査                     | `security-review-*.md`       |
| `fec-performance-optimizer` | バンドルサイズ、レンダリングパフォーマンス、ネットワークボトルネック                 | `performance-review-*.md`    |
| `fec-architect`             | ページ分割、コンポーネントアーキテクチャ、状態フロー、ディレクトリ計画               | `architecture-proposal-*.md` |
| `fec-test-planner`          | リスク→階層マトリクス：静的、ユニット、コンポーネント、E2E、視覚、a11y、セキュリティ | `test-plan-*.md`             |
| `fec-build-fixer`           | lint / type-check / test / build / CI の段階的修復                                   | `validation-fix-*.md`        |
| `fec-refactor-cleaner`      | 未使用コード、export、スタイル、ルート、依存関係の分類と安全な削除                   | `refactor-clean-*.md`        |
| `fec-e2e-runner`            | E2E 作成と実行（Playwright/Cypress）、flaky 隔離、トレース                           | `e2e-summary-*.md`           |
| `fec-doc-updater`           | README、ランタイムドキュメント、構造、機能表、メタデータの同期                       | —                            |
| `fec-ui-checker`            | 視覚的問題のデバッグとデザイン忠実度評価                                             | `ui-fidelity-review-*.md`    |
| `fec-figma-implementer`     | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 からの正確な UI 実装                           | `design-implementation-*.md` |
| `fec-design-token-mapper`   | デザイン変数をプロジェクトの Design Token にマッピング                               | `token-mapping-*.md`         |

### フック（イベント駆動）

フックは AI アシスタントのイベントで**自動実行**されます。呼び出し不要です。

| イベント                  | 動作                                                                |
| ------------------------- | ------------------------------------------------------------------- |
| `SessionStart`            | プロジェクトのフレームワークとパッケージマネージャーを検出          |
| `PreToolUse(Bash)`        | 危険なコマンド（`rm -rf`、force push など）をブロック               |
| `PostToolUse(Write/Edit)` | 変更されたファイルに自動で Prettier を実行                          |
| `Stop`                    | セッション終了時に lint、type-check、test、build を実行             |
| `Notification`            | クロスプラットフォームのデスクトップ通知（macOS / Linux / Windows） |

### MCP 統合

AI アシスタントをデザインツールに直接接続し、損失のないデザイン→コードワークフローを実現します。

| サービス          | 機能                                                                |
| ----------------- | ------------------------------------------------------------------- |
| **Figma**         | デザインコンテキストと変数定義の読み取り                            |
| **Figma Desktop** | Figma デスクトップクライアント統合                                  |
| **Sketch**        | デザイン選択スクリーンショットの読み取り                            |
| **MasterGo**      | DSL 構造、コンポーネント階層、スタイルの読み取り                    |
| **Pixso**         | ローカル MCP：フレームデータ、コードスニペット、画像リソース        |
| **墨刀**          | プロトタイプデータ、デザイン説明、HTML インポート                   |
| **摹客**          | スクリーンショット／注釈／CSS エクスポート ワークフロー（MCP なし） |

### プロジェクトテンプレート（`/fec-init`）

`/fec-init` を実行すると、すぐに使えるルールライブラリとプロジェクト設定を `.claude/` にスキャフォールドします：

<details>
<summary>全 19 テンプレートファイルを表示</summary>

| ファイル                                 | 用途                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `CLAUDE.md`                              | プロジェクト説明、コマンド、作業原則、セキュリティ                    |
| `settings.json`                          | 権限ホワイトリスト／ブラックリスト、環境変数                          |
| `rules/fec-vue.md`                       | Vue 3 コンポーネント基準とアンチパターン                              |
| `rules/fec-react.md`                     | React コンポーネント基準とアンチパターン                              |
| `rules/fec-design-system.md`             | デザインシステム、トークン、アクセシビリティ                          |
| `rules/fec-testing.md`                   | テストと検証のルール                                                  |
| `rules/fec-git-conventions.md`           | Conventional Commits                                                  |
| `rules/fec-i18n.md`                      | 国際化コピー基準                                                      |
| `rules/fec-performance.md`               | フロントエンドパフォーマンス最適化ルール                              |
| `rules/fec-source-driven-development.md` | Source-driven decisions, official docs, version-sensitive assumptions |
| `rules/fec-api-layer.md`                 | API 層の型付けとエラーハンドリング                                    |
| `rules/fec-state-management.md`          | 状態分類、戦略、アンチパターン                                        |
| `rules/fec-error-handling.md`            | エラー階層化、Error Boundary、フォールバック UI、報告                 |
| `rules/fec-naming-conventions.md`        | ファイル、コンポーネント、変数、ルート、API、CSS の統一命名           |
| `rules/fec-code-comments.md`             | フロントエンドコメントの書き方とタイミング                            |
| `rules/fec-ci-cd.md`                     | CI/CD パイプライン段階、GitHub Actions / GitLab CI、シークレット      |
| `rules/fec-refactoring.md`               | リファクタリング制約と機能同等性の要件                                |
| `rules/fec-agent-workflow.md`            | エージェント間の協業境界と委任                                        |
| `rules/fec-working-modes.md`             | 調査、計画、開発、レビュー、完了モードのガイダンス                    |

</details>

---

## 設定

### 前提条件

- **Node.js 22+**
- **npm、pnpm、または yarn**
- **Git Bash**（Windows のみ — フックスクリプト実行に必要）

### MCP デザイントールトークン

チームで使用するデザインツールに応じて環境変数を設定します：

| 環境変数         | ツール                | 取得方法                                              |
| ---------------- | --------------------- | ----------------------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma アカウント設定 → Personal Access Tokens         |
| `SKETCH_API_KEY` | Sketch                | Sketch 開発者設定                                     |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo アカウント設定 → セキュリティ → トークン生成 |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 機能ページ → アクセストークン                 |

> **Pixso** はローカル MCP サーバーを使用 — Pixso クライアントで MCP を有効化すればよく、環境変数は不要です。
> **摹客** は MCP 統合なし — スクリーンショットと CSS エクスポートで対応します。

シェル設定に追加して永続化します：

```bash
# macOS / Linux — ~/.bashrc または ~/.zshrc に追加
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

```powershell
# Windows — システム環境変数として設定、または PowerShell で一時的に設定：
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

---

## レポート

すべてのレビュー、分析、評価は `reports/` にタイムスタンプ付き Markdown レポートとして書き出されます。これらは監査証跡および PR の成果物として機能します。

<details>
<summary>全 15 レポートタイプを表示</summary>

| レポートタイプ           | ファイル名パターン                           | 生成元                                                              |
| ------------------------ | -------------------------------------------- | ------------------------------------------------------------------- |
| コードレビュー           | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`、`fec-code-review`、`fec-code-reviewer`               |
| TypeScript / JS レビュー | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `fec-typescript-reviewer`                                           |
| セキュリティレビュー     | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`、`fec-security-reviewer`                      |
| アクセシビリティ         | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                           |
| パフォーマンス           | `performance-review-YYYY-MM-DD-HHmmss.md`    | `fec-performance-optimizer`                                         |
| アーキテクチャ           | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `fec-architect`                                                     |
| デザイン忠実度           | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `fec-ui-checker`                                                    |
| デザイン実装             | `design-implementation-YYYY-MM-DD-HHmmss.md` | `fec-figma-implementer`                                             |
| トークンマッピング       | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `fec-design-token-mapper`                                           |
| デザイン計画             | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                         |
| テスト計画               | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-plan`、`fec-testing-strategy`、`fec-test-planner`             |
| 検証修復                 | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                |
| リファクタリングクリーン | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`、`fec-refactor-clean`、`fec-refactor-cleaner` |
| E2E 実行サマリー         | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-e2e-runner`（任意）                                            |
| 移行計画                 | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                    |

</details>

> **ヒント：** `.gitignore` に `reports/` を追加して自動生成レポートをバージョン管理から除外するか、チームのレビュー履歴としてコミットを保持してください。

---

## アップデート

```bash
# CLI 管理のインストールをアップデート（元のインストールと同じスコープ）
npx frontend-craft@latest update <runtime> --local
npx frontend-craft@latest update <runtime> --global
# `upgrade` は `update` のエイリアス
```

CLI はランタイムディレクトリに `frontend-craft.manifest.json` を書き込み、**ローカルで修正したファイルをスキップ**します——カスタマイズはアップデート後も保持されます。

**Claude Code Marketplace** または **submodule** インストールのアップデート方法は [docs/runtimes/claude.md](../runtimes/claude.md) · [简体中文](../runtimes/claude.zh-CN.md) を参照してください。

---

## レガシー Skills CLI

チームがすでにスタンドアロンの [Skills CLI](https://skills.sh/docs/cli) を使用している場合、[`skills/`](../../skills/) 配下のワークフロースキルパッケージのみをインストールできます：

```bash
npx skills add bovinphang/frontend-craft   # プロンプトに従う、または -g でグローバル
npx skills update                          # 最新版にアップデート
npx skills check                           # 利用可能なアップデートをプレビュー
```

| CLI                  | インストール内容                                                              |
| -------------------- | ----------------------------------------------------------------------------- |
| `npx frontend-craft` | スキル + ランタイム固有のエージェント、コマンド、フック、ルール、テンプレート |
| `npx skills`         | スキルのみ（既存の Skills CLI ワークフロー向け）                              |

テレメトリを無効化：`DISABLE_TELEMETRY=1`。詳細は [skills.sh CLI ドキュメント](https://skills.sh/docs/cli) を参照。

---

## コミュニティ

- [貢献ガイド](../../CONTRIBUTING.md) — 開発環境セットアップ、PR チェックリスト、ローカライゼーション方針（[简体中文](../../CONTRIBUTING.zh-CN.md)）
- [セキュリティポリシー](../../SECURITY.md) — プライベート脆弱性報告（[简体中文](../../SECURITY.zh-CN.md)）
- [行動規範](../../CODE_OF_CONDUCT.md) — コミュニティ基準（[简体中文](../../CODE_OF_CONDUCT.zh-CN.md)）
- [変更履歴](../../CHANGELOG.md) — リリースノート（[简体中文](../../CHANGELOG.zh-CN.md)）
- [プロジェクト構造](../project-structure.md) — 完全なディレクトリレイアウトとファイルの責務

---

## ライセンス

[MIT](../../LICENSE) — 自由に使用し、必要に応じて修正し、可能であれば貢献してください。

---

<div align="center">

**frontend-craft がチームの助けになったら、[Star をお願いします](https://github.com/bovinphang/frontend-craft)。**

</div>
