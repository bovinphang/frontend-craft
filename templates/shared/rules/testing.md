# 测试与校验规则

凡是新增、修改、重构或评审代码时，都应用本文件。

## 校验顺序

优先按以下顺序执行：

1. lint
2. type check
3. unit test
4. build

优先使用仓库已有脚本。
如果命令不确定，先检查 `package.json`。

## 改动校验原则

- 先修复范围最小且正确的问题
- 每次关键修复后重新执行受影响的命令
- 不要盲目压掉报错或关闭规则
- 不要为了通过检查而降低类型安全
- 不要因为一个局部测试失败就重写无关模块

## 测试要求

新增或修改行为时，考虑是否需要覆盖以下内容：

- 组件渲染
- 交互行为
- 状态切换
- 边界场景
- loading / empty / error 状态
- 与可访问性相关的关键交互

如果没有补测试，需要说明原因。

## 代码评审输出风格

评审代码时，返回：

- 总体评估
- 必修问题
- 建议优化
- 可选优化项
- 风险等级

结论要具体且可执行。

## E2E 测试规则

使用 Playwright 或 Cypress 时：

- 遵循 **Page Object**，spec 内不写裸选择器；优先 **`data-testid`**，其次 **`role` / `label`**
- 用 **`test.describe` + `beforeEach`** 组织场景，单用例可独立运行、不依赖执行顺序
- 禁止用固定 **`sleep`** 当主要同步手段；用 **Locator 自动等待**、`expect`、`waitForResponse` 等
- Playwright：**`playwright.config.ts`** 中配置 `baseURL`、CI 下 `retries`/`workers`、`trace`/`screenshot`/`video`、**`webServer`** 与多 **`projects`（含移动端）**
- 关键流程至少覆盖桌面、平板、移动端视口（或等价 device 项目）
- **不稳定用例**：`test.fixme` / `test.skip` 需写原因与 issue；用 `--repeat-each` 辅助定位 flaky
- 失败时保留 **截图、Trace、视频**，CI 用 **artifact** 上传 HTML 报告与产物
- 高风险/资金类流程：**勿在生产跑真实 E2E**；staging 或 mock，必要时 `test.skip`

详细模式与示例见插件 **`fec-e2e-testing`** skill。

## 重构规则

进行重构时：

- 除非任务明确要求改行为，否则保持行为一致
- 说明可能的迁移风险
- 优先做渐进式修改，而不是大范围重写
- 总结改动文件、执行过的命令和剩余风险
