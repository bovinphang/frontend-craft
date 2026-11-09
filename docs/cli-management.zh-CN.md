# CLI 管理

前后端复用 craft-common 的命令调度、交互、npm/pnpm 来源识别和 CLI 生命周期。前端示例将 bec 替换为 fec。

- `bec setup [runtime]`、`bec setup all` 默认本地安装，`--global/-g` 显式改为全局。
- 普通 `bec`、`bec install`、`bec runtime install` 在交互终端选择 Runtime、语言、位置；非交互默认 Claude、全局、英文。后端原来的默认本地行为发生变化，现有脚本应显式加 `--local/-l`。语言支持 `--lang zh-CN` 与 `--lang=zh-CN`。
- `bec update/upgrade` 验证原 npm/pnpm 来源，升级 CLI 后使用新入口刷新当前项目与全局托管资源；已是最新版也刷新。CLI 更新失败不更新资源，资源失败不回滚 CLI。未知来源、开发目录和 pnpm 共享安装组拒绝自动管理。npx 临时运行要求已是最新版，并拒绝自卸载。
- `bec uninstall/remove` 默认仅卸载 CLI，`--purge` 先清理本产品资源。非交互必须传 `--yes/-y`；保留用户修改，清理错误时保留 CLI。
- `bec runtime update/upgrade [runtime]` 使用当前包内容；省略 Runtime 自动发现本地及全局安装，沿用各安装语言。`runtime uninstall/remove [runtime]` 清理清单托管资源，`--force` 仅允许删除本产品已修改的私有文件，不接管其他产品或公共资源。支持 `--all` 和作用域筛选。
- `--dry-run` 只读预览；自升级预览可能查询 registry。`list` 列出支持的 Runtime，`matrix` 查看能力，`doctor [runtime]` 默认 Claude。`doctor claude --fix-cache [--dry-run]` 仅清理本产品过期缓存，保护当前安装，元数据不足时拒绝清理。CLI 与原生 Marketplace 渠道互斥。
- `sync-metadata --check` 只检查元数据。后端 `validate`、`project inspect`、既有 JSON 和 `runtime list` 保留。JSON stdout 为单个值，诊断走 stderr。

## 公共资源协调升级

公共账本继续严格匹配版本、语言和摘要。现有 2.0.0 消费者应先通过各自旧 CLI 退出，再由匹配 2.1.0 的产品构建安装资源。单独升级一个产品可能出现 CLI 已就绪、资源刷新报告兼容冲突的情况；按既有公共迁移流程退出旧引用后重试，不使用 force 接管其他消费者。
