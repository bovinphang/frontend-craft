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

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](../docs/ko-KR/README.md) | [日本語](README.md) | [한국어](../docs/ko-KR/README.md)

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

初期化後、プロジェクトに合わせて `.claude/CLAUDE.md`、`rules/`、`settings.json` を編集してください。

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

✨ **完了！** 5 つのエージェント、8 つのスキル、3 つのコマンドが利用可能です。

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
|   |-- react-project-standard/  # React + TypeScript プロジェクト規約
|   |-- vue3-project-standard/   # Vue 3 + TypeScript プロジェクト規約
|   |-- implement-from-design/   # デザインから UI を実装
|   |-- test-and-fix/            # lint、type-check、test、build と修正
|   |-- legacy-web-standard/     # JS + jQuery + HTML レガシープロジェクト規約
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
```

---

## 📥 インストール

> **要件：** Claude Code v1.0.33+、Node.js >= 18、npm/pnpm/yarn。

### オプション 1：プラグインとしてインストール（推奨）

```bash
/plugin marketplace add bovinphang/frontend-craft
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

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### オプション 4：Git Submodule（プロジェクト共有）

```bash
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft
# チーム：git submodule update --init --recursive
# 読み込み：claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 機能概要

### Commands（スラッシュコマンド）

| コマンド | 用途 | レポート出力 |
|----------|------|--------------|
| `/frontend-craft:init` | プロジェクトテンプレートを `.claude/` に初期化 | — |
| `/frontend-craft:review` | 指定または最近変更したファイルのコードレビュー | `code-review-*.md` |
| `/frontend-craft:scaffold` | page / feature / component 構造を作成 | — |

### Skills（自動有効化）

| Skill | 用途 | レポート出力 |
|-------|------|--------------|
| `frontend-code-review` | アーキテクチャ、型、レンダリング、スタイル、a11y | `code-review-*.md` |
| `security-review` | XSS、CSRF、機密データ、入力検証 | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA アクセシビリティ | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript プロジェクト規約 | — |
| `vue3-project-standard` | Vue 3 + TypeScript プロジェクト規約 | — |
| `implement-from-design` | デザインから UI を実装 | `design-plan-*.md` |
| `test-and-fix` | lint、type-check、test、build と修正 | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML レガシー規約 | — |

### Agents（サブエージェント）

| Agent | 用途 | レポート出力 |
|-------|------|--------------|
| `frontend-architect` | ページ分割、コンポーネントアーキテクチャ、状態フロー、リファクタリング | `architecture-proposal-*.md` |
| `performance-optimizer` | パフォーマンス分析、最適化提案 | `performance-review-*.md` |
| `ui-checker` | UI ビジュアル問題、デザイン忠実度評価 | `ui-fidelity-review-*.md` |
| `figma-implementer` | デザインからの正確な UI 実装 | `design-implementation-*.md` |
| `design-token-mapper` | デザイン変数を Design Token にマッピング | `token-mapping-*.md` |

### Hooks（自動実行）

| イベント | 動作 |
|----------|------|
| `SessionStart` | プロジェクトフレームワークとパッケージマネージャーを検出 |
| `PreToolUse(Bash)` | 危険なコマンドをブロック（rm -rf、force push など） |
| `PostToolUse(Write/Edit)` | 変更ファイルに自動 Prettier |
| `Stop` | セッション終了時に lint、type-check、test、build を実行 |
| `Notification` | クロスプラットフォームデスクトップ通知 |

### MCP 連携

| サービス | 用途 |
|----------|------|
| Figma / Figma Desktop | デザインコンテキスト、変数定義 |
| Sketch | デザイン選択スクリーンショット |
| MasterGo | DSL 構造データ |
| Pixso | ローカル MCP でフレームデータ、コードスニペット |
| 墨刀 (Modao) | プロトタイプデータ、デザイン説明 |
| 摹客 (Mockplus) | MCP なし、ユーザースクリーンショット／注釈で対応 |

---

## 📄 レポート出力

すべてのレビュー・分析・評価はプロジェクトの `reports/` ディレクトリに Markdown ファイルとして自動保存されます。

| レポート種別 | ファイル名パターン | ソース |
|--------------|-------------------|--------|
| コードレビュー | `code-review-*.md` | `/review`、`frontend-code-review` |
| セキュリティレビュー | `security-review-*.md` | `security-review` |
| アクセシビリティ | `accessibility-review-*.md` | `accessibility-check` |
| パフォーマンス | `performance-review-*.md` | `performance-optimizer` |
| アーキテクチャ | `architecture-proposal-*.md` | `frontend-architect` |
| デザイン忠実度 | `ui-fidelity-review-*.md` | `ui-checker` |
| デザイン実装 | `design-implementation-*.md` | `figma-implementer` |
| Token マッピング | `token-mapping-*.md` | `design-token-mapper` |
| デザイン計画 | `design-plan-*.md` | `implement-from-design` |
| テスト修正 | `test-fix-*.md` | `test-and-fix` |

> **ヒント：** `.gitignore` に `reports/` を追加するか、履歴のために必要に応じてコミットしてください。

---

## ⚙️ 設定

### MCP 環境変数

| 変数 | ツール | 取得方法 |
|------|--------|----------|
| `FIGMA_API_KEY` | Figma | Figma アカウント > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch 開発者設定 |
| `MG_MCP_TOKEN` | MasterGo | MasterGo アカウント > セキュリティ設定 |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI ページ |

Pixso はローカル MCP（クライアントで有効化）；摹客はユーザースクリーンショット／注釈で対応。

---

## 📥 更新

```bash
# Marketplace インストール
/plugin marketplace update bovinphang-frontend-craft

# 自動更新を有効化：/plugin → Marketplaces → 選択 → Enable auto-update

# Submodule インストール
git submodule update --remote .claude/plugins/frontend-craft
```

---

## 📄 ライセンス

MIT — 自由に使用、必要に応じて変更、可能であれば貢献を。

---

**このリポジトリが役に立ったら、Star をお願いします。素晴らしいフロントエンドを。**
