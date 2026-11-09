# Result与资源边界 — EP-RS-01

复制目录到可写位置。已有Rust环境先执行cargo test --offline --locked --no-run；PowerShell设$env:CRAFT_ENGINEERING_DEFECTIVE为1，运行cargo test --offline --locked，failure_releases_and_preserves_cause应因释放次数断言失败。设为0（默认）后相同两个测试通过；POSIX可在命令前设置环境变量。

无需外部crate或父仓源码。mem::forget是故意保留的缺陷分支，默认不启用；真实I/O cause和Drop计数展示Result/RAII，不证明async取消、unsafe/FFI或GUI。target及日志置于可写副本；声明MSRV需单独验证，不能以较新工具链运行推断最低版本通过。
