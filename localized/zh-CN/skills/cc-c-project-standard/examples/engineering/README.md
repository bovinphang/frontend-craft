# 纯C大小与清理契约 — EP-C-01

复制到可写目录，用cc -std=c11 -Wall -Wextra -Werror boundary.c boundary_test.c -o boundary-test编译，再以CRAFT_ENGINEERING_DEFECTIVE=1/0运行相同程序。PowerShell先设$env:CRAFT_ENGINEERING_DEFECTIVE；POSIX可在命令前赋值。缺编译器记MISSING，可显式准备Docker后验证。维护器另以-DNDEBUG检查断言不失效。

两个命名测试使用始终有效检查，分配器实际malloc/free并计数，拒绝巨大请求，清理测试幸存分配。溢出应分配前拒绝，第二次分配失败释放header，成功仅转移payload；失败初始化有效输出槽。缺陷分支故意遗漏溢出/清理，unsigned回绕是已定义行为，无需UB崩溃证明错误。

C11只是样例目标，不要求升级或改C++，不依赖SAL/三方库/父源码。未证明sanitizer、任意外部缓冲有效性或全部ABI平台；相关时独立执行。程序日志保留在可写副本。
