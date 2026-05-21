# Skill 模板规范

> 所有 Skill 必须遵循 agentskills 结构：目录名、frontmatter `name` 和公开 skill id 保持一致；frontmatter 只保留 `name` 与 `description`。

---

## 目录结构

```text
skills/fec-[主题]/
  SKILL.md
  references/   # 可选：按需加载的详细规范、示例或清单
  scripts/      # 可选：需要确定性执行的脚本
  assets/       # 可选：输出会用到的模板或资源
```

## Frontmatter

```yaml
---
name: fec-[主题]
description: Use when ...
---
```

- `name` 必须等于父目录名。
- `description` 是主要触发依据，必须写清"做什么"和"什么时候用"。
- 不要在 frontmatter 中加入 `version`、`metadata` 或触发说明以外的字段。
- 使用 `Use when ...` 开头，并包含必要的英文/中文关键词。

---

## 模板结构

```markdown
# Skill: [Skill 名称]

## Purpose

一句话说明这个 Skill 解决什么问题，面向什么场景。

## Procedure

分步骤实现指南，每步包含代码示例。

### 1. [步骤标题]

说明 + 代码示例

### 2. [步骤标题]

说明 + 代码示例

...

## Constraints

- 边界条件 / 注意事项 1
- 反模式 / 陷阱 1
- 性能 / 安全约束 1

## Expected Output

明确产出物是什么，如何验证。

## Related Skills / Boundary

- `fec-related-skill` — 说明什么时候应切换到该 skill。
```

---

## 编写规范

### Purpose

- 一句话，不超过 30 字
- 说明解决什么问题，而非如何解决
- 示例: "管理表单状态、校验和提交，避免受控组件的性能问题"

### Trigger and Boundary

- 触发条件主要写在 frontmatter `description`，正文不要再重复长篇 `When to Use`。
- `description` 必须包含 should-trigger 场景和近邻 should-not-trigger 边界。
- 对容易重叠的 skill，在正文添加 `Related Skills / Boundary`，说明什么时候应切换到专项 skill。
- 示例: `Use when building substantial forms with React Hook Form and Zod. Do not use for trivial 1-3 field forms without validation.`

### Procedure

- 按实施顺序分步骤，每步有编号和标题
- 每个步骤包含：
  - 1-2 句说明
  - 可运行的代码示例（TypeScript 优先）
  - 关键参数的注释说明
- 涉及安装的步骤先给出安装命令
- 代码示例遵循项目已有的编码规范
- 优先展示完整的最小可运行示例，而非片段
- `SKILL.md` 只保留每次使用都需要的核心流程；接近 **180-220 行**时优先拆到 `references/`。
- 长代码、框架变体、进阶配置、评估清单放入一层 `references/` 文件，并从 `SKILL.md` 明确说明何时加载。

### Constraints

- 列出 3-6 条关键约束
- 包括：性能陷阱、安全注意、反模式、兼容性限制
- 每条简洁，必要时附简短解释
- 示例:
  - 虚拟列表中的项目不在 DOM 中直到滚动到，搜索引擎可能无法索引

### Expected Output

- 明确说明产出物是什么
- 如何验证产出是否正确
- 1-3 句话

---

## 代码示例约定

- 使用 TypeScript（.tsx / .ts），除非场景明确要求 JavaScript
- 遵循 React 18+ / Vue 3+ 现代语法
- 变量和函数名语义化，避免缩写（除非是行业约定如 `ctx`、`ref`）
- 关键行添加行内注释说明"为什么"而非"是什么"
- 安装命令使用 `npm install`（不锁包管理器）

---

## Progressive Disclosure

- `SKILL.md`：触发后每次都需要的操作顺序、约束、边界和最小示例。
- `references/`：按需加载的详细示例、框架变体、配置模板和长检查清单。
- 避免把同一说明同时写在 `SKILL.md` 和 reference 中；正文只做导航。
- reference 只放一层，链接必须使用相对路径。

---

## 触发评估

每个 skill 维护正负样例，用于 description 优化：

- `should_trigger`：8-10 条真实用户问法。
- `should_not_trigger`：8-10 条近邻误触发问法。
- 高重叠 skill 优先覆盖 React/Vue/Next/Nuxt、review/security/a11y、component/E2E/Storybook、legacy/migration。

---

## Agent 关联

如果 Skill 有对应的 Agent，在文件末尾添加：

```markdown
## Related Agent

- [agent-name](../agents/agent-name.md) — 关联说明
```

---

## 文件命名

- 目录格式: `skills/fec-{主题}/`
- 必备文件: `skills/fec-{主题}/SKILL.md`
- 使用小写和连字符
- 示例: `skills/fec-storybook-component-doc/`、`skills/fec-list-virtualization/`
