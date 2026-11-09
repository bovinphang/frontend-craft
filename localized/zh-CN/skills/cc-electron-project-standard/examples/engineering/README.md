# Handler生命周期 — EP-IPC-01

复制到独立可写目录，以CRAFT_ENGINEERING_DEFECTIVE=1/0运行node --test --test-reporter=tap ipc-lifecycle.test.cjs。PowerShell设$env:CRAFT_ENGINEERING_DEFECTIVE，POSIX可在命令前赋值。默认受保护，Node22+即可，无Electron下载、父源码或兄弟示例依赖。

真实async handler校验发送者/frame/精确文档及有界输入，拥有AbortController，准备后再查寿命/取消/信任才同步commit。可控Promise故意忽略取消，测试真实关闭/取消后的零commit、允许及拒绝调用。prepare须无特权，commit是main拥有的同步操作；异步或已提交外部写需独立生命周期/事务契约，取消不回滚，也未证明并发活跃调用顺序。

真实应用应接线到窄ipcMain操作及窗口生命周期；既有minimal文件演示另一路接线。Node单元测试不激活GUI、sandbox、隔离、权限、签名或打包，这些仍NOT RUN，需目标环境实证。日志置于源码外。
