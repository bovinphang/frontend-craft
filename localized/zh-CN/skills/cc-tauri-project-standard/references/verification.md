# 验证边界

在[最小应用目录](../examples/minimal/README.md)执行：

```sh
cargo test --manifest-path core/Cargo.toml --offline --locked --features defective
cargo test --manifest-path core/Cargo.toml --offline --locked
```

首条命令故意选择缺陷函数，应在相同的目录穿越/绝对路径断言中失败；正常版本应同时通过合法文件行为。Unix 另测符号链接越界。编译器或依赖缺失属于 MISSING，不能当业务 RED；构建产物放在分发目录外。

| 层次 | 证据与限制 |
| --- | --- |
| Rust command core | 真实 Cargo 测试证明非法路径不能返回根外数据，无需 GUI。 |
| Tauri 集成 | 使用已准备的 Tauri 2 工具链启动应用，通过真实 invoke 检查允许/拒绝的窗口与 capability；核心单测不证明权限激活。 |
| 桌面发布 | 在每个目标平台验证 UI 流程、bundle、安装更新、清理及签名，不能用文本检查替代。 |

2026-11-08 开发证据：Windows Rust 1.96.0 的核心测试已观察真实 RED→GREEN。Tauri 依赖构建、WebView 权限激活、GUI、签名及平台包均为 **NOT RUN**。系统库或依赖缺失须如实记录，不隐式下载。
