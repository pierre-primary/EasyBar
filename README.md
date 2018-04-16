## EasyBar

[TOC]

---

### 1、简介

js 实现的浏览器自定义 ScrollBar 工具

[Demo](https://y-bao.github.io/EasyBar/simple/)

---

### 2、获得

npm build:构建

npm start:运行开启服务,查看示例 http://localhost:8080/

npm i easy-bar 安装

---

### 3、兼容性

电脑端：主流浏览器全部兼容；

移动端：除了火狐手机版外都兼容；（有人测出华为手机系统自带的浏览器也不兼容，身边没有华为手机先搁置）

---

### 4、快速使用

根据开发场景选择对应的版本.js|.min.js|.common.js|.umd.js

#### 4.1、HTML-JS-CSS

引入

```html
<script src="./easy-bar.min.js"></script>
```

```html
<div id="el1" style="width:500px; height:500px;">
    <div style="width:600px; height:600px;"></div>
</div>
```

写法一

```javascript
var el = document.getElementById("el1");
//构建bar
EasyBar.bind(el, options);
//修改bar
EasyBar.update(el, options);
//刷新bar状态 --必要时才用
EasyBar.refreshBar(el);
//解绑
EasyBar.unBind(el);
```

写法二

```javascript
var el = document.getElementById("el1");
//构建bar
var bar = new EasyBar(el);
//构建bar
bar.bind(options);
//修改bar
bar.update(options);
//刷新bar状态 --必要时才用
bar.refreshBar();
//解绑
bar.unBind();
```

#### 4.2、Vue

引入

```javascript
import EasyBar from "easy-bar";
Vue.use(EasyBar);
```

使用

```html
<div style="width:500px; height:500px;" v-bar>
    <div style="width:600px; height:600px;"></div>
</div>
```

#### 4.3、其他

请自行封装

### 5、参数说明

```javascript
minLength: 50,//thumb 的最小长度 ------------ 已去除，改用 css min-height 或 min-width 实现
maxLength: -1,//thumb 的最大长度 ------------ 已去除，改用 css max-height 或 max-width 实现
resizeRefresh: true,//是否监听窗口大小变化
barfloat: true,//滚动条是否浮动
preventParentScroll: false,//是否拦截外部滚动
scrollBarBehavior: null, //bar 行为 如："show" "show none" 取值：show|hide|none

scrollThrottle: 10,//滚动监听节流周期
draggerThrottle: 10,//拖动监听节流周期
observerThrottle: 200,//子布局变化监听节流周期
resizeDebounce: 200,//窗口大小变化监听去抖周期
scrollingPhantomDelay: 1000,//滑动样式停留时间
draggingPhantomDelay: 1000,//拖动样式停留时间

 //下面是个个类名的设置
clsBox: "eb",
clsBoxScrolling: "eb-scrolling",
clsBoxScrollingPhantom: "eb-scrolling-phantom",
clsBoxDragging: "eb-dragging",
clsBoxDraggingPhantomClass: "eb-dragging-phantom",
clsBoxVisibleBarV: "eb-visible-v",
clsBoxInvisibleBarV: "eb-invisible-v",
clsBoxVisibleBarH: "eb-visible-h",
clsBoxInvisibleBarH: "eb-invisible-h",

clsBoxClip: "eb-clip",

clsContent: "eb-content",

clsBarV: "eb-bar-v",
clsBarH: "eb-bar-h",

clsTrack: "eb-track",
clsThumb: "eb-thumb"
```

### 6、感谢

vuebar:https://github.com/DominikSerafin/vuebar
