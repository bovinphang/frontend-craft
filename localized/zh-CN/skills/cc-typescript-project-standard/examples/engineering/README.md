# 外部输入边界 — EP-TS-01

将此目录复制到可写临时位置。样例自有Node >=22.18目标（原生类型擦除），不升级父项目。显式准备：pnpm install --ignore-scripts --frozen-lockfile，然后pnpm typecheck。PowerShell设$env:CRAFT_ENGINEERING_DEFECTIVE为1，运行pnpm test，非法输入命名断言应失败；设为0或移除变量后同组两个测试通过。POSIX可在测试命令前设置同名环境变量。

回调记录校验前后的真实副作用，缺陷分支故意以断言替代校验；默认受保护。这里不验证付款服务、浏览器、异步状态及声明发布。仅依赖本目录源码和已声明工具，node_modules/build/log应留在可写副本。

[Node.js 类型擦除历史与限制](https://nodejs.org/api/typescript.html)：运行时类型擦除与显式 TypeScript 类型检查分开。
