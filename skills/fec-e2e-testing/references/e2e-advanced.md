# E2E 高级测试细节

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

## 视觉回归测试

通过截图快照对比检测非预期的 UI 变化。适用于 CSS 重构、设计 Token 更新、组件改版等场景。

### 基础用法

```typescript
import { test, expect } from "@playwright/test";

test("首页布局与基线一致", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // 全页截图对比 — 首次运行自动生成基线
  await expect(page).toHaveScreenshot("homepage-full.png", {
    fullPage: true,
    maxDiffPixels: 100, // 允许的轻微像素差异（抗锯齿等）
  });
});

test("按钮组件视觉一致", async ({ page }) => {
  await page.goto("/components/buttons");
  const submitButton = page.getByTestId("submit-button");
  await expect(submitButton).toHaveScreenshot("submit-button.png");
});
```

### 屏蔽动态内容

时间、随机 ID、第三方广告等动态元素会导致误报，使用 `mask` 屏蔽：

```typescript
await expect(page).toHaveScreenshot("dashboard.png", {
  mask: [
    page.locator(".live-clock"),
    page.locator(".random-id"),
    page.locator(".ad-banner"),
  ],
});
```

### 禁用动画

CSS 动画会导致截图不一致，注入样式禁用动画后再截图：

```typescript
await page.addStyleTag({
  content:
    "*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }",
});
await expect(page).toHaveScreenshot("animated-page.png");
```

### 基线管理

- **首次运行**: `npx playwright test` 失败但自动生成基线到 `tests/` 目录
- **更新基线**: UI 有意变更时 `npx playwright test --update-snapshots`
- **CI 一致性**: 基线必须在与 CI 相同的 OS（Linux/Ubuntu）上生成，字体渲染在 macOS 与 Linux 间存在差异
- **多浏览器**: 每个 project 独立生成基线（Chromium/Firefox/WebKit 渲染结果不同）
- **基线文件**: 纳入 `.gitignore` 或 Git LFS 管理，避免仓库膨胀
