---
name: fec-component-testing
description: Use when writing or reviewing frontend component tests with React Testing Library, Vue Test Utils, user-event, accessible queries, mocks, interaction states, regression coverage, or component contracts; Chinese triggers include 组件测试, 组件单测, 交互测试.
---

# 组件测试

## Purpose

用贴近用户行为的测试验证组件契约，减少重构和 UI 交互回归。

## When to Use

- 新增或修改表单、弹窗、列表、导航、权限态等交互组件。
- 修复前端 bug，需要先补回归测试。
- 组件包含异步加载、错误态、空态或条件渲染。
- 不用于覆盖完整业务链路；跨页面流程优先使用 `fec-e2e-testing`。

## Procedure

### 1. 优先按用户可感知行为测试

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBox } from "./SearchBox";

test("submits the entered keyword", async () => {
  const user = userEvent.setup();
  const onSearch = vi.fn();

  render(<SearchBox onSearch={onSearch} />);

  await user.type(screen.getByRole("searchbox", { name: /keyword/i }), "orders");
  await user.click(screen.getByRole("button", { name: /search/i }));

  expect(onSearch).toHaveBeenCalledWith("orders");
});
```

### 2. Vue 组件使用可访问查询或明确文本断言

```ts
import { mount } from "@vue/test-utils";
import UserMenu from "./UserMenu.vue";

test("emits logout when the logout item is clicked", async () => {
  const wrapper = mount(UserMenu, {
    props: { userName: "Ada" },
  });

  await wrapper.get('[data-testid="logout-button"]').trigger("click");

  expect(wrapper.emitted("logout")).toHaveLength(1);
});
```

优先使用角色、标签和可见文本；仅在没有稳定语义时使用 `data-testid`。

### 3. 控制 mock 边界

```ts
vi.mock("../api/users", () => ({
  fetchUsers: vi.fn(async () => [{ id: "1", name: "Ada" }]),
}));
```

- mock 网络、时间、路由和浏览器 API。
- 不 mock 被测组件的内部函数。
- 对设计系统基础组件只做轻量 mock，保留可访问行为。

### 4. 覆盖关键状态

每个复杂组件至少覆盖：

- 默认渲染。
- 用户交互和回调。
- loading / empty / error。
- 权限或禁用态。
- 键盘交互和焦点行为（适用时）。

### 5. 保持测试可维护

```ts
function setup() {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ProfileForm onSubmit={onSubmit} />);
  return { user, onSubmit };
}
```

将重复渲染逻辑放入 `setup`，但不要隐藏测试的核心操作和断言。

## Constraints

- 避免测试实现细节，例如内部 state 名称、私有函数调用、DOM 层级快照。
- 不把 snapshot 作为交互组件的主要断言；它只能辅助检查稳定静态输出。
- 异步断言使用 `findBy*` 或 `waitFor`，不要用固定延迟。
- 测试名称应描述用户场景，而不是函数名。
- 组件测试不能替代 E2E；路由、真实浏览器兼容和跨页流程仍需 E2E。

## Expected Output

产出与组件同目录或项目约定目录下的测试文件，覆盖核心交互、状态和回归场景。验证时运行项目现有 test 命令，确认失败信息能定位到用户行为或组件契约。

## Related Agent

- [frontend-code-reviewer](../../agents/frontend-code-reviewer.md) - 评审组件测试是否覆盖关键风险和避免脆弱断言。
- [frontend-e2e-runner](../../agents/frontend-e2e-runner.md) - 将跨页面关键路径提升为 E2E 用例。
