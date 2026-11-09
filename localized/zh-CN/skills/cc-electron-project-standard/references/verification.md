# 验证边界

在[案例目录](../examples/minimal/README.md)运行：

```sh
node --test boundary.test.cjs
```

使用宿主 shell 将 `CRAFT_EXAMPLE_DEFECTIVE` 设为 `1` 时，同一文件选择明确标注的无保护 handler，应出现真实 sender/schema 断言失败。设为 `0` 后重跑。Electron 缺失或启动错误不能充当业务 RED。

| 层次 | 证据与限制 |
| --- | --- |
| IPC handler | 真实 Node 测试拒绝另一个 WebContents、不可信 frame 和非法参数，副作用计数保持为空。 |
| Electron 进程 | 通过已有 Electron 启动，调用 preload API，尝试越权 frame/导航，并检查真实隔离与 sandbox。 |
| 平台发布 | 逐平台检查原生模块与资源路径、安装更新卸载及签名。 |

2026-11-08 开发证据：Node 24.14.1 的 handler 测试已观察 RED→GREEN。Electron 二进制/GUI、真实进程 sandbox、原生模块重建、签名和发布包均为 **NOT RUN**。必须分别记录缺失工具与环境，不报告为桌面全量通过。
