# React 异步状态所有权 — EP-UI-01

本例用 Testing Library 和 JSDOM 渲染真实 React 组件。手动控制 A/B 完成顺序，验证晚到的 A 不覆盖 B；卸载时验证本组件拥有的 signal 已取消。不依赖定时器或真实网络排序。设置 `CRAFT_ENGINEERING_DEFECTIVE=1` 会移除两种保护并触发断言失败；默认实现具备保护。

在本目录显式执行 `pnpm install --frozen-lockfile` 后运行 `pnpm test`。将缺陷环境变量设为 `1` 观察反例，设为 `0` 验证修复。仓库维护时在产品根目录执行 `pnpm run verify:engineering -- --prepare`，得到隔离准备环境与配对日志；后续复验不带 `--prepare`。常规仓库测试不会安装样例依赖，源文件与缓存分离。

精确依赖和锁仅属于本例。Node >=22.18、React/DOM 19.3.1、Testing Library React 16.3.3/DOM 10.4.2 和 JSDOM 29.1.1 是兼容的样例目标，不要求项目升级。JSDOM 31 要求比本机更高的 Node 24 小版本。本例的真实 DOM 状态断言不证明浏览器渲染、Vue watcher、共享查询缓存、后端回滚、桌面界面、签名或生产网络集成。取消请求不能撤销远端已提交的写入。参见[本入口决策](../../references/engineering-practices.md)。
