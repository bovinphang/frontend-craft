# 重构验证检查表

## 局部函数/模块

检查目标单测、受影响模块类型、调用方契约以及公开导出是否保持。

## React

检查 Hook 顺序和依赖、闭包时效、受控/非受控状态所有权、memoization/引用相等、effect 清理和请求取消、事件顺序以及相关 Server/Client 与水合边界。

## Vue

检查 `ref`/`reactive` 身份和解包、computed 是否仍保持派生语义、watch source/flush/cleanup、props/emits/slots/expose 以及 Pinia 状态和持久化。

## API 与数据

检查请求形状、header、认证刷新、取消、重试和错误；字段改名是否越过 DTO/存储/URL/后端契约；排序和过滤是否保留顺序、重复项和边界值；值对象/引用对象转换是否保持必要身份。

## 路由与运行时注册

检查 route name/path/guard、dynamic import、lazy 注册、Storybook、i18n、CSS/Tailwind 动态 class、运行时模板和生成 metadata。

## 最终阶梯

按“目标测试 → 受影响集成 → lint/typecheck → 全量测试 → build → 实际受影响的 E2E/SSR/视觉/无障碍/性能门禁”逐步扩大验证。
