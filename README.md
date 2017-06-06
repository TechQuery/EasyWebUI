# EasyWebUI



## 【概述】

**EasyWebUI** 是一个**普适**而**轻巧**的 **HTML/CSS 开发框架** —— **支持 IE 8+ 的 CSS 2/3 国际标准**及主流厂商的专用属性（不使用 IE CSS Hack），**通用于桌面端、移动端的各种网页、混合 App 用户界面的构建**。

【注】对 IE 的兼容仅限其“标准模式”，而非“兼容性视图”。


### 主要功能

 1. 原生 HTML 元素的样式优化
 2. 三大**布局模型 —— 行列栅格、流动盒、弹性盒**
 3. **面向对象、组件化的高级控件体系**


### 主要特性

 1. **HTML 缺省样式** —— 美观、护眼
 2. **CSS 类名** —— 简洁、**语义化**
 3. **控件 DOM 结构** —— 简单、充分**复用 HTML 原生语义**
 4. **控件 JS API**
   - 完全的 **jQuery 风格** —— 融入最好的 Web 前端生态圈
   - **方法参数**精简 —— 学习曲线平缓
   - 内部实现基于通用的 **DOM 事件 / 面向对象 接口** —— 工程开发、维护容易



## 【教程】


### （〇）库文件引入

HTML 源码基本结构示例如下 ——

```html
<!DocType HTML>
<html><head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge, Chrome=1" />
    <link rel="stylesheet" href="path/to/EasyWebUI.css" />
    <script src="path/to/iQuery.js"></script>
    <script src="path/to/EasyWebUI.js"></script>
</head><body>
    ...
</body></html>
```

### （一）UI 组件 / jQuery 插件

  1. 密码确认插件  v0.3
  2. 元素禁止选中  v0.1
  3. 表单对话框  v0.1
  4. 面板控件  v0.1

> 【特别提醒】以下控件可在 [EWA v4](http://git.oschina.net/Tech_Query/EasyWebApp/tree/MVVM/) 中基于 MVVM 完全重写，不再在本项目中维护！

  1. ~~数据表 控件  v0.1~~
  2. ~~标签页 控件  v0.5~~
  3. ~~阅读导航栏   v0.1~~
  4. ~~目录树 控件  v0.2~~


#### （二）通用接口（开发进阶）

  1. [~~$.ListView~~](http://git.oschina.net/Tech_Query/iQuery/blob/master/iQuery+.js#L16)
  2. [~~$.TreeView~~](http://git.oschina.net/Tech_Query/iQuery/blob/master/iQuery+.js#L253)



## 【协作开发】

本项目提炼于其发起人的**日常开发实战**，其本人会**持续更新**，同时欢迎广大 **Web 开发爱好者**在 **OSChina 社区**与其交流、提交 **Pull Request**！~