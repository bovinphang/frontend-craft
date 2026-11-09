# 通用工程实践

先读项目契约，再按需读取公共章节与本入口语言/场景卡。以下是参考一手来源形成的项目判断，不代表来源企业认证。required保护明确的正确性/安全契约；recommended允许说明理由后选择替代方案；conditional仅在所列条件成立时适用。项目安全/兼容和实际工具链事实优先于企业风格。

<a id="ENG-CONTRACT"></a>
## ENG-CONTRACT — 先明确契约，再选择表示

级别: required

### 风险
输入格式合法，仍可能违反调用意图或输出约定。

### 适用
适用于公共API、文件、IPC和序列化输入；已证明不变量的内部值可复用既有保证，不要求处处重复校验。

### 决策
列出调用方、有效值/单位、失败输出和兼容承诺；外部unknown在产生副作用前校验一次，协议转换留在领域逻辑边界。

### 例外
若上游校验器已负责该不变量，记录范围并复用；类型断言或生成类型本身不提供运行时保证。

### 正反示意
正例：金额校验失败后不扣款。反例：先断言JSON类型，让部分副作用暴露坏输入。

### 验证
验证非法值、边界值和成功路径，以及副作用/输出状态；发布库时在实际归档消费者中检查。

### 来源
- [Publishing declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) (typescript-publishing)
- [Rust API 设计指南](https://rust-lang.github.io/api-guidelines/) (rust-api)

案例证据标识: EP-TS-01, EP-SVC-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。

<a id="ENG-ERROR"></a>
## ENG-ERROR — 保留可观察失败

级别: required

### 风险
兜底可能丢失原因，或在部分工作后伪装成功。

### 适用
适用于跨抽象/进程的失败；预期的缺失可用明确的可选结果，不必转成异常。

### 决策
保留原始原因及操作上下文，以项目约定的类型/错误返回；恢复由负责边界决定，清理失败不能悄悄覆盖主要失败。

### 例外
对外转换敏感内部细节，允许的诊断保留关联线索；不记录凭据和原始私密载荷。

### 正反示意
正例：失败保留cause，已拥有资源被释放。反例：捕获所有异常后返回空成功对象。

### 验证
注入下游失败，断言调用方观察到失败、原因及约定的清理结果。

### 来源
- [Java 资源自动关闭](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) (oracle-resources)
- [Go 工程风格指南](https://github.com/uber-go/guide/blob/master/style.md) (uber-go)

案例证据标识: EP-RS-01, EP-JAVA-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。

<a id="ENG-RESOURCE"></a>
## ENG-RESOURCE — 负责完整资源生命周期

级别: required

### 风险
部分获取、借用句柄和销毁顺序会造成泄漏或重复释放。

### 适用
适用于文件、内存、任务、订阅及外部句柄；纯值转换无需虚构资源管理层。

### 决策
明确获取、使用、转移、释放的责任方；所有出口按依赖顺序释放已取得资源，借用值仍归原拥有者；库导入不获取无关外部资源。

### 例外
已记录的转移/进程级资源需明确接收方或寿命约定；仅靠终结器或进程退出不能证明有序关闭。

### 正反示意
正例：第二次分配失败时只释放第一次已拥有分配。反例：释放调用方的借用缓冲区。

### 验证
逐点失败及成功转移时核对获取/释放；驱动、GUI关闭、sanitizer未执行范围单列。

### 来源
- [MEM00-C 分配与释放](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/recommendations/memory-management-mem/mem00-c/) (cert-c)
- [C++ 核心指南](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) (cpp-core)

案例证据标识: EP-C-01, EP-CPP-01, EP-PY-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。

<a id="ENG-CONCURRENCY"></a>
## ENG-CONCURRENCY — 取消通知与完成确认有别

级别: conditional

### 风险
脱离管理的任务可能超出拥有者寿命，旧结果可能覆盖当前状态。

### 适用
当单元启动并发工作或接收异步结果时适用；顺序纯计算无需引入调度器。

### 决策
保留完成句柄、取消责任和在途上限；停止接单、取消/排空后确认退出，发布结果前核对当前请求及寿命。

### 例外
部分阻塞操作忽略取消；应报告关闭未完成或交由调用方决定强制退出。Arc、通道容量及abort请求均不是完成证据。

### 正反示意
正例：受控B先A后仍展示B。反例：调用超时后释放工作者仍在使用的资源。

### 验证
用屏障/事件和可控future验证取消、饱和及迟到结果；任意sleep不能证明顺序。

### 来源
- [Go context 包](https://pkg.go.dev/context) (go-context)
- [Tokio JoinHandle 任务句柄](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html) (tokio-join)
- [Python 协程与任务](https://docs.python.org/3/library/asyncio-task.html) (python-asyncio)

案例证据标识: EP-GO-01, EP-IPC-01, EP-UI-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。

<a id="ENG-BOUNDARY"></a>
## ENG-BOUNDARY — 在真实边界建立信任

级别: required

### 风险
前后端标签可能掩盖特权操作和不可信调用。

### 适用
适用于UI、IPC、库和服务间的外部输入、授权及权限变化；私有纯辅助函数不必另建认证层。

### 决策
通过真实可信机制核验发送者/身份，校验操作输入并限定权限；渲染端提供的角色或隐藏按钮都不是授权依据。

### 例外
离线/本地工具仍有调用方和数据边界；只需受限本地能力时，不凭空加入网络认证。

### 正反示意
正例：只暴露经过输入和发送者检查的单项IPC操作。反例：向渲染端开放任意文件操作。

### 验证
检查拒绝/允许调用及拒绝后的零副作用；原生权限激活和签名需独立环境实证。

### 来源
- [Electron 安全边界](https://www.electronjs.org/docs/latest/tutorial/security) (electron-security)
- [Tauri 权限](https://v2.tauri.app/security/permissions/) (tauri-permissions)

案例证据标识: EP-TS-01, EP-IPC-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。

<a id="ENG-DEPENDENCY"></a>
## ENG-DEPENDENCY — 交付可用的消费契约

级别: recommended

### 风险
仓库内可用可能掩盖未声明依赖及归档不兼容。

### 适用
适用于发布、依赖升级及公开API修改；仅补充内容不要求升级全部工具。

### 决策
先读清单、锁、支持目标和导出；显式声明依赖，限制改动并保留迁移回退，在独立消费者验证真实归档。

### 例外
仅在有需求证据且符合兼容政策时更换依赖或编译器；企业指南偏好的构建系统本身不是依据。

### 正反示意
正例：声明通过归档文件及已声明依赖解析。反例：发布只能通过相邻源码别名解析的类型。

### 验证
检查实际归档字节，离开相邻源码安装并运行消费者检查，记录精确版本、完整性和未测平台。

### 来源
- [Publishing declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) (typescript-publishing)
- [代码评审标准](https://google.github.io/eng-practices/review/reviewer/standard.html) (google-review)

案例证据标识: EP-TS-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。

<a id="ENG-VERIFICATION"></a>
## ENG-VERIFICATION — 证据与所宣称行为对应

级别: required

### 风险
结构检查通过或工具缺失可能被误认为行为已证明。

### 适用
适用于实现、评审和交付结论；只读建议可提出检查，不伪装已执行。

### 决策
按风险及可观察边界选测试；准备与执行分离，有缺陷/修复版本用相同断言，记录真实命令、数量和限制。

### 例外
缺工具记MISSING，未执行记NOT RUN；编译错误、零用例及全跳过均不能证明业务RED/GREEN。

### 正反示意
正例：失败注入触发命名副作用断言，修复后同断言通过。反例：只搜索一行PASS文本。

### 验证
保留原始输出、输入/工具标识和范围；结构、原生行为及模型任务决策分别记录。

### 来源
- [测试规划](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/test-planning/) (ms-playbook)
- [故障注入测试](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/fault-injection-testing/) (ms-faults)
- [代码评审标准](https://google.github.io/eng-practices/review/reviewer/standard.html) (google-review)

案例证据标识: EP-TS-01, EP-C-01, EP-SVC-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。

<a id="ENG-OPERABILITY"></a>
## ENG-OPERABILITY — 明确且限制恢复行为

级别: conditional

### 风险
部分失败、重试放大和不安全诊断可能扩大故障。

### 适用
单元负责外部操作、后台生命周期或恢复决策时适用；库暴露信号，不强制引入服务仪表盘或HTTP层。

### 决策
区分失败与提交不确定性，明确意图、总时限/重试预算及恢复方；写重放之前先建立稳定幂等契约，输出脱敏关联及可处理状态。

### 例外
没有服务端安全保证时，写操作保持待确认并提供核对路径；超时/取消不证明未生效，429/5xx本身不授权重放。

### 正反示意
正例：同键同意图复用已提交结果。反例：付款超时后换新键重试。

### 验证
注入提交后响应前失败，并发重放并拒绝不同意图；区分进程内测试与数据库/分布式保证。

### 来源
- [时限、重试与抖动退避](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) (aws-retry)
- [以幂等契约保障重试](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) (aws-idempotency)

案例证据标识: EP-SVC-01, EP-UI-01. 这些标识不构成本包对其他入口示例的依赖，实际执行状态见本入口说明及覆盖报告。
