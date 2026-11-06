# frontend-craft 3.0 公共能力迁移

3.x 尚未正式发布。3.0 直接使用 `cc-*` 公共入口，由 `@bovinphang/craft-common@1.0.1` 随产品自动交付，无需单独安装第三个插件。

1.0.1 修复较大事务日志恢复。前后端必须使用相同公共版本、语言及摘要。已有 1.0.0 安装应先由旧产品退出公共消费者，处理保留的用户修改，再安装依赖 1.0.1 的新产品；不要强制覆盖共享资源。干净公开源安装需等待该修复版发布。

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
