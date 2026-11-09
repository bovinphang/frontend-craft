# 最小 Electron IPC 应用

本目录包含 main、preload、renderer、安全协议资源、IPC 边界及测试，不依赖相邻 Skill。

执行 node --test boundary.test.cjs 测试正常 handler。将 CRAFT_EXAMPLE_DEFECTIVE 设为 1 时，同一断言选择显式缺陷函数并应失败；应用只使用正常版本。

所属环境已准备维护中的 Electron 后，可在此目录运行既有 electron .。可选 peer 只表示接口基线，不自动安装或提供锁定的发布环境。应用通过 app://craft 暴露白名单资源，只提供 desktop.setTitle 并拒绝任意资源、窗口及导航。

Node handler 测试不是 Electron 进程运行的证明。发布前按[验证边界](../../references/verification.md)检查实际隔离、IPC 授权和目标平台产物。
