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

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](../zh-TW/README.md) | [日本語](../ja-JP/README.md) | [한국어](README.md)

</div>

---

**엔터프라이즈 프론트엔드 팀을 위한 Claude Code 공유 플러그인.**

코드 리뷰, 보안 리뷰, 디자인 구현(Figma/Sketch/MasterGo/Pixso/墨刀/摹客), 접근성 검사, 자동화된 품질 보증, 프로젝트 템플릿을 통합합니다. 모든 리뷰·분석·평가 보고서는 프로젝트 `reports/` 디렉터리에 Markdown 파일로 자동 저장되어 보관, 추적, 팀 공유에 활용됩니다.

---

## 🚀 빠른 시작

2분 안에 시작하세요:

### 1단계: 플러그인 설치

```bash
# 마켓플레이스 추가
/plugin marketplace add bovinphang/frontend-craft

# 플러그인 설치
/plugin install frontend-craft@bovinphang-frontend-craft

# 활성화
/reload-plugins
```

### 2단계: 프로젝트 설정 초기화 (권장)

```bash
# 프로젝트 템플릿을 .claude/ 디렉터리에 복사
/frontend-craft:init
```

초기화 후 프로젝트에 맞게 수정하세요:

1. `.claude/CLAUDE.md` — 프로젝트 기본 정보, 패키지 매니저, 자주 쓰는 명령어
2. `.claude/rules/` — 불필요한 규칙 삭제 (예: React 전용이면 `vue.md` 삭제, i18n 불필요 시 `i18n.md` 삭제); CI/CD 파이프라인이 있으면 `ci-cd.md` 유지
3. `.claude/settings.json` — 권한 화이트리스트 조정

> **왜 필요한가요?** 플러그인은 재사용 가능한 Skills, Agents, Hooks를 제공합니다. CLAUDE.md와 rules는 프로젝트 수준 설정으로, Claude Code가 인식하려면 프로젝트 루트 `.claude/` 아래에 있어야 합니다. `/init` 명령어로 이 설정을 빠르게 완료할 수 있습니다.

### 3단계: 사용 시작

```bash
# 코드 리뷰 (reports/code-review-*.md로 출력)
/frontend-craft:review

# 규약에 따라 페이지/기능/컴포넌트 생성
/frontend-craft:scaffold page UserDetail
/frontend-craft:scaffold component DataTable

# 사용 가능한 명령어 목록
/plugin list frontend-craft@bovinphang-frontend-craft
```

✨ **완료!** 5개의 에이전트, 14개의 스킬, 3개의 명령어를 사용할 수 있습니다.

---

## 🌐 크로스 플랫폼 지원

이 플러그인은 **Windows, macOS, Linux**를 완전 지원합니다. 모든 훅과 스크립트는 Node.js로 구현되어 크로스 플랫폼 호환성을 보장합니다.

---

## 📦 구성 내용

이 저장소는 **Claude Code 플러그인**으로, 직접 설치하거나 `--plugin-dir`로 로컬 로드할 수 있습니다.

```
frontend-craft/
|-- .claude-plugin/   # 플러그인 및 마켓플레이스 매니페스트
|   |-- plugin.json         # 플러그인 메타데이터
|   |-- marketplace.json    # /plugin marketplace add용 마켓플레이스
|
|-- agents/           # 위임용 전문 서브 에이전트
|   |-- frontend-architect.md    # 페이지 분할, 컴포넌트 아키텍처, 상태 흐름
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
|   |-- init.md        # /init - 프로젝트 템플릿 초기화
|   |-- review.md      # /review - 코드 규약화 리뷰
|   |-- scaffold.md    # /scaffold - page/feature/component 생성
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
|-- templates/        # 프로젝트 설정 템플릿 (/init으로 복사)
|   |-- CLAUDE.md
|   |-- settings.json
|   |-- rules/         # vue, react, design-system, testing 등
|
|-- .mcp.json         # MCP 서버 설정 (Figma, Sketch, MasterGo, Pixso, 墨刀)
└-- README.md
```

---

## 📥 설치

> **요구사항:** Claude Code v1.0.33+, Node.js >= 18, npm/pnpm/yarn.

### 옵션 1: 플러그인으로 설치 (권장)

```bash
# 마켓플레이스 추가
/plugin marketplace add bovinphang/frontend-craft

# 플러그인 설치
/plugin install frontend-craft@bovinphang-frontend-craft
```

또는 `~/.claude/settings.json` 또는 프로젝트 `.claude/settings.json`에 추가:

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

### 옵션 2: 팀 프로젝트 수준 자동 설치

프로젝트 루트의 `.claude/settings.json`에 위 `extraKnownMarketplaces` 설정을 추가하면, 팀원이 프로젝트 디렉터리를 trust할 때 설치가 안내됩니다.

### 옵션 3: 로컬 개발 / 테스트

저장소를 클론한 뒤 `--plugin-dir`로 로드 (설치 불필요, 개발·디버깅용):

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### 옵션 4: Git Submodule (프로젝트 공유)

```bash
# 프로젝트 루트에 submodule로 추가
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft

git add .gitmodules .claude/plugins/frontend-craft
git commit -m "feat: add frontend-craft as shared Claude Code plugin"
```

팀원은 클론 후 실행:

```bash
git submodule update --init --recursive
```

그 다음 `--plugin-dir`로 로드:

```bash
claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 기능 개요

### Commands (슬래시 명령어)

| 명령어 | 용도 | 보고서 출력 |
|--------|------|-------------|
| `/frontend-craft:init` | 프로젝트 템플릿을 `.claude/`에 초기화 | — |
| `/frontend-craft:review` | 지정 또는 최근 변경 파일의 코드 규약화 리뷰, 등급별 보고서 출력 | `code-review-*.md` |
| `/frontend-craft:scaffold` | 프로젝트 규약에 따라 page / feature / component 표준 구조와 보일러플레이트 생성 | — |

### Skills (자동 활성화)

| Skill | 용도 | 보고서 출력 |
|-------|------|-------------|
| `frontend-code-review` | 아키텍처, 타입, 렌더링, 스타일, 접근성 등 관점에서 코드 리뷰 | `code-review-*.md` |
| `security-review` | XSS, CSRF, 민감 데이터 유출, 입력 검증 등 보안 리뷰 | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA 접근성 검사 | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript 프로젝트 규약 (구조, 컴포넌트, 라우팅, 상태, API 계층) | — |
| `vue3-project-standard` | Vue 3 + TypeScript 프로젝트 규약 (구조, 컴포넌트, 라우팅, Pinia, API 계층) | — |
| `implement-from-design` | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 디자인에서 UI 구현 | `design-plan-*.md` |
| `test-and-fix` | lint, type-check, test, build 실행 및 실패 수정 | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML 레거시 프로젝트 개발·유지보수 규약 | — |
| `legacy-to-modern-migration` | jQuery/MPA → React/Vue 3 + TS 마이그레이션 전략, 개념 매핑, 단계별 워크플로우 | `migration-plan-*.md` |
| `e2e-testing` | Playwright/Cypress E2E 테스트 규약: 디렉터리 구조, Page Object, CI 통합 | — |
| `nextjs-project-standard` | Next.js 14+ App Router, SSR/SSG, 스트리밍, 메타데이터 규약 | — |
| `nuxt-project-standard` | Nuxt 3 SSR/SSG, Composition API, 데이터 페칭, 라우팅, 미들웨어 규약 | — |
| `monorepo-project-standard` | pnpm workspace, Turborepo, Nx: 디렉터리 구조, 의존성 관리, 태스크 오케스트레이션 | — |

### Agents (서브 에이전트)

| Agent | 용도 | 보고서 출력 |
|-------|------|-------------|
| `frontend-architect` | 페이지 분할, 컴포넌트 아키텍처, 상태 흐름 설계, 디렉터리 계획, 대규모 리팩토링 | `architecture-proposal-*.md` |
| `performance-optimizer` | 성능 병목 분석 (번들 크기, 렌더링 성능, 네트워크 요청), 정량화된 최적화 방안 출력 | `performance-review-*.md` |
| `ui-checker` | UI 시각적 이슈 디버깅, 디자인 충실도 평가 | `ui-fidelity-review-*.md` |
| `figma-implementer` | Figma/Sketch/MasterGo/Pixso/墨刀/摹客 디자인에서 정확한 UI 구현 | `design-implementation-*.md` |
| `design-token-mapper` | 디자인 변수를 프로젝트 Design Token에 매핑 | `token-mapping-*.md` |

### Hooks (자동 실행)

| 이벤트 | 동작 |
|--------|------|
| `SessionStart` | 프로젝트 프레임워크 및 패키지 매니저 감지 |
| `PreToolUse(Bash)` | 위험한 명령어 차단 (rm -rf, force push 등) |
| `PostToolUse(Write/Edit)` | 변경 파일에 자동 Prettier |
| `Stop` | 세션 종료 시 lint, type-check, test, build 실행 |
| `Notification` | 크로스 플랫폼 데스크톱 알림 (macOS / Linux / Windows) |

### MCP 연동

| 서비스 | 용도 |
|--------|------|
| Figma | 디자인 컨텍스트, 변수 정의 읽기 |
| Figma Desktop | Figma 데스크톱 연동 |
| Sketch | 디자인 선택 스크린샷 읽기 |
| MasterGo | DSL 구조 데이터, 컴포넌트 계층 및 스타일 읽기 |
| Pixso | 로컬 MCP로 프레임 데이터, 코드 스니펫, 이미지 리소스 획득 |
| 墨刀 | 프로토타입 데이터 획득, 디자인 설명 생성, HTML 가져오기 |
| 摹客 | MCP 없음, 사용자 스크린샷/주석/내보낸 CSS로 지원 |

### 프로젝트 템플릿 (`/init`으로 초기화)

| 파일 | 용도 |
|------|------|
| `CLAUDE.md` | 프로젝트 설명, 자주 쓰는 명령어, 작업 원칙, 보안 요구사항 |
| `settings.json` | 권한 화이트리스트/블랙리스트, 환경 변수 |
| `rules/vue.md` | Vue 3 컴포넌트 규약 및 안티패턴 |
| `rules/react.md` | React 컴포넌트 규약 및 안티패턴 |
| `rules/design-system.md` | 디자인 시스템, Token, 접근성 규칙 |
| `rules/testing.md` | 테스트 및 검증 규칙 |
| `rules/git-conventions.md` | Conventional Commits 커밋 규약 |
| `rules/i18n.md` | 국제화 카피 규약 |
| `rules/performance.md` | 프론트엔드 성능 최적화 규칙 |
| `rules/api-layer.md` | API 계층 타입화, 오류 처리 규약 |
| `rules/state-management.md` | 상태 분류, 관리 전략, 안티패턴 |
| `rules/error-handling.md` | 오류 계층화, Error Boundary, 폴백 UI, 리포팅 규약 |
| `rules/naming-conventions.md` | 파일, 컴포넌트, 변수, 라우트, API, CSS 통일 명명 규약 |
| `rules/ci-cd.md` | CI/CD 파이프라인 단계, GitHub Actions / GitLab CI 예시, 시크릿 관리 |
| `rules/refactoring.md` | 리팩터링 제약: 이미지, 스타일, 인라인 SVG/스타일 금지, flex 레이아웃 우선, 기능 동등 |

---

## ⚙️ 설정

### 사전 요구사항

- Node.js >= 18
- npm, pnpm, yarn 중 하나
- Git Bash (Windows에서 훅 스크립트 실행에 필요)

### MCP 서버

디자인 관련 기능 사용 전, 팀에서 사용하는 디자인 도구에 맞게 환경 변수를 설정하세요:

| 환경 변수 | 도구 | 획득 방법 |
|----------|------|----------|
| `FIGMA_API_KEY` | Figma / Figma Desktop | Figma 계정 설정 > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch 개발자 설정 |
| `MG_MCP_TOKEN` | MasterGo | MasterGo 계정 설정 > 보안 설정 > Token 생성 |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI 기능 페이지에서 액세스 토큰 획득 |

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

| 보고서 유형 | 파일명 패턴 | 출처 |
|-------------|------------|------|
| 코드 리뷰 | `code-review-YYYY-MM-DD-HHmmss.md` | `/review` 명령어, `frontend-code-review` 스킬 |
| 보안 리뷰 | `security-review-YYYY-MM-DD-HHmmss.md` | `security-review` 스킬 |
| 접근성 | `accessibility-review-YYYY-MM-DD-HHmmss.md` | `accessibility-check` 스킬 |
| 성능 | `performance-review-YYYY-MM-DD-HHmmss.md` | `performance-optimizer` 에이전트 |
| 아키텍처 | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` 에이전트 |
| 디자인 충실도 | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md` | `ui-checker` 에이전트 |
| 디자인 구현 | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` 에이전트 |
| Token 매핑 | `token-mapping-YYYY-MM-DD-HHmmss.md` | `design-token-mapper` 에이전트 |
| 디자인 계획 | `design-plan-YYYY-MM-DD-HHmmss.md` | `implement-from-design` 스킬 |
| 테스트 수정 | `test-fix-YYYY-MM-DD-HHmmss.md` | `test-and-fix` 스킬 |
| 마이그레이션 계획 | `migration-plan-YYYY-MM-DD-HHmmss.md` | `legacy-to-modern-migration` 스킬 |

> **팁:** `.gitignore`에 `reports/`를 추가해 자동 생성 보고서 커밋을 피하거나, 팀 기록을 위해 커밋을 유지하세요.

---

## 📥 업데이트

Marketplace로 설치한 경우 Claude Code에서 실행:

```
/plugin marketplace update bovinphang-frontend-craft
```

또는 자동 업데이트를 켜면 Claude Code 시작 시마다 최신 버전을 자동으로 가져옵니다:

1. Claude Code에서 `/plugin` 실행해 플러그인 관리자 열기
2. **Marketplaces** 탭으로 전환
3. `bovinphang-frontend-craft` 선택
4. **Enable auto-update** 선택

> 서드파티 Marketplace는 기본적으로 자동 업데이트가 꺼져 있습니다. 켜면 Claude Code 시작 시 Marketplace 데이터를 새로 고치고 설치된 플러그인을 업데이트합니다.

Git submodule로 설치한 경우:

```bash
git submodule update --remote .claude/plugins/frontend-craft
```

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
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 라이선스

MIT — 자유롭게 사용, 필요에 따라 수정, 가능하면 기여해 주세요.

---

**이 저장소가 도움이 되었다면 Star를 눌러 주세요. 멋진 프론트엔드를 만드세요.**
