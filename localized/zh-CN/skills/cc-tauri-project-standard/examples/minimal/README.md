# 最小 Tauri 文档应用

本目录独立包含纯 Rust 的 core、Tauri 2 command、应用命令权限生成、main capability 和实际调用它的 UI，不依赖相邻 Skill。

按[验证说明](../../references/verification.md)运行 core 测试。显式启用 defective 时选择缺陷函数，同一断言应失败；应用不得启用此特性。

现有 Tauri 2 依赖及平台前置条件准备好后，在此目录执行 cargo run --manifest-path src-tauri/Cargo.toml --offline。应用在自身数据目录创建 documents/hello.txt，按钮通过受保护核心读取；renderer 不提供可信根。

框架依赖应由所属项目的正常流程解析并锁定后再主张可复现构建；core 的独立锁不覆盖 GUI 依赖图。核心测试只证明读取边界，权限激活、拒绝窗口和 GUI 发布须通过真实环境验证。
