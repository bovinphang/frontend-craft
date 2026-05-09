---
name: e2e-testing
description: Playwright 与 Cypress E2E 规范，涵盖目录结构、Page Object、用例组织、Playwright 配置、产物与 Trace、CI 集成、不稳定用例治理与关键业务场景。当用户提到 E2E、端到端测试、Playwright、Cypress、集成测试时自动激活。
version: 1.2.0
---

# E2E 测试规范

适用于使用 Playwright 或 Cypress 进行端到端测试的前端项目。下文以 **Playwright** 为主展开（多浏览器、Trace、并行），Cypress 项目在相同原则上做语法映射即可。

## 适用场景

- 编写或维护 E2E 测试
- 配置 Playwright / Cypress 项目
- 设计 Page Object、fixtures 与目录结构
- 将 E2E 接入 CI，并管理报告、截图、Trace、视频
- 治理不稳定用例（flaky）、隔离或跳过高风险流程

## 工具选择

| 工具 | 适用 | 特点 |
|------|------|------|
| **Playwright** | 推荐，新项目优先 | 多浏览器、自动等待、并行、Trace、跨平台、`webServer` 自启 dev |
| **Cypress** | 已有项目或团队熟悉 | 交互式调试、时间旅行、组件测试 |

## 目录结构

### Playwright（推荐布局之一）

可按业务域拆分 spec，夹具与 Page 分层：

```text
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── register.spec.ts
│   ├── features/
│   │   ├── browse.spec.ts
│   │   └── search.spec.ts
│   └── api/                    # 可选：契约/接口级 e2e
│       └── endpoints.spec.ts
├── fixtures/
│   ├── auth.ts
│   └── data.ts
└── pages/                      # Page Object（与 e2e 平级或放在 e2e/pages，团队统一即可）
    ├── ItemsPage.ts
    └── LoginPage.ts
playwright.config.ts
```

也可沿用仓库现有约定（例如根目录 `e2e/`），**保持一致性**比套用某一种目录名更重要。

### Cypress

```text
cypress/
├── e2e/
│   ├── auth/
│   │   └── login.cy.ts
│   └── dashboard/
│       └── dashboard.cy.ts
├── fixtures/
├── support/
│   ├── commands.ts
│   └── e2e.ts
└── pages/                      # Page Object（可选）
```

## Page Object 模式（POM）

- 每个页面或关键流程一个类，**封装 Locator 与操作**；spec 里不写裸选择器字符串。
- 选择器优先 **`data-testid`**，其次 **`getByRole` / `getByLabel`**。
- 导航后可用 `waitForLoadState` 或**等待关键网络响应**，避免拍脑袋固定秒数。

```typescript
import { Page, Locator, expect } from "@playwright/test";

export class ItemsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly itemCards: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId("search-input");
    this.itemCards = page.getByTestId("item-card");
    this.createButton = page.getByTestId("create-btn");
  }

  async goto() {
    await this.page.goto("/items");
    await this.page.waitForLoadState("networkidle");
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.page.waitForResponse((resp) =>
      resp.url().includes("/api/search"),
    );
    await this.page.waitForLoadState("networkidle");
  }

  async itemCount() {
    return this.itemCards.count();
  }
}
```

## 用例结构

- 使用 `test.describe` 分组；`beforeEach` 中完成**登录、进入页面**等共享前置。
- 每个用例断言**用户可见结果**，少断言内部实现。
- 需要留证时可在关键步骤 **`screenshot`**（见下文产物）。

```typescript
import { test, expect } from "@playwright/test";
import { ItemsPage } from "../pages/ItemsPage";

test.describe("商品搜索", () => {
  let itemsPage: ItemsPage;

  test.beforeEach(async ({ page }) => {
    itemsPage = new ItemsPage(page);
    await itemsPage.goto();
  });

  test("按关键词搜索有结果", async () => {
    await itemsPage.search("test");
    expect(await itemsPage.itemCount()).toBeGreaterThan(0);
    await expect(itemsPage.itemCards.first()).toContainText(/test/i);
  });

  test("无结果时展示空态", async ({ page }) => {
    await itemsPage.search("xyznonexistent123");
    await expect(page.getByTestId("no-results")).toBeVisible();
    expect(await itemsPage.itemCount()).toBe(0);
  });
});
```

## Playwright 配置要点

- **`testDir`**：与上文目录一致。
- **CI**：`forbidOnly: !!process.env.CI`，`retries` 在 CI 适当加大，`workers` 在 CI 可降为 1 便于排错。
- **Reporter**：HTML + JUnit（对接 CI）等按需开启。
- **`use`**：`baseURL`、`trace: 'on-first-retry'`、`screenshot` / `video` 仅在失败时保留可节省空间。
- **`projects`**：Chromium / Firefox / WebKit + 常用移动端设备。
- **`webServer`**：本地先起 dev/preview，再跑测；`reuseExistingServer` 在本地开发时复用已有进程。

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["junit", { outputFile: "playwright-results.xml" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

失败后用 **`npx playwright show-trace`** 打开 Trace 压缩包（具体路径以命令行输出与 `playwright-report` 为准）。

## 不稳定用例（Flaky）治理

### 隔离与跳过

- **`test.fixme`**：已知损坏或严重 flaky，挂工单说明原因。
- **`test.skip(condition, reason)`**：例如仅在 CI 不稳定时跳过并关联 issue。

```typescript
test("复杂搜索（待修）", async () => {
  test.fixme(true, "不稳定 — Issue #123");
});

test("CI 下暂跳过", async () => {
  test.skip(!!process.env.CI, "CI  flaky — Issue #123");
});
```

### 定位不稳定

```bash
npx playwright test path/to/spec.ts --repeat-each=10
npx playwright test path/to/spec.ts --retries=3
```

### 常见原因与改法

| 问题 | 避免 | 推荐 |
|------|------|------|
| 竞态 | 假设元素已可点 | 使用 **Locator** 自动等待后再 `click()` |
| 网络时序 | `waitForTimeout(5000)` | `waitForResponse` / `expect` 轮询到条件满足 |
| 动画 | 动画中途点击 | `waitFor({ state: 'visible' })` 或关闭动效测试配置 |

## 产物管理

- **截图**：整页、单元素、失败时自动截图（由 `screenshot` 配置与手动 `page.screenshot` 配合）。
- **Trace**：推荐 `on-first-retry`，失败重试时保留完整上下文。
- **视频**：`retain-on-failure` 等与仓库磁盘、CI 缓存策略平衡。

自定义路径时注意将目录纳入 **`.gitignore`**，由 CI **upload-artifact** 上传。

## CI 集成（示例）

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          CI: true
          BASE_URL: ${{ vars.STAGING_URL }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

Cypress：固定 `CYPRESS_baseUrl` 或配置文件中的 `baseUrl`，失败截图/视频同样建议上传 artifact。

## E2E 报告模板（Markdown）

输出或归档测试报告时可采用下列结构，便于复盘：

```markdown
# E2E 测试报告

**日期：** YYYY-MM-DD HH:mm  
**耗时：** X 分 Y 秒  
**结果：** 通过 / 失败

## 摘要

- 总计 X | 通过 Y | 失败 Z | 不稳定/跳过 说明

## 失败用例

### 用例名

- **文件：** `tests/e2e/xxx.spec.ts:行号`
- **错误：** 简述断言或超时信息
- **截图/Trace：** 路径或 artifact 名称
- **建议修复：** 可执行结论

## 产物

- HTML 报告：`playwright-report/index.html`
- Trace / 视频 / 截图：CI artifact 或本地 `test-results/`
```

## 特殊场景（按需）

### Web3 / 钱包注入（Playwright）

在 **`page.goto` 之前**通过 `context.addInitScript` 注入 mock，避免依赖真实插件：

```typescript
test("连接钱包", async ({ page, context }) => {
  await context.addInitScript(() => {
    (window as unknown as { ethereum?: unknown }).ethereum = {
      isMetaMask: true,
      request: async ({ method }: { method: string }) => {
        if (method === "eth_requestAccounts")
          return ["0x1234567890123456789012345678901234567890"];
        if (method === "eth_chainId") return "0x1";
        return null;
      },
    };
  });

  await page.goto("/");
  await page.getByTestId("connect-wallet").click();
  await expect(page.getByTestId("wallet-address")).toContainText("0x1234");
});
```

链 ID、账户列表与业务契约保持一致即可。

### 金融或高风险操作

- **禁止**在真实生产环境执行真实资金操作；使用 **staging、mock 或 `test.skip`**。
- 断言**预览金额、成功态**与**关键接口 200** 后再结束用例，超时给足（如链上确认场景）。

```typescript
test("下单预览与成功态", async ({ page }) => {
  test.skip(process.env.NODE_ENV === "production", "生产环境跳过真实交易");

  await page.goto("/markets/demo");
  await page.getByTestId("position-yes").click();
  await page.getByTestId("trade-amount").fill("1.0");

  const preview = page.getByTestId("trade-preview");
  await expect(preview).toContainText("1.0");

  await page.getByTestId("confirm-trade").click();
  await page.waitForResponse(
    (resp) => resp.url().includes("/api/trade") && resp.status() === 200,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId("trade-success")).toBeVisible();
});
```

## 测试编写原则

- 描述**业务场景**，不测实现细节；单用例一条主路径，可独立运行。
- `beforeEach` / fixtures 做登录与数据准备；敏感操作走 mock 或测试专用接口。
- 与 `templates/rules/testing.md` 中的单元/集成校验顺序配合：**E2E 覆盖关键旅程**，细粒度逻辑交给单测。

## 视口与设备

- 关键流程至少覆盖：桌面、平板、移动（或通过 `projects` 选代表性设备）。
- 响应式可抽样断点，不必穷举。

## 强约束

- 禁止依赖 **`sleep`/固定 `setTimeout`** 当主要同步手段；优先断言与 Playwright 自动等待。
- 不在生产环境跑真实 E2E；避免在 E2E 中断言像素级样式。
- 失败必须能**靠截图、Trace、视频**定位，CI 中 **`if: always()`** 上传报告。

## 与子代理的配合

需要**实际执行** `playwright test` / Cypress、反复验证 flaky、整理 CI artifact，并可选写入运行摘要时，可委托 **`frontend-e2e-runner`** 子代理。摘要文件建议为 `reports/e2e-summary-YYYY-MM-DD-HHmmss.md`；详细模式与配置仍以本 Skill 为准。
