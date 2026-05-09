# Git 提交规范

凡是创建 commit、编写 commit message 或准备提交代码时，都应用本文件。

## Conventional Commits 格式

```
<type>(<scope>): <subject>

[body]

[footer]
```

### type 取值

| type | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `refactor` | 重构（不改变行为） |
| `style` | 代码格式调整（不影响逻辑） |
| `docs` | 文档变更 |
| `test` | 测试相关 |
| `chore` | 构建、工具、依赖等杂项 |
| `perf` | 性能优化 |
| `ci` | CI/CD 配置变更 |

### scope

可选，标明影响范围，如模块名、组件名或功能域：

- `feat(auth): 新增手机号登录`
- `fix(table): 修复排序列未高亮`
- `refactor(api): 统一请求错误处理`

### subject 规范

- 使用祈使句（"增加 xxx" 而非 "增加了 xxx"）
- 不超过 72 个字符
- 不以句号结尾
- 如果影响范围较大，在 body 中详细说明

## 分支命名

- `feature/xxx` — 新功能
- `fix/xxx` — 修复
- `refactor/xxx` — 重构
- `hotfix/xxx` — 紧急修复

## 提交前检查

提交前必须通过：

1. lint
2. type-check
3. 与变更相关的测试

未经用户确认不要直接执行 `git commit`。

## 反模式

- 一个 commit 混合不相关的改动
- commit message 过于笼统（如 "update"、"fix bug"、"wip"）
- 在 commit 中包含调试代码、console.log 或临时 hack
