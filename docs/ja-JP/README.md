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

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](../zh-TW/README.md) | [日本語](README.md) | [한국어](../ko-KR/README.md)

</div>

---

**エンタープライズフロントエンドチーム向け Claude Code 共有プラグイン。**

コードレビュー、セキュリティレビュー、デザイン実装（Figma/Sketch/MasterGo/Pixso/墨刀/摹客）、アクセシビリティチェック、自動品質保証、プロジェクトテンプレートを統合。すべてのレビュー・分析・評価レポートはプロジェクトの `reports/` ディレクトリに Markdown ファイルとして自動保存され、アーカイブ、トレーサビリティ、チーム共有に活用できます。

---

## 🚀 クイックスタート

2 分で始められます：

### ステップ 1：プラグインをインストール

```bash
# マーケットプレイスを追加
/plugin marketplace add bovinphang/frontend-craft

# プラグインをインストール
/plugin install frontend-craft@bovinphang-frontend-craft

# 有効化
/reload-plugins
```

### ステップ 2：プロジェクト設定を初期化（推奨）

```bash
# プロジェクトテンプレートを .claude/ ディレクトリにコピー
/frontend-craft:init
```

初期化後、プロジェクトに合わせて以下を編集してください：

1. `.claude/CLAUDE.md` — プロジェクト情報、パッケージマネージャー、常用コマンド
2. `.claude/rules/` — 不要なルールを削除（例：React のみの場合は `vue.md`、i18n 不要なら `i18n.md`）
3. `.claude/settings.json` — 権限ホワイトリストの調整

> **なぜ必要？** プラグインは再利用可能な Skills、Agents、Hooks を提供します。CLAUDE.md と rules はプロジェクト級の設定で、Claude Code が認識するにはプロジェクトルートの `.claude/` 配下にある必要があります。`/init` コマンドで素早く設定できます。

### ステップ 3：使い始める

```bash
# コードレビュー（reports/code-review-*.md に出力）
/frontend-craft:review

# 規約に従ってページ/機能/コンポーネントを作成
/frontend-craft:scaffold page UserDetail
/frontend-craft:scaffold component DataTable

# 利用可能なコマンドを表示
/plugin list frontend-craft@bovinphang-frontend-craft
```

✨ **完了！** 5 つのエージェント、9 つのスキル、3 つのコマンドが利用可能です。

---

## 🌐 クロスプラットフォーム対応

本プラグインは **Windows、macOS、Linux** を完全サポート。すべてのフックとスクリプトは Node.js で実装され、クロスプラットフォーム互換性を確保しています。

---

## 📦 内容

本リポジトリは **Claude Code プラグイン**で、直接インストールするか `--plugin-dir` でローカル読み込みできます。

```
frontend-craft/
|-- .claude-plugin/   # プラグインとマーケットプレイスマニフェスト
|   |-- plugin.json         # プラグインメタデータ
|   |-- marketplace.json    # /plugin marketplace add 用マーケットプレイス
|
|-- agents/           # 委任用の専門サブエージェント
|   |-- frontend-architect.md    # ページ分割、コンポーネントアーキテクチャ、状態フロー
|   |-- performance-optimizer.md # パフォーマンスボトルネック分析と最適化
|   |-- ui-checker.md            # UI ビジュアル問題、デザイン忠実度評価
|   |-- figma-implementer.md     # デザインからの正確な UI 実装
|   |-- design-token-mapper.md   # デザイン変数を Design Token にマッピング
|
|-- skills/           # ワークフロー定義とドメイン知識
|   |-- frontend-code-review/    # アーキテクチャ、型、レンダリング、スタイル、a11y
|   |-- security-review/         # XSS、CSRF、機密データ、入力検証
|   |-- accessibility-check/     # WCAG 2.1 AA アクセシビリティ
|   |-- react-project-standard/ # React + TypeScript プロジェクト規約
|   |-- vue3-project-standard/   # Vue 3 + TypeScript プロジェクト規約
|   |-- implement-from-design/   # デザインから UI を実装
|   |-- test-and-fix/           # lint、type-check、test、build と修正
|   |-- legacy-web-standard/     # JS + jQuery + HTML レガシープロジェクト規約
|   └-- legacy-to-modern-migration/  # jQuery/MPA から React/Vue への移行戦略とワークフロー
|
|-- commands/         # スラッシュコマンド
|   |-- init.md        # /init - プロジェクトテンプレート初期化
|   |-- review.md      # /review - コードレビュー
|   |-- scaffold.md    # /scaffold - page/feature/component 作成
|
|-- hooks/            # イベント駆動の自動化
|   |-- hooks.json     # PreToolUse、PostToolUse、Stop、Notification など
|
|-- scripts/          # クロスプラットフォーム Node.js スクリプト
|   |-- security-check.mjs      # 危険なコマンドをブロック
|   |-- format-changed-file.mjs # 自動 Prettier フォーマット
|   |-- run-tests.mjs           # セッション終了時にチェック実行
|   |-- session-start.mjs       # セッション開始時にフレームワーク検出
|   |-- notify.mjs              # クロスプラットフォームデスクトップ通知
|
|-- templates/        # プロジェクト設定テンプレート（/init でコピー）
|   |-- CLAUDE.md
|   |-- settings.json
|   |-- rules/         # vue、react、design-system、testing など
|
|-- .mcp.json         # MCP サーバー設定（Figma、Sketch、MasterGo、Pixso、墨刀）
└-- README.md
```

---

## 📥 インストール

> **要件：** Claude Code v1.0.33+、Node.js >= 18、npm/pnpm/yarn。

### オプション 1：プラグインとしてインストール（推奨）

```bash
# マーケットプレイスを追加
/plugin marketplace add bovinphang/frontend-craft

# プラグインをインストール
/plugin install frontend-craft@bovinphang-frontend-craft
```

または `~/.claude/settings.json` またはプロジェクトの `.claude/settings.json` に追加：

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

### オプション 2：チームプロジェクトレベル自動インストール

プロジェクトルートの `.claude/settings.json` に上記 `extraKnownMarketplaces` を追加。チームメンバーがプロジェクトディレクトリを trust するとインストールが促されます。

### オプション 3：ローカル開発／テスト

リポジトリをクローンし `--plugin-dir` で読み込み（インストール不要、開発・デバッグ向け）：

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### オプション 4：Git Submodule（プロジェクト共有）

```bash
# プロジェクトルートに submodule として追加
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft

git add .gitmodules .claude/plugins/frontend-craft
git commit -m "feat: add frontend-craft as shared Claude Code plugin"
```

チームメンバーはクローン後に実行：

```bash
git submodule update --init --recursive
```

その後 `--plugin-dir` で読み込み：

```bash
claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 機能概要

### Commands（スラッシュコマンド）

| コマンド | 用途 | レポート出力 |
|----------|------|--------------|
| `/frontend-craft:init` | プロジェクトテンプレートを `.claude/` に初期化 | — |
| `/frontend-craft:review` | 指定または最近変更したファイルのコードレビュー、段階別レポート出力 | `code-review-*.md` |
| `/frontend-craft:scaffold` | 規約に従い page / feature / component の標準構造とボイラープレートを作成 | — |

### Skills（自動有効化）

| Skill | 用途 | レポート出力 |
|-------|------|--------------|
| `frontend-code-review` | アーキテクチャ、型、レンダリング、スタイル、a11y の観点でコードレビュー | `code-review-*.md` |
| `security-review` | XSS、CSRF、機密データ漏洩、入力検証などのセキュリティレビュー | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA アクセシビリティチェック | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript プロジェクト規約（構造、コンポーネント、ルーティング、状態、API 層） | — |
| `vue3-project-standard` | Vue 3 + TypeScript プロジェクト規約（構造、コンポーネント、ルーティング、Pinia、API 層） | — |
| `implement-from-design` | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 のデザインから UI を実装 | `design-plan-*.md` |
| `test-and-fix` | lint、type-check、test、build を実行し失敗を修正 | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML レガシープロジェクトの開発・保守規約 | — |
| `legacy-to-modern-migration` | jQuery/MPA から React/Vue 3 + TS への移行戦略、概念マッピング、段階的ワークフロー | `migration-plan-*.md` |

### Agents（サブエージェント）

| Agent | 用途 | レポート出力 |
|-------|------|--------------|
| `frontend-architect` | ページ分割、コンポーネントアーキテクチャ、状態フロー、ディレクトリ計画、大規模リファクタリング | `architecture-proposal-*.md` |
| `performance-optimizer` | パフォーマンスボトルネック分析（バンドルサイズ、レンダリング、ネットワーク）、定量化された最適化案 | `performance-review-*.md` |
| `ui-checker` | UI ビジュアル問題のデバッグ、デザイン忠実度評価 | `ui-fidelity-review-*.md` |
| `figma-implementer` | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 のデザインから正確に UI を実装 | `design-implementation-*.md` |
| `design-token-mapper` | デザイン変数をプロジェクトの Design Token にマッピング | `token-mapping-*.md` |

### Hooks（自動実行）

| イベント | 動作 |
|----------|------|
| `SessionStart` | プロジェクトフレームワークとパッケージマネージャーを検出 |
| `PreToolUse(Bash)` | 危険なコマンドをブロック（rm -rf、force push など） |
| `PostToolUse(Write/Edit)` | 変更ファイルに自動 Prettier |
| `Stop` | セッション終了時に lint、type-check、test、build を実行 |
| `Notification` | クロスプラットフォームデスクトップ通知（macOS / Linux / Windows） |

### MCP 連携

| サービス | 用途 |
|----------|------|
| Figma | デザインコンテキスト、変数定義の読み取り |
| Figma Desktop | Figma デスクトップ連携 |
| Sketch | デザイン選択スクリーンショットの読み取り |
| MasterGo | DSL 構造データ、コンポーネント階層とスタイルの読み取り |
| Pixso | ローカル MCP でフレームデータ、コードスニペット、画像リソース取得 |
| 墨刀 | プロトタイプデータ取得、デザイン説明生成、HTML インポート |
| 摹客 | MCP なし、ユーザーのスクリーンショット／注釈／エクスポート CSS で対応 |

### プロジェクトテンプレート（`/init` で初期化）

| ファイル | 用途 |
|----------|------|
| `CLAUDE.md` | プロジェクト説明、常用コマンド、作業原則、セキュリティ要件 |
| `settings.json` | 権限ホワイトリスト／ブラックリスト、環境変数 |
| `rules/vue.md` | Vue 3 コンポーネント規約とアンチパターン |
| `rules/react.md` | React コンポーネント規約とアンチパターン |
| `rules/design-system.md` | デザインシステム、Token、アクセシビリティルール |
| `rules/testing.md` | テストと検証ルール |
| `rules/git-conventions.md` | Conventional Commits 規約 |
| `rules/i18n.md` | 国際化コピー規約 |
| `rules/performance.md` | フロントエンドパフォーマンス最適化ルール |
| `rules/api-layer.md` | API 層の型付け、エラーハンドリング規約 |
| `rules/state-management.md` | 状態分類、管理戦略、アンチパターン |
| `rules/error-handling.md` | エラー階層、Error Boundary、フォールバック UI、レポート規約 |
| `rules/naming-conventions.md` | ファイル、コンポーネント、変数、ルート、API、CSS の統一命名規約 |

---

## ⚙️ 設定

### 前提条件

- Node.js >= 18
- npm、pnpm、yarn のいずれか
- Git Bash（Windows ではフックスクリプト実行に必要）

### MCP サーバー

デザイン関連機能を使う前に、使用するデザインツールに応じて環境変数を設定してください：

| 環境変数 | ツール | 取得方法 |
|----------|--------|----------|
| `FIGMA_API_KEY` | Figma / Figma Desktop | Figma アカウント設定 > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch 開発者設定 |
| `MG_MCP_TOKEN` | MasterGo | MasterGo アカウント設定 > セキュリティ > Token 生成 |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI 機能ページでアクセストークン取得 |

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

| レポート種別 | ファイル名パターン | ソース |
|--------------|-------------------|--------|
| コードレビュー | `code-review-YYYY-MM-DD-HHmmss.md` | `/review` コマンド、`frontend-code-review` スキル |
| セキュリティレビュー | `security-review-YYYY-MM-DD-HHmmss.md` | `security-review` スキル |
| アクセシビリティ | `accessibility-review-YYYY-MM-DD-HHmmss.md` | `accessibility-check` スキル |
| パフォーマンス | `performance-review-YYYY-MM-DD-HHmmss.md` | `performance-optimizer` エージェント |
| アーキテクチャ | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` エージェント |
| デザイン忠実度 | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md` | `ui-checker` エージェント |
| デザイン実装 | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` エージェント |
| Token マッピング | `token-mapping-YYYY-MM-DD-HHmmss.md` | `design-token-mapper` エージェント |
| デザイン計画 | `design-plan-YYYY-MM-DD-HHmmss.md` | `implement-from-design` スキル |
| テスト修正 | `test-fix-YYYY-MM-DD-HHmmss.md` | `test-and-fix` スキル |
| 移行計画 | `migration-plan-YYYY-MM-DD-HHmmss.md` | `legacy-to-modern-migration` スキル |

> **ヒント：** `.gitignore` に `reports/` を追加して自動生成レポートのコミットを避けるか、チームの履歴のためにコミットを残してください。

---

## 📥 更新

Marketplace でインストールした場合、Claude Code で実行：

```
/plugin marketplace update bovinphang-frontend-craft
```

または自動更新を有効にすると、Claude Code 起動時に最新版を自動取得：

1. Claude Code で `/plugin` を実行してプラグインマネージャーを開く
2. **Marketplaces** タブに切り替え
3. `bovinphang-frontend-craft` を選択
4. **Enable auto-update** を選択

> サードパーティ Marketplace はデフォルトで自動更新が無効。有効にすると、Claude Code 起動時に Marketplace データを更新し、インストール済みプラグインを更新します。

Git submodule でインストールした場合：

```bash
git submodule update --remote .claude/plugins/frontend-craft
```

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
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 ライセンス

MIT — 自由に使用、必要に応じて変更、可能であれば貢献を。

---

**このリポジトリが役に立ったら、Star をお願いします。素晴らしいフロントエンドを。**
