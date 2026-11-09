# 取消与完成 — EP-GO-01

复制目录到可写位置，已有Go1.20+即可，无外部模块。先go test -run=^$ ./...只确认编译，再以CRAFT_ENGINEERING_DEFECTIVE=1/0分别运行go test -json -count=1 -timeout=15s ./...。PowerShell设$env:CRAFT_ENGINEERING_DEFECTIVE，POSIX可在命令前设变量。离线设GOPROXY=off、GOTOOLCHAIN=local、GOSUMDB=off。

事件确认工作者取得值，输出端故意无接收者，缺陷路径在取消后仍阻塞两个任务，五秒watchdog触发命名断言。它只限制故障等待，不以sleep推断顺序。修复路径的阻塞边界都监听取消，并等待两者退出。故意卡住的缺陷测试进程报告失败后退出，不是生产关闭实现。

不证明全部调度或race自由，race检查另行在支持平台执行；不依赖父源码/HTTP/数据库。
