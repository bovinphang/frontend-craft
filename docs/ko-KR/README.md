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

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](../zh-TW/README.md) | [日本語](../ja-JP/README.md) | [한국어](README.md)

</div>

---

**Claude Code, Codex, Cursor, OpenCode, Gemini CLI, Windsurf, Copilot, OpenClaw 등을 위한 범용 프론트엔드 플러그인.**

`frontend-craft`는 프론트엔드 리뷰 agents, 워크플로 skills, 슬래시 명령, hooks, MCP 템플릿, 프로젝트 규칙을 하나의 저장소에서 관리합니다. CLI로 동일한 프론트엔드 표준을 14개 AI 코딩 runtime에 설치할 수 있습니다. **Claude Code Marketplace만** 사용하는 네이티브 플러그인 설치 절차는 [docs/runtimes/claude.md](../runtimes/claude.md) ([简体中文](../runtimes/claude.zh-CN.md))를 참고하세요.

---

## Community and Governance

- [Contributing Guide](../../CONTRIBUTING.md) - development setup, PR checklist, and localization policy.
- [Security Policy](../../SECURITY.md) - private vulnerability reporting and supported scope.
- [Code of Conduct](../../CODE_OF_CONDUCT.md) - community standards for participation.

---

## 범용 설치(권장)

**Node.js 22+**가 필요합니다. CLI는 각 도구가 기대하는 레이아웃에 맞춰 파일을 설치합니다(경로 규칙: [`src/install/runtime-homes.mjs`](../../src/install/runtime-homes.mjs)).

**터미널 대화형 설치(권장):** `npx frontend-craft@latest` 또는 `npx frontend-craft@latest install`을 runtime 없이 실행하면 여러 runtime 선택 후 Global / Local을 고를 수 있습니다. `install <runtime>`만 지정하고 `--global` / `--local`을 생략하면 **TTY**에서는 설치 위치를 묻습니다.

**스크립트 / CI:** 항상 **`--global` / `-g`** 또는 **`--local` / `-l`**을 명시하세요. stdin이 TTY가 아니고 둘 다 없으면 **`claude` 전역(global)** 설치로 기본 동작하며 짧은 안내를 출력합니다.

```bash
npx frontend-craft@latest list
npx frontend-craft@latest install --local claude
npx frontend-craft@latest install --global codex
npx frontend-craft@latest install cursor --local
npx frontend-craft@latest install --all --dry-run --global
```

지원 runtime: `claude`, `codex`, `cursor`, `windsurf`, `opencode`, `kilo`, `gemini`, `copilot`, `antigravity`, `augment`, `trae`, `codebuddy`, `cline`, `openclaw`.

runtime별 설명은 [`docs/runtimes/`](../runtimes/)를 참고하세요.

---

## 빠른 시작

1. `npx frontend-craft@latest`(마법사) 또는 `npx frontend-craft@latest install --local <runtime>` / `install --global <runtime>`(스크립트용)을 실행합니다.
2. [`docs/runtimes/`](../runtimes/)에서 사용 중인 도구의 메모를 엽니다(경로 및 주의사항).
3. **Claude Code Marketplace만:** 마켓플레이스 설치, `/fec-init`, 업데이트 전체 절차는 [docs/runtimes/claude.md](../runtimes/claude.md) · [简体中文](../runtimes/claude.zh-CN.md).

---

## 🌐 크로스 플랫폼 지원

이 플러그인은 **Windows, macOS, Linux**를 완전 지원합니다. 모든 훅과 스크립트는 Node.js로 구현되어 크로스 플랫폼 호환성을 보장합니다.

---

## 다중 에이전트 스킬 설치(Skills CLI)

**Claude Code**, **OpenAI Codex**, **Cursor**, **OpenCode**, **Gemini CLI**, **OpenClaw**, **Continue**, **CodeBuddy**, **Trae**, **Kimi Code CLI** 등 여러 AI 코딩 에이전트를 함께 쓰는 팀이라면 [Skills CLI](https://skills.sh/docs/cli)(`npx skills`)로 이 저장소의 **워크플로 스킬**을 각 도구가 사용하는 스킬 디렉터리에 설치할 수 있습니다. CLI는 수십 종 에이전트를 지원하며, 전체 목록은 대화형 프롬프트나 상위 문서를 참고하세요.

### Skills CLI와 frontend-craft CLI의 차이

- **Skills CLI** — [`skills/`](../../skills/) 아래 스킬 패키지를 선택한 에이전트 경로에 맞게 설치합니다. 여러 도구에서 동일한 리뷰·프론트엔드 규칙을 맞출 때 적합합니다.
- **`npx frontend-craft`** — 이 저장소가 지원하는 skills, runtime별 agents, commands, hooks, rules, templates를 설치합니다. 위 **범용 설치** 절의 대화형 마법사 또는 비대화형으로 `install`에 `--local` / `--global`을 붙여 사용하세요.

### 요구 사항

`frontend-craft`는 Node.js 22+가 필요합니다. `npx skills`를 사용할 때는 Skills CLI 자체 요구 사항을 따르세요.

### 스킬 설치

```bash
npx skills add bovinphang/frontend-craft
```

프롬프트에 따라 프로젝트/전역(`-g`), 심볼릭 링크/복사(`--copy`), 대상 에이전트를 선택합니다. 설치 없이 저장소에 있는 스킬 목록만 보려면 `npx skills add bovinphang/frontend-craft -l`을 실행하세요. 특정 스킬·에이전트만 지정하려면 `--skill` / `--agent`를 사용합니다(`npx skills --help` 참고).

### 스킬 업데이트

스킬을 설치한 프로젝트 디렉터리에서 실행합니다(전역 설치였다면 해당 범위에서).

```bash
npx skills update
```

설치된 모든 스킬을 최신 버전으로 갱신합니다. 먼저 `npx skills check`로 변경 가능 여부를 확인할 수 있습니다.

**원격 분석(telemetry):** CLI는 기본적으로 익명 원격 분석을 수집할 수 있습니다. 끄려면 환경 변수 `DISABLE_TELEMETRY=1`을 설정하세요. 자세한 내용은 [skills.sh CLI 문서](https://skills.sh/docs/cli)를 참고하세요.

---

## 📦 구성 내용

이 저장소는 **범용 프론트엔드 플러그인**이며 여러 AI 코딩 도구의 네이티브 레이아웃을 포함합니다. Claude Code 플러그인 메타데이터는 `.claude-plugin/`에 있습니다.

```text
frontend-craft/
|-- .claude-plugin/   # Claude Code 플러그인 및 마켓플레이스 매니페스트
|   |-- plugin.json         # 플러그인 메타데이터
|   |-- marketplace.json    # 마켓플레이스 디렉터리 메타데이터
|
|-- agents/           # 위임용 전문 서브 에이전트
|   |-- frontend-architect.md    # 페이지 분할, 컴포넌트 아키텍처, 상태 흐름
|   |-- frontend-code-reviewer.md # 프론트엔드 특화 코드 리뷰(품질, 보안, a11y)
|   |-- frontend-security-reviewer.md # 프론트엔드 공격면: XSS, 시크릿, CSP, 의존성
|   |-- frontend-e2e-runner.md     # E2E 작성·실행, flaky, 아티팩트와 CI
|   |-- typescript-reviewer.md    # TS/JS 타입·비동기·보안, 보고서 전용
|   |-- performance-optimizer.md # 성능 병목 분석 및 최적화
|   |-- ui-checker.md            # UI 시각적 이슈, 디자인 충실도 평가
|   |-- figma-implementer.md     # 디자인 기반 정확한 UI 구현
|   |-- design-token-mapper.md   # 디자인 변수를 Design Token에 매핑
|
|-- skills/           # 워크플로우 정의 및 도메인 지식
|   |-- frontend-code-review/    # 아키텍처, 타입, 렌더링, 스타일, a11y
|   |-- security-review/         # XSS, CSRF, 민감 데이터, 입력 검증
|   |-- accessibility-check/     # WCAG 2.1 AA 접근성
|   |-- react-project-standard/ # React + TypeScript 프로젝트 규약
|   |-- vue3-project-standard/   # Vue 3 + TypeScript 프로젝트 규약
|   |-- implement-from-design/   # 디자인에서 UI 구현
|   |-- test-and-fix/           # lint, type-check, test, build 및 수정
|   |-- legacy-web-standard/     # JS + jQuery + HTML 레거시 프로젝트 규약
|   |-- legacy-to-modern-migration/  # jQuery/MPA → React/Vue 마이그레이션 전략 및 워크플로우
|   |-- e2e-testing/                # Playwright/Cypress E2E 테스트 규약
|   |-- nextjs-project-standard/    # Next.js 14+ App Router, SSR/SSG 규약
|   |-- nuxt-project-standard/      # Nuxt 3 SSR/SSG, Composition API 규약
|   |-- monorepo-project-standard/  # pnpm workspace, Turborepo, Nx 규약
|
|-- commands/         # 슬래시 명령어
|   |-- fec-init.md     # /fec-init - 프로젝트 템플릿 초기화
|   |-- fec-review.md   # /fec-review - 코드 규약화 리뷰
|   |-- fec-scaffold.md # /fec-scaffold - page/feature/component 생성
|
|-- hooks/            # 이벤트 기반 자동화
|   |-- hooks.json     # PreToolUse, PostToolUse, Stop, Notification 등
|
|-- scripts/          # 크로스 플랫폼 Node.js 스크립트
|   |-- security-check.mjs      # 위험한 명령어 차단
|   |-- format-changed-file.mjs # 자동 Prettier 포맷팅
|   |-- run-tests.mjs           # 세션 종료 시 검사 실행
|   |-- session-start.mjs      # 세션 시작 시 프레임워크 감지
|   |-- notify.mjs              # 크로스 플랫폼 데스크톱 알림
|
|-- templates/        # runtime별 프로젝트 템플릿
|   |-- claude/        # CLAUDE.md 및 settings.json
|   |-- codex/         # AGENTS.md 및 config.toml
|   |-- openclaw/      # AGENTS.md 및 OPENCLAW-CONFIG.md
|   |-- shared/rules/  # vue, react, design-system, testing 등
|
|-- .mcp.json         # MCP 서버 설정 (Figma, Sketch, MasterGo, Pixso, 墨刀)
└-- README.md
```

---

## 📋 기능 개요

아래 표의 **슬래시 명령어**는 대조를 위해 Claude Code를 예로 듭니다. 다른 runtime은 설치된 commands와 템플릿으로 동등한 기능을 제공합니다([`docs/runtimes/`](../runtimes/)).

### Commands (슬래시 명령어)

| 명령어                     | 용도                                                                            | 보고서 출력        |
| -------------------------- | ------------------------------------------------------------------------------- | ------------------ |
| `/fec-init`     | 프로젝트 템플릿을 `.claude/`에 초기화                                           | —                  |
| `/fec-review`   | 지정 또는 최근 변경 파일의 코드 규약화 리뷰, 등급별 보고서 출력                 | `code-review-*.md` |
| `/fec-scaffold` | 프로젝트 규약에 따라 page / feature / component 표준 구조와 보일러플레이트 생성 | —                  |

### Skills (자동 활성화)

| Skill                        | 용도                                                                             | 보고서 출력                 |
| ---------------------------- | -------------------------------------------------------------------------------- | --------------------------- |
| `fec-frontend-code-review`       | 아키텍처, 타입, 렌더링, 스타일, 접근성 등 관점에서 코드 리뷰                     | `code-review-*.md`          |
| `fec-security-review`            | XSS, CSRF, 민감 데이터 유출, 입력 검증 등 보안 리뷰                              | `security-review-*.md`      |
| `fec-accessibility-check`        | WCAG 2.1 AA 접근성 검사                                                          | `accessibility-review-*.md` |
| `fec-react-project-standard`     | React + TypeScript 프로젝트 규약 (구조, 컴포넌트, 라우팅, 상태, API 계층)        | —                           |
| `fec-vue3-project-standard`      | Vue 3 + TypeScript 프로젝트 규약 (구조, 컴포넌트, 라우팅, Pinia, API 계층)       | —                           |
| `fec-implement-from-design`      | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 디자인에서 UI 구현                         | `design-plan-*.md`          |
| `fec-test-and-fix`               | lint, type-check, test, build 실행 및 실패 수정                                  | `test-fix-*.md`             |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 레거시 프로젝트 개발·유지보수 규약                            | —                           |
| `fec-legacy-to-modern-migration` | jQuery/MPA → React/Vue 3 + TS 마이그레이션 전략, 개념 매핑, 단계별 워크플로우    | `migration-plan-*.md`       |
| `fec-e2e-testing`                | Playwright/Cypress E2E 테스트 규약: 디렉터리 구조, Page Object, CI 통합          | —                           |
| `fec-nextjs-project-standard`    | Next.js 14+ App Router, SSR/SSG, 스트리밍, 메타데이터 규약                       | —                           |
| `fec-nuxt-project-standard`      | Nuxt 3 SSR/SSG, Composition API, 데이터 페칭, 라우팅, 미들웨어 규약              | —                           |
| `fec-monorepo-project-standard`  | pnpm workspace, Turborepo, Nx: 디렉터리 구조, 의존성 관리, 태스크 오케스트레이션 | —                           |

### Agents (서브 에이전트)

| Agent                        | 용도                                                                                 | 보고서 출력                  |
| ---------------------------- | ------------------------------------------------------------------------------------ | ---------------------------- |
| `frontend-architect`         | 페이지 분할, 컴포넌트 아키텍처, 상태 흐름 설계, 디렉터리 계획, 대규모 리팩토링       | `architecture-proposal-*.md` |
| `frontend-code-reviewer`     | 프론트엔드 코드 리뷰: React/Vue/Next/Nuxt, TS, 스타일, 클라이언트 보안               | `code-review-*.md`           |
| `frontend-security-reviewer` | 프론트엔드 보안: XSS, 클라이언트 시크릿, 위험한 DOM/API, CSP, 의존성 감사            | `security-review-*.md`       |
| `frontend-e2e-runner`        | E2E 작성·실행 (Playwright/Cypress), flaky 격리, Trace/스크린샷, CI; 선택 요약 리포트 | `e2e-summary-*.md` (선택)    |
| `typescript-reviewer`        | TS/JS 리뷰: typecheck/eslint, PR 병합 준비, 타입·비동기·보안; 코드 직접 수정 없음    | `typescript-review-*.md`     |
| `performance-optimizer`      | 성능 병목 분석 (번들 크기, 렌더링 성능, 네트워크 요청), 정량화된 최적화 방안 출력    | `performance-review-*.md`    |
| `ui-checker`                 | UI 시각적 이슈 디버깅, 디자인 충실도 평가                                            | `ui-fidelity-review-*.md`    |
| `figma-implementer`          | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 디자인에서 정확한 UI 구현                      | `design-implementation-*.md` |
| `design-token-mapper`        | 디자인 변수를 프로젝트 Design Token에 매핑                                           | `token-mapping-*.md`         |

### Hooks (자동 실행)

| 이벤트                    | 동작                                                  |
| ------------------------- | ----------------------------------------------------- |
| `SessionStart`            | 프로젝트 프레임워크 및 패키지 매니저 감지             |
| `PreToolUse(Bash)`        | 위험한 명령어 차단 (rm -rf, force push 등)            |
| `PostToolUse(Write/Edit)` | 변경 파일에 자동 Prettier                             |
| `Stop`                    | 세션 종료 시 lint, type-check, test, build 실행       |
| `Notification`            | 크로스 플랫폼 데스크톱 알림 (macOS / Linux / Windows) |

### MCP 연동

| 서비스        | 용도                                                      |
| ------------- | --------------------------------------------------------- |
| Figma         | 디자인 컨텍스트, 변수 정의 읽기                           |
| Figma Desktop | Figma 데스크톱 연동                                       |
| Sketch        | 디자인 선택 스크린샷 읽기                                 |
| MasterGo      | DSL 구조 데이터, 컴포넌트 계층 및 스타일 읽기             |
| Pixso         | 로컬 MCP로 프레임 데이터, 코드 스니펫, 이미지 리소스 획득 |
| 墨刀          | 프로토타입 데이터 획득, 디자인 설명 생성, HTML 가져오기   |
| 摹客          | MCP 없음, 사용자 스크린샷/주석/내보낸 CSS로 지원          |

### 프로젝트 템플릿 (`/fec-init`으로 초기화)

| 파일                          | 용도                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `CLAUDE.md`                   | 프로젝트 설명, 자주 쓰는 명령어, 작업 원칙, 보안 요구사항                            |
| `settings.json`               | 권한 화이트리스트/블랙리스트, 환경 변수                                              |
| `rules/vue.md`                | Vue 3 컴포넌트 규약 및 안티패턴                                                      |
| `rules/react.md`              | React 컴포넌트 규약 및 안티패턴                                                      |
| `rules/design-system.md`      | 디자인 시스템, Token, 접근성 규칙                                                    |
| `rules/testing.md`            | 테스트 및 검증 규칙                                                                  |
| `rules/git-conventions.md`    | Conventional Commits 커밋 규약                                                       |
| `rules/i18n.md`               | 국제화 카피 규약                                                                     |
| `rules/performance.md`        | 프론트엔드 성능 최적화 규칙                                                          |
| `rules/api-layer.md`          | API 계층 타입화, 오류 처리 규약                                                      |
| `rules/state-management.md`   | 상태 분류, 관리 전략, 안티패턴                                                       |
| `rules/error-handling.md`     | 오류 계층화, Error Boundary, 폴백 UI, 리포팅 규약                                    |
| `rules/naming-conventions.md` | 파일, 컴포넌트, 변수, 라우트, API, CSS 통일 명명 규약                                |
| `rules/ci-cd.md`              | CI/CD 파이프라인 단계, GitHub Actions / GitLab CI 예시, 시크릿 관리                  |
| `rules/refactoring.md`        | 리팩터링 제약: 이미지, 스타일, 인라인 SVG/스타일 금지, flex 레이아웃 우선, 기능 동등 |

---

## ⚙️ 설정

### 사전 요구사항

- Node.js 22+
- npm, pnpm, yarn 중 하나
- Git Bash (Windows에서 훅 스크립트 실행에 필요)

### MCP 서버

디자인 관련 기능 사용 전, 팀에서 사용하는 디자인 도구에 맞게 환경 변수를 설정하세요:

| 환경 변수        | 도구                  | 획득 방법                                   |
| ---------------- | --------------------- | ------------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma 계정 설정 > Personal Access Tokens    |
| `SKETCH_API_KEY` | Sketch                | Sketch 개발자 설정                          |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo 계정 설정 > 보안 설정 > Token 생성 |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 기능 페이지에서 액세스 토큰 획득    |

> Pixso는 로컬 MCP 사용. Pixso 클라이언트에서 MCP 활성화 필요. 추가 환경 변수 불필요.
> 摹客은 MCP 없음. 사용자 스크린샷/주석으로 지원.

**macOS / Linux:**

```bash
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

**Windows (PowerShell):**

```powershell
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

셸 설정 파일(`~/.bashrc`, `~/.zshrc`) 또는 Windows 시스템 환경 변수에 추가하는 것을 권장합니다.

---

## 📄 보고서 출력

모든 리뷰·분석·평가 결과는 프로젝트 루트 `reports/` 디렉터리에 Markdown 파일로 자동 저장됩니다.

| 보고서 유형       | 파일명 패턴                                  | 출처                                                                             |
| ----------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| 코드 리뷰         | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review` 명령어, `fec-frontend-code-review` 스킬, `frontend-code-reviewer` 에이전트 |
| TS/JS 리뷰        | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `typescript-reviewer` 에이전트                                                   |
| 보안 리뷰         | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review` 스킬, `frontend-security-reviewer` 에이전트                    |
| 접근성            | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check` 스킬                                                       |
| 성능              | `performance-review-YYYY-MM-DD-HHmmss.md`    | `performance-optimizer` 에이전트                                                 |
| 아키텍처          | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` 에이전트                                                    |
| 디자인 충실도     | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `ui-checker` 에이전트                                                            |
| 디자인 구현       | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` 에이전트                                                     |
| Token 매핑        | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `design-token-mapper` 에이전트                                                   |
| 디자인 계획       | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design` 스킬                                                     |
| 테스트 수정       | `test-fix-YYYY-MM-DD-HHmmss.md`              | `fec-test-and-fix` 스킬                                                              |
| E2E 실행 요약     | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `frontend-e2e-runner` 에이전트 (선택)                                            |
| 마이그레이션 계획 | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration` 스킬                                                |

> **팁:** `.gitignore`에 `reports/`를 추가해 자동 생성 보고서 커밋을 피하거나, 팀 기록을 위해 커밋을 유지하세요.

---

## 업데이트

- **CLI 설치:** 동일한 `--local` / `--global`과 runtime으로 `npx frontend-craft@latest install`을 다시 실행하고 [CHANGELOG.md](../../CHANGELOG.md)를 확인하세요.
- **Claude Code Marketplace 또는 submodule:** [docs/runtimes/claude.md](../runtimes/claude.md)의 **Updating** · [简体中文](../runtimes/claude.zh-CN.md).

---

## 🎯 핵심 개념

### 에이전트

서브 에이전트는 위임된 작업을 제한된 범위에서 처리합니다. 예:

```markdown
---
name: performance-optimizer
description: 프론트엔드 성능 병목을 분석하고 최적화 방안 제시
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
---

당신은 프론트엔드 성능 분석과 최적화에 집중하는 시니어 엔지니어입니다...
```

### 스킬

스킬은 명령어나 에이전트가 호출하는 워크플로우 정의로, 리뷰 관점, 출력 형식, 보고서 파일 규약을 포함합니다:

```markdown
# 프론트엔드 코드 리뷰

## 리뷰 관점

1. 아키텍처 - 컴포넌트 경계, 관심사 분리
2. 타입 안전성 - any 사용, props 타입
   ...

## 보고서 파일 출력

- 디렉터리: reports/
- 파일명: code-review-YYYY-MM-DD-HHmmss.md
```

### 훅

훅은 도구 이벤트 시 실행됩니다. 예 — 위험한 명령어 차단:

```json
{
  "event": "PreToolUse",
  "matcher": "tool == \"Bash\"",
  "command": "node \"${FRONTEND_CRAFT_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 라이선스

MIT — 자유롭게 사용, 필요에 따라 수정, 가능하면 기여해 주세요.

---

**이 저장소가 도움이 되었다면 Star를 눌러 주세요. 멋진 프론트엔드를 만드세요.**
