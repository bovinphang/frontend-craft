# 借用与部分构造 — EP-CPP-01

在可写副本用c++ -std=c++17 -Wall -Wextra -Werror boundary.cpp boundary_test.cpp -o boundary-test编译，以CRAFT_ENGINEERING_DEFECTIVE=1/0执行。PowerShell设$env:CRAFT_ENGINEERING_DEFECTIVE，POSIX前缀赋值。默认受保护，缺编译器记MISSING；维护器另以-DNDEBUG检查断言不失效。

调用方把借用对象分配在堆上，缺陷接管可被观察而不会释放栈对象或二次delete；缺陷还在部分构造时泄漏一个lease，计数显示析构未发生。测试发现借用已释放后不重复释放。受保护实现保持非拥有借用，新获取lease用RAII。两个用例的检查不受NDEBUG影响。

此独立样例明确采用C++17及自身C++边界内异常，不授权给用户项目启异常、改标准、把纯C迁为C++或让异常跨C ABI；未建立FFI ABI、sanitizer、GUI、数据库保证。故意泄漏仅存在默认关闭的缺陷测试进程。构建日志放源码外。
