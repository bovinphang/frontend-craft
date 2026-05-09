---
name: legacy-web-standard
description: 针对 JavaScript + jQuery + HTML/CSS 传统前端项目的开发与维护规范。当用户在非框架项目中工作，涉及 jQuery、原生 JS、传统多页面应用（MPA）、模板引擎渲染页面、或维护遗留代码时自动激活。
version: 1.0.0
---

# 传统前端项目规范（JS + jQuery + HTML）

适用于未使用现代框架（Vue / React / Angular）的传统前端项目，包括 jQuery 多页面应用、服务端模板渲染项目（JSP / Thymeleaf / PHP / Django Template / EJS / Handlebars 等）以及需要长期维护的遗留系统。

## 适用场景

- 基于 jQuery 的多页面应用（MPA）
- 服务端渲染 + 前端增强的项目
- 需要维护但不适合整体重写的遗留系统
- 对浏览器兼容性要求较高的项目
- 使用原生 JS 或 jQuery 插件的项目

## 核心原则

- 在现有架构内改进，不要引入与项目格格不入的现代框架
- 渐进增强优于推倒重来
- 保持与项目已有代码风格一致
- 优先修复问题，而不是重构整个模块

## JavaScript 规范

### 基本要求

- 使用 `var` / `let` / `const` 取决于项目已有风格，保持统一
- 避免全局变量污染，使用 IIFE 或命名空间模式
- 函数命名清晰，避免单字母命名（循环变量除外）
- 数字、字符串常量提取为具名常量，避免 magic value

### 命名空间模式

```javascript
var App = App || {};
App.UserModule = (function($) {
    'use strict';

    var config = {
        apiBase: '/api/v1'
    };

    function init() {
        bindEvents();
        loadData();
    }

    function bindEvents() {
        $(document).on('click', '.js-submit-btn', handleSubmit);
    }

    function handleSubmit(e) {
        e.preventDefault();
        // ...
    }

    return { init: init };
})(jQuery);
```

### 事件绑定

- 优先使用事件委托（`$(document).on('event', '.selector', handler)`）
- 事件触发元素使用 `js-` 前缀的 class（如 `.js-delete-btn`），与样式 class 分离
- 避免在 HTML 中内联 `onclick`、`onchange` 等事件属性
- 页面卸载或模块销毁时解绑事件，避免内存泄漏

### DOM 操作

- 缓存频繁使用的 jQuery 选择器（`var $list = $('.item-list')`）
- 批量 DOM 操作使用 `DocumentFragment` 或拼接 HTML 字符串后一次性插入
- 避免在循环中反复操作 DOM
- 动态生成 HTML 时必须对用户输入转义，防止 XSS

### Ajax 请求

```javascript
function fetchUserList(params) {
    return $.ajax({
        url: config.apiBase + '/users',
        method: 'GET',
        data: params,
        dataType: 'json'
    }).done(function(res) {
        if (res.code === 0) {
            renderList(res.data);
        } else {
            showError(res.message);
        }
    }).fail(function(xhr) {
        showError('网络错误，请稍后重试');
    }).always(function() {
        hideLoading();
    });
}
```

- 统一处理 loading 状态（请求前显示，always 中隐藏）
- 统一处理错误（网络错误 + 业务错误）
- 防止重复提交（按钮 disable 或标志位）
- 敏感操作使用 POST，不在 URL 中暴露参数

## jQuery 规范

### 选择器性能

- 优先使用 ID 选择器（`$('#user-list')`）
- 缓存选择器结果，避免重复查询
- 限定选择器范围（`$container.find('.item')` 优于 `$('.item')`）
- 避免使用过于复杂的选择器链

### 插件使用

- 初始化插件前检查元素是否存在
- 页面切换或模块销毁时调用插件的 destroy 方法
- 插件配置提取为常量或配置对象，不要散落在代码中
- 优先使用项目已在使用的插件，避免为同一功能引入多个插件

### jQuery 反模式

避免：

- `$('body').on('click', handler)` — 事件范围过大
- 在 `$(document).ready` 外直接操作 DOM
- 链式调用过长（超过 3-4 层需要拆分）
- 混用 jQuery 和原生 DOM API 而不统一
- 在循环中反复 `$()` 包装同一个元素

## HTML 规范

- 语义化标签：用 `<nav>`、`<main>`、`<section>`、`<article>` 替代纯 `<div>`
- 表单元素必须有 `<label>`
- 图片必须有 `alt` 属性
- 不使用已废弃的标签（`<font>`、`<center>`、`<marquee>`）
- 自定义属性使用 `data-*` 前缀
- 模板中动态输出的内容必须转义

## CSS 规范

- 优先使用 class 选择器，避免 ID 选择器和标签选择器
- 类名使用 BEM 或项目已有的命名约定
- 避免 `!important`，除非覆盖第三方库样式且无其他选择
- 避免过深的选择器嵌套（不超过 3 层）
- 样式按组件/模块组织，而非按页面堆积在一个文件中
- 使用 CSS 变量（`var(--color-primary)`）管理主题值（如项目支持）

## 安全要求

### XSS 防护（重点）

传统项目是 XSS 的高发区，必须严格检查：

- **禁止** 使用 `innerHTML` / `.html()` 直接插入用户输入
- 动态拼接 HTML 时，对所有用户数据使用转义函数
- URL 参数不得直接用于页面渲染
- 使用 `.text()` 代替 `.html()` 展示纯文本内容

```javascript
// 错误：XSS 风险
$('.username').html(userData.name);

// 正确：使用 .text() 转义
$('.username').text(userData.name);

// 正确：需要 HTML 时手动转义
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
$('.comment').html('<p>' + escapeHtml(userData.comment) + '</p>');
```

### 其他安全项

- CSRF token 必须随表单提交
- 文件上传校验类型和大小
- 敏感操作（删除、支付）二次确认

## 文件组织

遵循项目已有约定。典型结构：

```
project/
├── css/
│   ├── common.css          # 全局样式
│   └── pages/
│       └── user-list.css   # 页面级样式
├── js/
│   ├── lib/                # 第三方库
│   │   ├── jquery.min.js
│   │   └── ...
│   ├── common/             # 公共模块
│   │   ├── utils.js
│   │   ├── ajax.js
│   │   └── constants.js
│   └── pages/              # 页面级脚本
│       └── user-list.js
├── images/
└── pages/                  # HTML 页面（如非模板引擎）
```

## 渐进改进建议

在维护遗留项目时，可以在不影响整体架构的前提下渐进引入：

- ESLint（即使不用打包工具，也可以用 CLI 检查）
- CSS 变量替代重复的颜色/间距值
- `fetch` API 替代 `$.ajax`（如不需要支持 IE）
- ES6 模块 + 打包工具（如项目计划逐步现代化）

但不要在一次改动中同时引入多项改进。每次聚焦一个点，确保不破坏现有功能。

## 输出检查清单

- [ ] 没有全局变量泄漏
- [ ] 事件使用委托，绑定在合理的容器上
- [ ] DOM 选择器已缓存
- [ ] Ajax 处理了 loading / error / 空数据
- [ ] 用户输入已转义，无 XSS 风险
- [ ] 与项目已有代码风格保持一致
- [ ] 如涉及新增第三方库，已确认必要性
