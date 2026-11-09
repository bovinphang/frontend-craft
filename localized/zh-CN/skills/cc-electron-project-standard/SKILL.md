---
name: cc-electron-project-standard
description: 用于 Electron 的 main/preload/renderer 边界、contextBridge IPC、sender 校验、sandbox、导航策略、原生模块、生命周期与桌面打包；没有 Electron 的 Node HTTP 服务不属于本专项。
---

# Electron 应用工程

定位拥有任务的应用及 main、preload、renderer 入口；JavaScript/TypeScript 不限定浏览器或服务角色。

1. 读取实际 Electron/Node/Chromium 版本、锁、打包工具及平台，保持既有模块和构建约定。
2. 定义狭窄桥接契约：每个 channel 一个明确操作，校验参数并稳定返回结果；main 在执行权限操作前核对真实 sender/frame。
3. 联合检查 `contextIsolation`、sandbox、Node integration、preload、协议/CSP、导航及新窗口；隔离的 renderer 仍是不可信 IPC 输入来源。
4. 明确 handler、监听、窗口、worker 及原生资源的启动/退出所有者；按实际分发产物检查原生模块 ABI、重建和 ASAR/资源路径。
5. 使用[实践清单](references/practice.md)和[完整最小案例](examples/minimal/README.md)，其中包括三进程契约及显式缺陷版本。
6. 遵循[验证边界](references/verification.md)：先验证拒绝 sender/参数，再验证真实进程/UI、平台包、更新及签名。

交付进程边界、桥接契约、安全决定、实际验证及平台缺口。Node handler 单测不证明 Electron sandbox 生效或应用签名完成。

## 工程实践

按当前任务读取[本入口工程细则](references/engineering-practices.md)，再按链接选择公共原则。规则级别与例外以实际项目契约为准；不因产品前后端标签限制语言或职责。
