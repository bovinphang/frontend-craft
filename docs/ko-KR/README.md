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

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md)  | [繁體中文](../zh-TW/README.md) | [日本語](../ja-JP/README.md) 

**🌐 Language / 语言 / 語言 / 言語 / 언어**

[**English**](../../README.md) | [简体中文](../../README.zh-CN.md) | [繁體中文](../docs/ko-KR/README.md) | [日本語](../docs/ja-JP/README.md) | [한국어](README.md)

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

초기화 후 프로젝트에 맞게 `.claude/CLAUDE.md`, `rules/`, `settings.json`을 수정하세요.

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

✨ **완료!** 5개의 에이전트, 8개의 스킬, 3개의 명령어를 사용할 수 있습니다.

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
|   |-- test-and-fix/            # lint, type-check, test, build 및 수정
|   |-- legacy-web-standard/     # JS + jQuery + HTML 레거시 프로젝트 규약
|
|-- commands/         # 슬래시 명령어
|   |-- init.md        # /init - 프로젝트 템플릿 초기화
|   |-- review.md      # /review - 코드 리뷰
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
```

---

## 📥 설치

> **요구사항:** Claude Code v1.0.33+, Node.js >= 18, npm/pnpm/yarn.

### 옵션 1: 플러그인으로 설치 (권장)

```bash
/plugin marketplace add bovinphang/frontend-craft
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

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### 옵션 4: Git Submodule (프로젝트 공유)

```bash
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft
# 팀: git submodule update --init --recursive
# 로드: claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 기능 개요

### Commands (슬래시 명령어)

| 명령어 | 용도 | 보고서 출력 |
|--------|------|-------------|
| `/frontend-craft:init` | 프로젝트 템플릿을 `.claude/`에 초기화 | — |
| `/frontend-craft:review` | 지정 또는 최근 변경 파일의 코드 리뷰 | `code-review-*.md` |
| `/frontend-craft:scaffold` | page / feature / component 구조 생성 | — |

### Skills (자동 활성화)

| Skill | 용도 | 보고서 출력 |
|-------|------|-------------|
| `frontend-code-review` | 아키텍처, 타입, 렌더링, 스타일, a11y | `code-review-*.md` |
| `security-review` | XSS, CSRF, 민감 데이터, 입력 검증 | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA 접근성 | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript 프로젝트 규약 | — |
| `vue3-project-standard` | Vue 3 + TypeScript 프로젝트 규약 | — |
| `implement-from-design` | 디자인에서 UI 구현 | `design-plan-*.md` |
| `test-and-fix` | lint, type-check, test, build 및 수정 | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML 레거시 규약 | — |

### Agents (서브 에이전트)

| Agent | 용도 | 보고서 출력 |
|-------|------|-------------|
| `frontend-architect` | 페이지 분할, 컴포넌트 아키텍처, 상태 흐름, 리팩토링 | `architecture-proposal-*.md` |
| `performance-optimizer` | 성능 분석, 최적화 제안 | `performance-review-*.md` |
| `ui-checker` | UI 시각적 이슈, 디자인 충실도 평가 | `ui-fidelity-review-*.md` |
| `figma-implementer` | 디자인 기반 정확한 UI 구현 | `design-implementation-*.md` |
| `design-token-mapper` | 디자인 변수를 Design Token에 매핑 | `token-mapping-*.md` |

### Hooks (자동 실행)

| 이벤트 | 동작 |
|--------|------|
| `SessionStart` | 프로젝트 프레임워크 및 패키지 매니저 감지 |
| `PreToolUse(Bash)` | 위험한 명령어 차단 (rm -rf, force push 등) |
| `PostToolUse(Write/Edit)` | 변경 파일에 자동 Prettier |
| `Stop` | 세션 종료 시 lint, type-check, test, build 실행 |
| `Notification` | 크로스 플랫폼 데스크톱 알림 |

### MCP 연동

| 서비스 | 용도 |
|--------|------|
| Figma / Figma Desktop | 디자인 컨텍스트, 변수 정의 |
| Sketch | 디자인 선택 스크린샷 |
| MasterGo | DSL 구조 데이터 |
| Pixso | 로컬 MCP로 프레임 데이터, 코드 스니펫 |
| 墨刀 (Modao) | 프로토타입 데이터, 디자인 설명 |
| 摹客 (Mockplus) | MCP 없음, 사용자 스크린샷/주석으로 지원 |

---

## 📄 보고서 출력

모든 리뷰·분석·평가 결과는 프로젝트 `reports/` 디렉터리에 Markdown 파일로 자동 저장됩니다.

| 보고서 유형 | 파일명 패턴 | 출처 |
|-------------|------------|------|
| 코드 리뷰 | `code-review-*.md` | `/review`, `frontend-code-review` |
| 보안 리뷰 | `security-review-*.md` | `security-review` |
| 접근성 | `accessibility-review-*.md` | `accessibility-check` |
| 성능 | `performance-review-*.md` | `performance-optimizer` |
| 아키텍처 | `architecture-proposal-*.md` | `frontend-architect` |
| 디자인 충실도 | `ui-fidelity-review-*.md` | `ui-checker` |
| 디자인 구현 | `design-implementation-*.md` | `figma-implementer` |
| Token 매핑 | `token-mapping-*.md` | `design-token-mapper` |
| 디자인 계획 | `design-plan-*.md` | `implement-from-design` |
| 테스트 수정 | `test-fix-*.md` | `test-and-fix` |

> **팁:** `.gitignore`에 `reports/`를 추가하거나, 기록을 위해 필요 시 커밋하세요.

---

## ⚙️ 설정

### MCP 환경 변수

| 변수 | 도구 | 획득 방법 |
|------|------|----------|
| `FIGMA_API_KEY` | Figma | Figma 계정 > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch 개발자 설정 |
| `MG_MCP_TOKEN` | MasterGo | MasterGo 계정 > 보안 설정 |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI 페이지 |

Pixso는 로컬 MCP 사용(클라이언트에서 활성화); 摹客은 사용자 스크린샷/주석으로 지원.

---

## 📥 업데이트

```bash
# Marketplace 설치
/plugin marketplace update bovinphang-frontend-craft

# 자동 업데이트 활성화: /plugin → Marketplaces → 선택 → Enable auto-update

# Submodule 설치
git submodule update --remote .claude/plugins/frontend-craft
```

---

## 📄 라이선스

MIT — 자유롭게 사용, 필요에 따라 수정, 가능하면 기여해 주세요.

---

**이 저장소가 도움이 되었다면 Star를 눌러 주세요. 멋진 프론트엔드를 만드세요.**
