---
name: security-review
description: 前端代码安全审查，检测 XSS、CSRF、敏感数据泄露、不安全的用户输入处理和依赖风险，并将报告保存为 Markdown 文件。当用户要求安全检查、安全审查，或代码涉及用户输入、认证、支付、文件上传等敏感操作时自动激活。
version: 1.2.0
---

# 前端安全审查

在以下场景使用该 Skill：

- 审查涉及用户输入、表单提交、文件上传的代码
- 审查认证、鉴权、Token 管理相关逻辑
- 审查涉及第三方脚本加载或动态内容渲染的代码
- 代码上线前的安全检查
- 评审 PR 中的安全隐患

## XSS 防护

### 必须检查

- `dangerouslySetInnerHTML`（React）和 `v-html`（Vue）的使用必须有明确理由和输入净化
- 用户输入不得直接插入 DOM、`innerHTML`、`document.write`
- URL 参数不得直接用于页面渲染
- 动态生成的 `<script>` 标签必须审查来源

### 净化规则

- 使用 DOMPurify 等库净化 HTML 内容
- URL 必须校验协议（禁止 `javascript:`、`data:` 等）
- SVG 内容需要净化（可包含脚本）

## 敏感数据

### 禁止

- 在前端代码中硬编码 API Key、Secret、密码
- 在 `localStorage` / `sessionStorage` 中存储明文 token 或密码
- 在 URL query 参数中传递 token 或密码
- 在 console.log 中输出敏感信息
- 在错误上报中包含用户隐私数据

### 要求

- Token 存储优先使用 httpOnly cookie
- 敏感操作（删除、支付、权限变更）必须有二次确认
- 表单自动填充需考虑 `autocomplete` 属性设置

## CSRF 防护

- 变更操作（POST / PUT / DELETE）必须携带 CSRF token
- 关键操作不使用 GET 请求
- 检查后端是否正确校验 `Origin` / `Referer`

## 依赖安全

- 定期审查第三方依赖的安全公告
- 禁止从非官方 CDN 加载脚本（无 SRI 校验）
- 动态加载的第三方脚本必须设置 `integrity` 属性

## 输入校验

- 前端校验是用户体验，不是安全边界——后端必须二次校验
- 文件上传必须校验类型、大小，禁止仅靠扩展名判断
- 富文本输入必须净化
- 正则校验需注意 ReDoS 风险

## 审查输出格式

```
# 安全审查报告

> 生成时间: YYYY-MM-DD HH:mm
> 评审工具: frontend-craft

## 🔴 高危 (N项)
- **[文件:行号]** 风险描述 → 修复建议

## 🟡 中危 (N项)
- ...

## 🔵 低危 / 建议 (N项)
- ...

## ✅ 已通过的安全检查
- ...

**整体安全等级**: 安全 / 存在风险 / 高危需修复
```

## 报告文件输出

审查完成后，必须将报告内容使用 Write 工具保存为 Markdown 文件：

- 目录：项目根目录下的 `reports/`（如不存在则创建）
- 文件名：`security-review-YYYY-MM-DD-HHmmss.md`（使用当前时间戳）
- 保存后告知用户报告文件路径

## 强约束

- 不要为了方便开发而绕过安全机制
- 不要依赖前端校验作为唯一安全防线
- 不要信任任何来自客户端的数据
- 发现高危问题时必须标记为阻塞合并

## 与子代理的配合

需要结合 **`npm audit`**、前端向 **OWASP** 逐项排查、**Grep** 高危 DOM/API 模式，并明确与 **`frontend-code-reviewer`** 分工（质量 vs 威胁建模）时，可委托 **`frontend-security-reviewer`** 子代理。报告文件名仍为 `security-review-YYYY-MM-DD-HHmmss.md`，分级格式与本 Skill 保持一致。
