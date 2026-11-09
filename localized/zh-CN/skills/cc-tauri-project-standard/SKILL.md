---
name: cc-tauri-project-standard
description: 用于 Tauri 应用的 Rust command、WebView IPC 契约、capabilities 与 permissions、托管状态、桌面生命周期和平台构建发布；没有 Tauri 的普通 Rust 库不属于本专项。
---

# Tauri 应用工程

定位拥有任务的 Web 应用及 `src-tauri` crate。UI 与 Rust 核心是应用角色，不受提供本能力的前后端产品名称限制。

1. 读取实际 Tauri/API/plugin 版本、两端锁文件、配置及支持平台。区分 v1/v2 权限模型，保持既有工具链。
2. 将每次 invoke 对应到 Rust command、校验后的输入、公共结果/错误及资源所有者。文件和进程权限留在核心，只开放狭窄操作。
3. 联合检查注册命令、应用命令权限生成、capabilities、窗口/WebView label 及远程来源；权限配置不能代替业务输入校验。
4. 明确托管状态生命周期、阻塞工作的界限、取消及退出；检查跨 await 的锁和事件监听清理。
5. 使用[实践清单](references/practice.md)及[最小应用](examples/minimal/README.md)，本包包含独立完成专项所需的本地契约参考。
6. 遵循[验证边界](references/verification.md)：先验证拒绝输入时无越界结果，再单独测试真实 WebView/权限激活、目标平台产物和签名。

交付 UI/core 子工程范围、invoke 契约、权限决定、实际命令结果及未验证平台。源码检查或核心单测不能证明桌面发布成功。

## 工程实践

按当前任务读取[本入口工程细则](references/engineering-practices.md)，再按链接选择公共原则。规则级别与例外以实际项目契约为准；不因产品前后端标签限制语言或职责。
