# 导入与部分初始化 — EP-PY-01

在可写副本用Python3.8+运行python -B -m unittest -v test_resource_boundary.py（或python3），以CRAFT_ENGINEERING_DEFECTIVE=1/0切换。PowerShell设$env:CRAFT_ENGINEERING_DEFECTIVE，POSIX在命令前设置；默认受保护。无需pip/外部服务或父源码，保持PYTHONDONTWRITEBYTECODE=1。

导入用例启动真实新解释器，观察临时外部状态文件；失败用例检查异常链和已取得资源关闭，成功用例检查逆序关闭。只有明确开启缺陷分支才写入指定临时标记或遗漏清理。两模式使用相同三个测试。

未连接DB，不证明驱动/事务行为；上下文回调仅展示所有权。适用于库/CLI/桌面，不强制Web分层；输出缓存留在源码外。
