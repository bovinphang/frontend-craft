<div align="center">

<img src="../../assets/brand/frontend-craft.png" alt="frontend-craft logo" width="200" />

# frontend-craft

### 하나의 툴킷. 모든 AI 코딩 어시스턴트. 프로덕션 수준의 프론트엔드 표준.

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@bovinphang/frontend-craft)](https://www.npmjs.com/package/@bovinphang/frontend-craft)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)
![Node](https://img.shields.io/badge/Node.js-22+-5FA04E?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vue](https://img.shields.io/badge/-Vue-4FC08D?logo=vue.js&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white)

**🌐 Language / 语言 / 語言 / 言語 / 언어**

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](../zh-TW/README.md) · [日本語](../ja-JP/README.md) · [**한국어**](README.md)

</div>

---

`frontend-craft`는 다음 **15개의 AI 코딩 어시스턴트**에 통일된 프론트엔드 엔지니어링 표준을 제공하는 **범용 프론트엔드 플러그인**입니다:

`claude` `codex` `cursor` `windsurf` `opencode`
`kilo` `gemini` `copilot` `antigravity` `augment`
`trae` `codebuddy` `cline` `openclaw` `qoder`

각 런타임의 경로와 주의사항은 [`docs/runtimes/`](../runtimes/)에 있습니다.

**13개의 전문 에이전트**, **45개의 자동 활성화 스킬**, **8개의 슬래시 명령어**, **5개의 이벤트 기반 훅**, 6개 디자인 도구 엔드포인트를 위한 **MCP 통합**, 그리고 완전한 **규칙 라이브러리**를 하나의 설치 가능한 패키지로 묶었습니다. 명령어 하나만 실행하면, 팀의 모든 AI 세션이 React, Vue, Next.js, Nuxt를 같은 방식으로 작성합니다 — 타입 안전하고, 접근성 있고, 안전하며, 일관성 있게.

---

## 왜 frontend-craft인가?

| 문제점                                                                       | frontend-craft의 해결책                                                                                     |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| AI 어시스턴트가 일관성 없고, 타입 없고, 안전하지 않은 프론트엔드 코드를 작성 | **45개 스킬**이 팀 표준을 인코딩 — 해당 파일을 건드릴 때 자동 활성화                                        |
| AI 도구마다 플러그인 형식이 다름                                             | **하나의 CLI**로 동일한 규칙, 에이전트, 훅을 15개 런타임에 설치                                             |
| 디자인에서 코드로의 전달 과정에서 정보 손실                                  | **MCP 통합**이 Figma, Figma Desktop, Sketch, MasterGo, Pixso, 墨刀에서 더 풍부한 디자인 컨텍스트를 가져오기 |
| 리뷰가 즉흥적이고 얕음                                                       | **13개 에이전트**가 등급별 보고서 출력: 코드, 보안, 접근성, 성능, TS, UI 충실도                             |
| 아무도 lint와 테스트 실행을 기억하지 못함                                    | **이벤트 기반 훅**이 저장 시와 세션 종료 시 자동 검증                                                       |
| 새 프로젝트가 매번 처음부터 시작                                             | **`/fec-init`**이 몇 초 만에 CLAUDE.md, 규칙, 설정을 스캐폴드                                               |

---

## 설치

**Node.js 22+**가 필요합니다. **Windows, macOS, Linux**에서 동작합니다(모든 훅과 스크립트는 Node.js로 구현).

### 방법 1: fec CLI 전역 설치 (권장)

```bash
# 1. fec 명령어를 전역으로 설치
npm install -g @bovinphang/frontend-craft@latest

# 2. 프론트엔드 프로젝트로 이동
cd your-project

# 3. 연결할 AI 런타임을 대화형으로 선택
fec setup

# 4. 현재 프로젝트에 연결
fec setup codex
fec setup claude
fec setup all

# 5. 전역 연결, 모든 프로젝트에서 사용
fec setup codex --global
fec setup claude --global
fec setup all --global

# 6. 미리보기 / 조회
fec install --all --dry-run --global
fec list
```

`npm install -g`는 `fec` 터미널 명령어만 설치합니다. `fec setup`은 frontend-craft를 프로젝트에 연결하는 터미널 CLI 명령어이며, AI 어시스턴트 안의 `/fec-init` 슬래시 명령어와는 다릅니다. 대화형 터미널에서 인자 없는 `fec setup`은 runtime 선택을 먼저 요청합니다. `fec setup <runtime>`과 `fec setup all`은 기본적으로 현재 프로젝트에 연결합니다. `--global`을 전달할 때만 선택한 AI 도구의 전역 설정 디렉터리에 연결되어 모든 프로젝트에서 사용할 수 있습니다.

### 방법 2: npx로 임시 실행 (전역 fec 불필요)

```bash
# 1. 대화형 마법사
npx @bovinphang/frontend-craft@latest

# 2. 현재 프로젝트에 연결
npx @bovinphang/frontend-craft@latest install --local codex
npx @bovinphang/frontend-craft@latest install --local claude
npx @bovinphang/frontend-craft@latest install --all --local

# 3. 전역 연결, 모든 프로젝트에서 사용
npx @bovinphang/frontend-craft@latest install --global codex
npx @bovinphang/frontend-craft@latest install --global claude
npx @bovinphang/frontend-craft@latest install --all --global

# 4. 미리보기 / 조회
npx @bovinphang/frontend-craft@latest install --all --dry-run --global
npx @bovinphang/frontend-craft@latest list
```

전역 `fec` 명령어를 설치하고 싶지 않을 때는 `npx`를 사용합니다. 인자 없이 실행하면 대화형 마법사가 열립니다. 먼저 하나 이상의 런타임을 선택한 다음, 전역 또는 현재 프로젝트에 연결할지 결정합니다. 모든 runtime을 스크립트로 설치할 때는 `install --all --local` 또는 `install --all --global`을 사용하고, `install all`이라고 쓰지 않습니다. CI / 스크립트 환경에서는 항상 `--global` / `-g` 또는 `--local` / `-l`을 지정하세요. TTY가 아니고 미지정 시, CLI는 `claude --global`을 기본값으로 합니다.

### 방법 3: Claude Code Marketplace

Claude Code 사용자라면 **Claude Code Marketplace**를 단일 소스 설치 방식으로 권장합니다. CLI를 Claude에 사용하는 것은 교차 런타임 설치, 스크립트/오프라인 파일 복사, 또는 비 Marketplace 환경이 필요한 경우에만 사용하세요.

Marketplace가 이미 설치된 경우, `--force`를 사용해도 CLI는 두 번째 Claude 사본을 설치하거나 업데이트하지 않습니다. 대신 Claude Code Marketplace를 통해 업데이트하세요. 다른 스코프에 CLI 관리 Claude 설치본이 이미 있는 경우, 대화형 터미널에서는 해당 소스를 최신으로 유지할지, 제거 후 전환할지 묻습니다. 비대화형 터미널은 중단하고 실행할 `update`, `uninstall`, `install` 명령어를 정확히 출력합니다.

전체 Claude 전용 단계는 [docs/runtimes/claude.md](../runtimes/claude.md) · [简体中文](../runtimes/claude.zh-CN.md)에 있습니다.

---

## 빠른 시작

설치 후, 모든 AI 세션에서 완전한 프론트엔드 엔지니어링 툴킷을 사용할 수 있습니다:

```text
사용자: "Review my recent changes"
→ fec-code-reviewer 에이전트가 실행되어 reports/code-review-*.md 출력

사용자: "/fec-review"
→ 아키텍처, 타입, 렌더링, 스타일, 접근성 관점에서 구조화된 리뷰 실행

사용자: "이 Figma 링크로 결제 페이지를 구현해줘"
→ fec-figma-implementer 에이전트가 MCP를 통해 디자인을 읽고 컴포넌트와 보고서 출력

사용자: "/fec-scaffold dashboard feature"
→ 프로젝트 규칙에 따라 page / feature / component 디렉토리 트리 생성

사용자: "/fec-refactor-clean"
→ 데드 코드, 미사용 export, 스타일, 의존성을 분류하고 안전하게 제거
```

아래 슬래시 명령어는 **Claude Code**를 예로 든 것입니다; 다른 런타임도 각자의 명령어 시스템으로 동일한 기능을 제공합니다([`docs/runtimes/`](../runtimes/) 참조).

---

## 예시 프롬프트

시나리오별 전체 프롬프트 모음은 [docs/example-prompts.md](../example-prompts.md)를 참고하세요.

```text
사용자: "병합 전에 최근 변경사항을 리뷰해줘. 아키텍처, 타입 안전성, 렌더링 동작, 스타일, 접근성, 누락된 테스트를 중점적으로 봐줘."
사용자: "코딩하기 전에 계정 결제 기능을 계획해줘: 라우트 구조, 컴포넌트 경계, 데이터 흐름, 상태 소유권, 검증 흐름, 출시 리스크까지."
사용자: "다단계 등록 폼을 만들어줘. 프로젝트 프레임워크에 맞는 폼과 schema 검증 방식을 선택하고, 파일 업로드, 조건부 필드, 비동기 검증, 접근 가능한 오류를 포함해줘."
사용자: "Figma 노드 123:456을 기준으로 UI를 구현해줘. 기존 design token과 컴포넌트를 재사용하고, 간격과 반응형 상태를 맞추고, 가정도 문서화해줘."
사용자: "`/fec-refactor-clean` 이 모듈의 데드 코드를 정리해줘."
```

---

## 구성 내용

### 명령어

슬래시 명령어는 구조화된 워크플로의 주요 진입점입니다. 대부분 `reports/`에 타임스탬프가 찍힌 Markdown 보고서를 출력합니다.

| 명령어                | 용도                                                              | 보고서                                             |
| --------------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| `/fec-init`           | 프로젝트 템플릿 초기화 (CLAUDE.md, 규칙, 설정)                    | —                                                  |
| `/fec-review`         | 지정되거나 최근 변경된 파일의 구조화된 리뷰                       | `code-review-*.md`                                 |
| `/fec-scaffold`       | 규칙에 따라 page / feature / component 보일러플레이트 생성        | —                                                  |
| `/fec-plan`           | 통합 계획: 구현 아키텍처 또는 테스트 전략                         | `architecture-proposal-*.md` 또는 `test-plan-*.md` |
| `/fec-tdd`            | 빨강 → 초록 → 리팩토링 프론트엔드 TDD 루프                        | —                                                  |
| `/fec-debug`          | 프론트엔드 문제 진단 및 수정: 빌드, 런타임, UI, API 장애          | `debug-*.md`                                       |
| `/fec-refactor-clean` | 데드 코드, 미사용 export, 스타일, 의존성을 분류하고 안전하게 제거 | `refactor-clean-*.md`                              |
| `/fec-doc-sync`       | README, docs, 환경 변수, 스크립트, API/라우트 설명, 배포 문서 동기화 | —                                                  |

### 스킬 (자동 활성화)

스킬은 파일 패턴, 프레임워크, 또는 작업 컨텍스트에 기반하여 **자동으로 활성화**되는 워크플로 정의입니다. 리뷰 관점, 출력 규칙, 보고서 형식을 인코딩합니다.

아래 스킬은 사용 사례별로 묶여 있어 프로젝트 표준, 구현, 테스트, 리뷰, 디자인, 마이그레이션, 프로젝트 진화, 문서 유지보수 워크플로를 빠르게 찾을 수 있습니다.

**프로젝트 표준** — 해당 프레임워크가 감지되면 자동 적용:

| 스킬                            | 범위                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `fec-react-project-standard`    | React + TypeScript (구조, 컴포넌트, 라우팅, 상태, API 계층)  |
| `fec-vue3-project-standard`     | Vue 3 + TypeScript (구조, 컴포넌트, 라우팅, Pinia, API 계층) |
| `fec-nextjs-project-standard`   | Next.js 14+ App Router, SSR/SSG, 스트리밍, 메타데이터        |
| `fec-nuxt-project-standard`     | Nuxt 3 SSR/SSG, Composition API, 데이터 페칭, 미들웨어       |
| `fec-vite-project-standard`     | Vite 설정, 환경 변수 안전, HMR, 개발 프록시, 빌드 최적화     |
| `fec-monorepo-project-standard` | pnpm workspace, Turborepo, Nx 구조 및 태스크 오케스트레이션  |
| `fec-typescript-project-standard`   | TypeScript 설정, 공개 API 타입, 선언 파일, DTO, 제네릭          |

**구현 기능** — 특정 프론트엔드 기능을 구축할 때 활성화:

| 스킬                      | 범위                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `fec-data-fetching`       | 서버 상태 페칭, 캐시, 무효화, SSR, 무한 로딩                  |
| `fec-api-integration`     | Typed API client, 인증 refresh, 업로드, 실시간 통합           |
| `fec-state-management`    | 상태 소유권, 스토어 선택, URL 상태, 서버/폼/로컬 상태 경계    |
| `fec-form-handling`       | 프레임워크별 폼 선택, schema 검증, 동적 필드, 업로드          |
| `fec-browser-storage`     | localStorage / sessionStorage / IndexedDB / Cookies 선택      |
| `fec-route-protection`    | React Router, Next.js, Vue Router, Nuxt의 인증 및 권한 라우팅 |
| `fec-pwa-implementation`  | 매니페스트, 서비스 워커, 오프라인 캐시, 설치 프롬프트         |
| `fec-web-workers`         | Web Worker, Transferable, Comlink, 워커 풀                    |
| `fec-canvas-threejs`      | Canvas 2D, Three.js, React Three Fiber, WebGL                 |
| `fec-svg-animation`       | CSS / Framer Motion / GSAP SVG 애니메이션과 reduced-motion    |
| `fec-list-virtualization` | 프레임워크별 대규모 리스트 가상화, 측정, 그리드, 무한 스크롤 |

**테스트** — 프론트엔드 테스트 범위를 계획하거나 작성할 때 활성화:

| 스킬                    | 범위                                                   |
| ----------------------- | ------------------------------------------------------ |
| `fec-testing-strategy`  | 정적, 단위, 컴포넌트, 통합, E2E, 시각 테스트 계층 선택 |
| `fec-component-testing` | React Testing Library / Vue Test Utils와 회귀 시나리오 |
| `fec-e2e-testing`       | Playwright / Cypress E2E와 Page Object, CI 통합        |
| `fec-tdd-workflow`      | 테스트 우선 프론트엔드 구현, 빨강-초록 리팩토링        |

**리뷰 및 품질** — 리뷰, 검증, 정리 워크플로에서 활성화:

| 스킬                           | 범위                                                            |
| ------------------------------ | --------------------------------------------------------------- |
| `fec-code-review`              | 아키텍처, 타입, 렌더링, 스타일, 접근성 리뷰                     |
| `fec-debug-framework`          | 빌드, 런타임, UI, API/데이터 장애의 체계적 진단                 |
| `fec-security-review`          | XSS, CSRF, 민감 데이터 유출, 입력 검증                          |
| `fec-accessibility-check`      | WCAG 2.2, 키보드, 포커스, 터치, 스크린 리더 동작                |
| `fec-dependency-upgrade`       | 의존성 업그레이드, lockfile 리뷰, CVE 수정, 마이그레이션 검증   |
| `fec-validation-fix`           | lint, type-check, test, build를 한 번에 실행하고 수정           |
| `fec-performance-optimization` | Core Web Vitals, 번들, 렌더링, 메모리, 네트워크, 성능 예산 리뷰 |
| `fec-refactor-clean`           | 데드 코드, 미사용 export, 스타일, 라우트, 의존성의 안전한 정리  |

**디자인 UI** — 디자인 구현, 디자인 시스템, 시각적 마무리에서 활성화:

| 스킬                          | 범위                                                               |
| ----------------------------- | ------------------------------------------------------------------ |
| `fec-ui-design`               | 제품 맥락 UI 방향, 반템플릿 디자인 다이얼, 미디어 전략, 상태, visual QA |
| `fec-image-generation`        | 다이어그램, 이미지 생성/편집, 비주얼 에셋, PNG QA 및 수정 루프     |
| `fec-drawio-studio`         | 편집 가능한 draw.io / diagrams.net 기술 다이어그램, shape 검색, 자동 레이아웃, 코드 구조도 |
| `fec-web-video-presentation` | 글, 스크립트, 레슨, demo를 녹화 가능한 16:9 step-driven 웹 프레젠테이션으로 변환 |
| `fec-tailwind-design-system`  | Tailwind token, 테마 확장, variants, class 관리, dark mode         |
| `fec-responsive-layout`       | 모바일 우선, container queries, 데이터 밀집 responsive UI          |
| `fec-motion-interaction`      | 맥락 기반 motion 강도, 페이지 전환, 스크롤 animation, reduced-motion |
| `fec-implement-from-design`   | 디자인 도구, 스크린샷 또는 section 단위 시각 참조에서 UI 구현      |
| `fec-storybook-component-doc` | Storybook 컴포넌트 문서, 디자인 시스템 표시, 격리 상태 미리보기    |

**레거시 마이그레이션** — 현대화 작업에서 활성화:

| 스킬                             | 범위                                                               |
| -------------------------------- | ------------------------------------------------------------------ |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 레거시 프로젝트 개발 및 유지보수 기준           |
| `fec-legacy-to-modern-migration` | 레거시 프론트엔드 현대화, 대상 스택 선택, 단계별 워크플로 |

**프로젝트 진화** — 참조 시스템을 프로젝트 네이티브 개선으로 흡수할 때 활성화:

| 스킬          | 범위                                                  |
| ------------- | ----------------------------------------------------- |
| `fec-alchemy` | 참조 시스템 역량을 독창적인 프로젝트 네이티브 설계로 흡수 |

**문서 유지보수** — 문서 작업에서 활성화:

| 스킬                            | 범위                                                  |
| ------------------------------- | ----------------------------------------------------- |
| `fec-backend-requirements-handoff` | Frontend-to-backend handoff for UI data needs, actions, states, rules, and questions |
| `fec-doc-sync`                  | 프론트엔드 문서를 코드, 설정, 스크립트, 라우트, API, 환경 변수, 배포 사실과 동기화 |
| `fec-source-driven-development` | 프로젝트 사실과 공식 소스로 버전 의존 결정을 검증     |

### 에이전트

에이전트는 메인 어시스턴트에서 호출되는 전문 서브 에이전트로, 특정 작업에 집중하여 구조화된 보고서를 반환합니다.

| 에이전트                    | 초점                                                              | 보고서                       |
| --------------------------- | ----------------------------------------------------------------- | ---------------------------- |
| `fec-code-reviewer`         | React/Vue/Next/Nuxt, TS, 스타일, 클라이언트 측 보안 (신뢰도 기반) | `code-review-*.md`           |
| `fec-typescript-reviewer`   | 타입 안전성, 비동기 정확성, 관용적 패턴 (보고서만)                | `typescript-review-*.md`     |
| `fec-security-reviewer`     | XSS, 클라이언트 시크릿, 위험한 DOM/API, CSP, 의존성 감사          | `security-review-*.md`       |
| `fec-performance-optimizer` | 번들 크기, 렌더링 성능, 네트워크 병목                             | `performance-review-*.md`    |
| `fec-architect`             | 페이지 분할, 컴포넌트 아키텍처, 상태 흐름, 디렉토리 계획          | `architecture-proposal-*.md` |
| `fec-test-planner`          | 위험→계층 매트릭스: 정적, 단위, 컴포넌트, E2E, 시각, 접근성, 보안 | `test-plan-*.md`             |
| `fec-debugger`              | 빌드, 런타임, UI, API 장애에 대한 복잡한 프론트엔드 진단          | `debug-*.md`                 |
| `fec-refactor-cleaner`      | 미사용 코드, export, 스타일, 라우트, 의존성 분류 및 안전한 제거   | `refactor-clean-*.md`        |
| `fec-e2e-runner`            | E2E 작성 및 실행 (Playwright/Cypress), flaky 격리, 트레이스       | `e2e-summary-*.md`           |
| `fec-doc-updater`           | README, 런타임 문서, 구조, 기능 표, 메타데이터 동기화             | —                            |
| `fec-ui-checker`            | 시각적 문제 디버깅 및 디자인 충실도 평가                          | `ui-fidelity-review-*.md`    |
| `fec-figma-implementer`     | Figma/Sketch/MasterGo/Pixso/墨刀 디자인에서 정확한 UI 구현        | `design-implementation-*.md` |
| `fec-design-token-mapper`   | 디자인 변수를 프로젝트 Design Token에 매핑                        | `token-mapping-*.md`         |

### 훅 (이벤트 기반)

훅은 AI 어시스턴트 이벤트에서 **자동 실행**됩니다. 호출 불필요.

| 이벤트                    | 동작                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `SessionStart`            | Claude 캐시를 정리한 뒤 프로젝트 프레임워크 및 패키지 매니저 감지 |
| `PreToolUse(Bash)`        | 위험한 명령어 차단 (`rm -rf`, force push 등)                      |
| `PostToolUse(Write/Edit)` | 변경된 파일에 자동 Prettier 실행                                  |
| `Stop`                    | 세션 종료 시 lint, type-check, test, build 실행                   |
| `Notification`            | 크로스 플랫폼 데스크톱 알림 (macOS / Linux / Windows)             |

### MCP 통합

AI 어시스턴트를 디자인 도구에 연결하여 더 풍부한 디자인 컨텍스트를 갖춘 디자인→코드 워크플로를 구현합니다.

| 서비스            | 기능                                                |
| ----------------- | --------------------------------------------------- |
| **Figma**         | 디자인 컨텍스트 및 변수 정의 읽기                   |
| **Figma Desktop** | Figma 데스크톱 클라이언트 통합                      |
| **Sketch**        | 디자인 선택 스크린샷 읽기                           |
| **MasterGo**      | DSL 구조, 컴포넌트 계층, 스타일 읽기                |
| **Pixso**         | 로컬 MCP: 프레임 데이터, 코드 스니펫, 이미지 리소스 |
| **墨刀**          | 프로토타입 데이터, 디자인 설명, HTML 가져오기       |
| **摹客**          | 스크린샷/주석/CSS 내보내기 워크플로 (MCP 없음)      |

### 프로젝트 템플릿 (`/fec-init`)

`/fec-init`을 실행하면 즉시 사용 가능한 규칙 라이브러리와 프로젝트 설정을 `.claude/`에 스캐폴드합니다:

<details>
<summary>전체 20개 템플릿 파일 보기</summary>

| 파일                                     | 용도                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `CLAUDE.md`                              | 프로젝트 설명, 명령어, 작업 원칙, 보안                                |
| `settings.json`                          | 권한 화이트리스트/블랙리스트, 환경 변수                               |
| `rules/fec-vue.md`                       | Vue 3 컴포넌트 기준 및 안티패턴                                       |
| `rules/fec-react.md`                     | React 컴포넌트 기준 및 안티패턴                                       |
| `rules/fec-design-system.md`             | 디자인 시스템, 토큰, 접근성                                           |
| `rules/fec-testing.md`                   | 테스트 및 검증 규칙                                                   |
| `rules/fec-git-conventions.md`           | Conventional Commits                                                  |
| `rules/fec-i18n.md`                      | 국제화 카피 기준                                                      |
| `rules/fec-performance.md`               | 프론트엔드 성능 최적화 규칙                                           |
| `rules/fec-rendering-patterns.md`        | 렌더링 라이프사이클, hydration, SSR/CSR, 업데이트 패턴                |
| `rules/fec-responsive-design.md`         | 반응형 레이아웃, 브레이크포인트, 터치 대상, viewport 동작             |
| `rules/fec-source-driven-development.md` | Source-driven decisions, official docs, version-sensitive assumptions |
| `rules/fec-api-layer.md`                 | API 계층 타입화 및 오류 처리                                          |
| `rules/fec-state-management.md`          | 상태 분류, 전략, 안티패턴                                             |
| `rules/fec-error-handling.md`            | 오류 계층화, Error Boundary, 폴백 UI, 보고                            |
| `rules/fec-naming-conventions.md`        | 파일, 컴포넌트, 변수, 라우트, API, CSS 통일 명명                      |
| `rules/fec-code-comments.md`             | 프론트엔드 주석 작성 시점과 방법                                      |
| `rules/fec-ci-cd.md`                     | CI/CD 파이프라인 단계, GitHub Actions / GitLab CI, 시크릿             |
| `rules/fec-refactoring.md`               | 리팩토링 제약 및 기능 동등성 요구사항                                 |
| `rules/fec-agent-workflow.md`            | 에이전트 간 협업 경계 및 위임                                         |
| `rules/fec-working-modes.md`             | 조사, 계획, 개발, 리뷰, 마무리 모드 가이드                            |

</details>

---

## 설정

### 사전 요구사항

- **Node.js 22+**
- **npm, pnpm, 또는 yarn**
- **Git Bash 또는 호환 셸** (Windows만, AI 런타임이 셸 명령을 호출하는 경우)

### MCP 디자인 도구 토큰

팀에서 사용하는 디자인 도구에 따라 환경 변수를 설정합니다:

| 환경 변수        | 도구                  | 획득 방법                                |
| ---------------- | --------------------- | ---------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma 계정 설정 → Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch                | Sketch 개발자 설정                       |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo 계정 설정 → 보안 → 토큰 생성    |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 기능 페이지 → 액세스 토큰        |

> **Pixso**는 로컬 MCP 서버를 사용합니다 — Pixso 클라이언트에서 MCP를 활성화하면 되며, 환경 변수는 필요 없습니다.
> **摹客**은 MCP 통합이 없습니다 — 스크린샷과 CSS 내보내기로 작업합니다.

셸 설정에 추가하여 영속화합니다:

```bash
# macOS / Linux — ~/.bashrc 또는 ~/.zshrc에 추가
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

```powershell
# Windows — 시스템 환경 변수로 설정, 또는 PowerShell에서 임시 설정:
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

---

## 보고서

모든 리뷰, 분석, 평가는 `reports/`에 타임스탬프가 찍힌 Markdown 보고서로 작성됩니다. 이는 감사 추적 및 PR 산출물로 기능합니다.

<details>
<summary>전체 16개 보고서 유형 보기</summary>

| 보고서 유형          | 파일명 패턴                                  | 생성 출처                                                           |
| -------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| 코드 리뷰            | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`, `fec-code-review`, `fec-code-reviewer`               |
| 디버그 진단          | `debug-YYYY-MM-DD-HHmmss.md`                 | `/fec-debug`, `fec-debug-framework`, `fec-debugger`                 |
| TypeScript / JS 리뷰 | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `fec-typescript-reviewer`                                           |
| 보안 리뷰            | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`, `fec-security-reviewer`                      |
| 접근성               | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                           |
| 성능                 | `performance-review-YYYY-MM-DD-HHmmss.md`    | `fec-performance-optimizer`                                         |
| 아키텍처             | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `fec-architect`                                                     |
| 디자인 충실도        | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `fec-ui-checker`                                                    |
| 디자인 구현          | `design-implementation-YYYY-MM-DD-HHmmss.md` | `fec-figma-implementer`                                             |
| 토큰 매핑            | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `fec-design-token-mapper`                                           |
| 디자인 계획          | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                         |
| 테스트 계획          | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-plan`, `fec-testing-strategy`, `fec-test-planner`             |
| 검증 수정            | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                |
| 리팩토링 정리        | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`, `fec-refactor-clean`, `fec-refactor-cleaner` |
| E2E 실행 요약        | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-e2e-runner` (선택)                                             |
| 마이그레이션 계획    | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                    |

</details>

> **팁:** `.gitignore`에 `reports/`를 추가하여 자동 생성 보고서를 버전 관리에서 제외하거나, 팀의 리뷰 이력으로 커밋을 유지하세요.

---

## 업데이트와 제거

`fec`는 `frontend-craft`의 짧은 명령어입니다. 전역 `fec` 명령어를 설치하지 않았다면 같은 인자를 `npx @bovinphang/frontend-craft@latest` 뒤에 붙여 사용하세요. 예: `npx @bovinphang/frontend-craft@latest update`.

### 업데이트

```bash
fec update                         # 발견된 모든 CLI 관리 설치 업데이트
fec update <runtime> --local        # 로컬 CLI 관리 설치 하나 업데이트
fec update <runtime> --global       # 전역 CLI 관리 설치 하나 업데이트
fec upgrade <runtime> --global      # `upgrade`는 `update`의 별칭
```

### 제거

```bash
fec uninstall                       # 발견된 모든 CLI 관리 설치 제거
fec remove                          # `remove`는 `uninstall`의 별칭
fec uninstall <runtime>             # 특정 runtime 설치 제거
fec remove <runtime>                # 별칭으로 특정 runtime 제거
fec uninstall --global              # 발견된 전역 설치만 제거
fec remove --local                  # 발견된 로컬 설치만 제거
fec uninstall <runtime> --dry-run   # 제거 내용을 미리 보기
fec uninstall <runtime> --force     # 수정된 관리 파일도 제거
```

CLI는 런타임 디렉토리에 `frontend-craft.manifest.json`을 작성합니다. runtime을 지정하지 않으면 `update`가 이 manifest를 자동으로 발견하고 **로컬에서 수정한 파일을 건너뜁니다** — 커스터마이징은 업데이트 후에도 유지됩니다.

`uninstall`/`remove`는 manifest에 기록된 파일만 삭제합니다. 수정된 파일은 기본적으로 건너뛰며, 수정된 관리 파일까지 제거하려는 경우에만 `--force`를 추가하세요. `--force`는 Claude Code Marketplace 설치를 덮어쓰지 않습니다.

**Claude Code Marketplace** 또는 **submodule** 설치의 업데이트 방법은 [docs/runtimes/claude.md](../runtimes/claude.md) · [简体中文](../runtimes/claude.zh-CN.md)를 참조하세요. `/fec-init`은 프로젝트 설정만 초기화하며, 두 번째 플러그인 설치가 아닙니다.

---

## 레거시 Skills CLI

팀이 이미 독립형 [Skills CLI](https://skills.sh/docs/cli)를 사용 중인 경우, [`skills/`](../../skills/) 아래의 워크플로 스킬 패키지만 설치할 수 있습니다:

```bash
npx skills add bovinphang/frontend-craft   # 프롬프트에 따르거나 -g로 전역 설치
npx skills update                          # 최신 버전으로 업데이트
npx skills check                           # 사용 가능한 업데이트 미리보기
```

| CLI                  | 설치 내용                                             |
| -------------------- | ----------------------------------------------------- |
| `npx @bovinphang/frontend-craft` | 스킬 + 런타임 전용 에이전트, 명령어, 훅, 규칙, 템플릿 |
| `npx skills`         | 스킬만 (기존 Skills CLI 워크플로용)                   |

텔레메트리 비활성화: `DISABLE_TELEMETRY=1`. 자세한 내용은 [skills.sh CLI 문서](https://skills.sh/docs/cli) 참조.

---

## 커뮤니티

- [기여 가이드](../../CONTRIBUTING.md) — 개발 환경 설정, PR 체크리스트, 현지화 정책 ([简体中文](../../CONTRIBUTING.zh-CN.md))
- [보안 정책](../../SECURITY.md) — 비공개 취약점 보고 ([简体中文](../../SECURITY.zh-CN.md))
- [행동 강령](../../CODE_OF_CONDUCT.md) — 커뮤니티 표준 ([简体中文](../../CODE_OF_CONDUCT.zh-CN.md))
- [변경 로그](../../CHANGELOG.md) — 릴리스 노트 ([简体中文](../../CHANGELOG.zh-CN.md))
- [프로젝트 구조](../project-structure.md) — 전체 디렉토리 레이아웃 및 파일 책임

---

## 라이선스

[MIT](../../LICENSE) — 자유롭게 사용하고, 필요에 따라 수정하고, 가능하면 기여해 주세요.

---

<div align="center">

**frontend-craft가 팀에 도움이 되었다면, [Star를 눌러주세요](https://github.com/bovinphang/frontend-craft).**

</div>
