---
name: fec-security-review
description: Use when reviewing frontend security risks such as XSS, CSRF, sensitive data exposure, unsafe DOM APIs, untrusted user input, authentication/token handling, payment flows, file upload, CSP, dependency risk, or third-party scripts; Chinese triggers include 安全审查, 安全检查.
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

### DOMPurify 深度配置

对于富文本编辑器、用户评论等需要保留部分 HTML 的场景：

```ts
import DOMPurify from 'dompurify';

// 基础净化 — 移除所有危险标签和属性
const clean = DOMPurify.sanitize(dirtyHtml);

// 自定义白名单 — 仅允许安全标签和属性
const clean = DOMPurify.sanitize(dirtyHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'title'],
  // 禁止所有协议，仅允许 http/https/mailto
  ALLOWED_URI_REGEXP: /^(https?|mailto):/i,
  // 移除所有事件处理器 (onclick, onerror 等)
  ADD_ATTR: [],
});

// React 中使用
export const UserContent = ({ html }: { html: string }) => {
  const cleanHtml = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};
```

### 净化策略

| 场景       | 策略                   | 说明                                             |
| ---------- | ---------------------- | ------------------------------------------------ |
| 纯文本展示 | 框架自动编码           | React/Vue 默认转义，无需额外处理                 |
| 简单富文本 | DOMPurify + 严格白名单 | 仅允许 b/i/em/strong/a 等                        |
| 复杂富文本 | DOMPurify + 宽松白名单 | 允许图片、列表、标题，但禁止 script/style/event  |
| Markdown   | 解析器内置净化         | 使用 remark/rehype 等安全的 Markdown 解析器      |
| 用户 URL   | 协议白名单             | 仅允许 http/https/mailto，禁止 javascript:/data: |

### 安全重定向

URL 参数中的跳转目标必须校验，防止开放重定向攻击：

```ts
function safeRedirect(url: string): string {
  // 仅允许相对路径，且不能以 // 开头（协议相对 URL）
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  return "/dashboard"; // 默认回退
}
```

## CSP（内容安全策略）

CSP 是 XSS 的第二道防线。即使 XSS 注入成功，严格的 CSP 也能阻止恶意脚本执行。

### HTTP Header 配置

由服务端（Nginx/Express/Next.js middleware）设置：

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.example.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;
```

### 指令说明

| 指令                               | 推荐值 | 说明                                          |
| ---------------------------------- | ------ | --------------------------------------------- |
| `default-src 'self'`               | 必须   | 默认回退策略                                  |
| `script-src 'self'`                | 必须   | 仅允许同源脚本                                |
| `style-src 'self' 'unsafe-inline'` | 推荐   | 内联样式通常无法避免（CSS-in-JS）             |
| `frame-ancestors 'none'`           | 必须   | 防止 Clickjacking（页面被嵌入 iframe）        |
| `object-src 'none'`                | 必须   | 禁止 `<object>`/`<embed>`（Flash 等漏洞入口） |
| `base-uri 'self'`                  | 推荐   | 防止 `<base>` 标签劫持                        |
| `form-action 'self'`               | 推荐   | 表单仅能提交到同源                            |
| `upgrade-insecure-requests`        | 推荐   | 自动升级 HTTP 请求为 HTTPS                    |

### 避免 `'unsafe-inline'` 和 `'unsafe-eval'`

这两个指令大幅削弱 CSP 防护。如果必须内联脚本，使用 Nonce：

```html
<!-- 服务端为每个请求生成唯一 nonce -->
<script nonce="r4nd0m">
  console.log("安全的内联脚本");
</script>

<!-- CSP 中声明信任该 nonce -->
<!-- script-src 'self' 'nonce-r4nd0m' -->
```

### Report-Only 模式

部署严格策略前，先用 `Content-Security-Policy-Report-Only` 头测试，记录违规但不拦截：

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report;
```

### 前端 CSP 检查

在 CI 或本地开发中验证 CSP 策略：

```bash
# 使用 Google CSP Evaluator 检查
# https://csp-evaluator.withgoogle.com/

# 或在 Playwright E2E 中检查响应头
test('CSP header 存在', async ({ request }) => {
  const response = await request.get('/');
  const csp = response.headers()['content-security-policy'];
  expect(csp).toContain("default-src 'self'");
  expect(csp).not.toContain("'unsafe-eval'");
});
```

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
