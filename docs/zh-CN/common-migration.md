# frontend-craft3.0公共能力迁移

当前精确公共依赖为`@bovinphang/craft-common@2.0.0`，craft-common 2.0.0、frontend-craft 3.0.0、backend-craft 1.0.0 均已于2026-11-09（Asia/Shanghai）发布至 npm，版本号不变。路径、规划会话、所有权、锁和可恢复事务复用common；产品保留内容转换与自身CLI/原生渠道策略。

3.0交付53个前端和21个公共入口，共74项。公共1.0.1的事务恢复修复保留在2.0.0中；1.x或开发快照不能与2.0.0混用。先用各旧产品CLI退出全部旧公共引用并处理保留编辑，再安装匹配产品；不强制覆盖共享资源。公开安装须等待common及相应产品实际发布与源策略允许。

| 原入口 | 3.0 用法 |
| --- | --- |
| fec-drawio-studio | 改用 cc-drawio-studio |
| fec-source-driven-development | 改用 cc-source-driven-development；前端领域规则文件仍保留 fec 命名 |
| fec-image-generation | 技术图表改用 cc-technical-diagrams；UI/产品视觉生成和编辑仍使用原入口 |
| fec-doc-sync | 前端文档同步仍使用原入口；跨栈方法使用 cc-doc-sync-core |
| fec-debug-framework | 前端诊断仍使用原入口；通用诊断方法使用 cc-debug-methodology |
| fec-refactoring | 前端重构及其子系统保留；通用行为保持方法使用 cc-refactoring-core |
| fec-tdd-workflow | 前端测试选型保留；通用红绿重构方法使用 cc-tdd-methodology |

先只读检查当前项目及所选 Runtime 的本地安装：

```sh
fec runtime check-migration codex --local
fec runtime check-migration codex --local --json
fec runtime check-migration codex --global --json
```

省略 Runtime 时检查全部已支持 Runtime。退出码：0 无待处理项；1 有旧引用或旧安装；2 参数、读取或清单错误。检查不重写项目文件，不输出匹配行的完整内容。敏感文件、依赖、构建产物、二进制和符号链接不扫描；大于 2 MiB 的文本跳过。全局模式只检查托管文件和旧公共 Skill 目录，不递归扫描整个用户主目录。

文本扫描仅提示候选项：迁移表、历史记录、同名领域规则文件可能合理包含旧名称，需人工甄别。保留的前端入口不会被一概要求改名；拆分建议根据同一行的任务上下文给出，不替代人工判断。

处理引用后安装或更新：

```sh
fec runtime install codex --local
fec runtime update codex --local
```

安装前检查旧公共 Skill。由旧 frontend-craft 清单托管且逐文件哈希一致的入口，随事务退役，再部署新入口；修改过、未知来源、带符号链接或无法确认所有权的旧目录会阻断迁移。检查报告不会替你删除这些文件。先备份并审阅自定义内容，再手动迁出、整合或移除旧入口后重试；不要直接清空整个 Runtime 目录。

同一实际 Skill 目录中的公共版本、内容摘要和语言必须一致。发现不兼容消费者会在写入前失败；不要用后安装的产品覆盖现有公共内容。卸载前端会保留其他消费者的公共资源；部分卸载留下修改过的前端文件时，也会保留公共依赖引用。最后消费者退出才清理未修改的公共文件，用户修改及所有权记录会保留。

事务中断后，用相同产品、安装范围和目录重跑。系统会恢复可确认的本地事务；无法确认锁或路径边界时保留现场并报错，不盲目删除锁文件。

同一产品清单路径不能切换 Runtime、local/global 作用域或公共目标；需要切换时先卸载原安装。全局旧配置目录迁入也先检查旧公共文件，用户修改会阻断，原目录保留。事务恢复针对本地主机进程中断，不承诺断电或跨主机共享文件系统协调。

CLI 共享安装已纳入双消费者验收。Claude/OpenClaw 原生插件渠道交付完整公共快照，本期不承诺两个原生产品同时启用时的去重。公开 registry 的公共包发布是独立发布步骤，本次开发不自动执行发布。

## 2026-11-08 coordinated2.0.0 upgrade / 当前协调升级

Current releases: common 2.0.0, frontend 3.0.0 and backend 1.0.0; all published on npm. 2.0.0同样要求版本、语言和摘要一致；不自动升级另一个产品。

1. Back up user edits and inspect local/global/runtime identity. 备份修改，确认安装范围。
2. With each OLD product CLI, uninstall its runtime resources and resolve preserved edits until both old common consumers exit. 使用各旧 CLI 退出旧公共引用，不用新 CLI 越权接管。
3. Install both matching product builds using verified artifacts; public clean install must wait for common publication. 安装新匹配产品前执行 runtime check-migration。
4. Managed unchanged legacy language entries retire in the same transaction as new cc deployment. Unknown files, edits, links or invalid ownership block the whole install; dry-run writes nothing. 原领域入口不建立假别名。

Rename: fec-typescript-project-standard → cc-typescript-project-standard; bec-{rust,go,java,python,c,cpp}-project-standard → cc-*-project-standard; bec-{rust-async,go-concurrency,python-async,java-runtime,native-memory-safety} → cc-* equivalents. Frontend retains its earlier drawio/source-driven rename policy.

Checks return 0 (nothing found), 1 (reviewable references/owned retired entries), 2 (invalid arguments, scan failure or retirement conflict). Reports show paths, IDs and line numbers, never full source lines. No-Skill hosts receive reference material rather than a fabricated native Skill alias. 双原生产品去重仍不在保证范围。
