# Electron 实践

- 定位锁定版本及 main、preload、renderer 产物。示例使用 Electron 30+ 已有接口，不建议部署旧版；维护版本选择遵循实际项目升级策略。
- 通过 `contextBridge` 暴露逐项操作，不向 renderer 传递完整 `ipcRenderer`、任意 channel、shell 或无约束文件系统访问。
- main 同时核验 WebContents 身份、主 frame、精确可信文档 URL 和参数 schema。`file:` 内容不能仅凭 origin 授权；优先使用受限安全自定义协议。
- 显式启用隔离和 sandbox，禁用 renderer 的 Node integration；限制导航、新窗口、协议路径、权限及 CSP，不加载具有本地权限的远程代码。
- [边界 handler](../examples/minimal/boundary.cjs)先验证有界标题再执行副作用。[preload](../examples/minimal/preload.cjs)仅暴露一个方法，[main](../examples/minimal/main.cjs)只提供精确白名单静态资源。
- 跟踪窗口、handler、监听的归属及清理；发布前检查 worker、主进程阻塞、原生模块 ABI、产物路径和更新信任。

## 官方参考

2026-11-08 核验；官方页面跟随当前 Electron，实际行为须匹配已安装版本：

- [进程模型](https://www.electronjs.org/docs/latest/tutorial/process-model)。
- [上下文隔离与逐操作 IPC](https://www.electronjs.org/docs/latest/tutorial/context-isolation)。
- [contextBridge 接口](https://www.electronjs.org/docs/latest/api/context-bridge)。
- [sender、sandbox、协议及导航安全](https://www.electronjs.org/docs/latest/tutorial/security)。

最小案例的 Node 边界测试没有外部运行时依赖；可选 Electron peer 由已准备的宿主环境提供，测试不会自动下载 Electron。
