# 部分初始化与原因 — EP-JAVA-01

在可写副本先javac --release 17 ResourceBoundary.java ResourceBoundaryTest.java，再以CRAFT_ENGINEERING_DEFECTIVE=1/0运行java -ea -cp . ResourceBoundaryTest。PowerShell设$env:CRAFT_ENGINEERING_DEFECTIVE，POSIX可在命令前设置。默认受保护，无三方依赖或父源码。

失败用例观察实际IOException cause及一次关闭回调，缺陷分支遗漏失败清理。两个命名用例使用始终有效require，即使不启用-ea也非空测试。JSON汇总真实执行体，维护器联合检查名字、计数、退出码和失败标记。Java17仅为样例目标，不升级用户项目；不验证执行器、GUI、DB驱动或suppressed关闭错误。class和日志留在可写副本。
