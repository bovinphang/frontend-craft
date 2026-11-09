# Tauri 实践

- 先读 `tauri.conf.json`、`Cargo.toml`、锁、`build.rs`、capabilities、permissions 和 Web 构建配置，在混合仓库中明确 UI/core 对应关系。
- Tauri 2 自定义应用 command 同时检查 `AppManifest::commands`、权限生成和 `invoke_handler`。仅存在 capability 文件不代表注册的应用命令已受限；检查实际选中的 capability、重叠授权、窗口 label 和远程访问。
- Rust 接收有界类型输入，校验路径及业务授权，返回稳定公开错误并明确序列化契约。可信根不能来自 renderer。[核心案例](../examples/minimal/core/src/lib.rs)以应用拥有的根执行真实路径包含检查。
- 示例假设目录由应用控制；先 canonicalize 再 open 不能防御本地攻击者并发替换祖先目录。存在该威胁时应采用平台句柄或相对目录句柄打开机制。
- 使用尽量小的 `State`，明确池、任务和文件的所有者与退出释放顺序。按实际运行时和工作量决定异步/阻塞边界，不阻塞 UI，不跨 await 持有不适当的锁。
- 分别检查插件、sidecar、命令参数、CSP 和导航权限；新窗口不能悄悄继承宽泛授权。
- 保持目标平台配置。Linux 系统库、Windows WebView2、macOS 签名/entitlements 及 updater 签名需要各自真实环境证据。

## 官方版本参考

2026-11-08 核验 Tauri **2** 文档；版本敏感接口必须匹配工程锁定的 minor 与插件版本：

- [命令与调用契约](https://v2.tauri.app/develop/calling-rust/)。
- [能力与应用命令权限生成](https://v2.tauri.app/security/capabilities/)。
- [权限定义](https://v2.tauri.app/security/permissions/)。
- [运行时权限判定](https://v2.tauri.app/security/runtime-authority/)。

案例将纯 Rust core 拆为独立 crate，以便离线验证边界，不把核心测试冒充 Tauri 运行时或 GUI 验证。
