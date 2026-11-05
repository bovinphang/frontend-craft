---
name: fec-doc-sync
description: 用于根据 package.json、lockfile、配置、env 示例、路由、API client 或 server routes、schema、组件、测试、CI、构建/部署配置、ADR、changelog 或迁移说明等事实源同步前端项目文档。不要用于单纯润色普通文案；中文触发词包括 文档同步、更新 README、docs sync、环境变量文档、命令清单、API 文档同步。
---

# 前端文档同步

遵循[公共文档同步方法](references/common/doc-sync.md)，处理证据、多语言一致性和交付记录。

## 前端事实来源

核对 package.json、锁文件、框架与构建配置、环境变量示例、路由、API client/server routes、类型/schema、组件、测试、CI 和部署文件。

## 前端同步范围

覆盖根目录与包、应用、部署、Runtime README，以及 docs、ADR、changelog、环境变量和安装说明。对照路由/API 行为、客户端集成、支持矩阵、插件入口、命令、报告路径、元数据和示例提示词。

所有已有语言入口均检查公共事实；遵循公共方法记录事实源、已同步文件、无需修改项和人工翻译复核事项。使用项目现有内容检查、类型、测试和打包命令。
