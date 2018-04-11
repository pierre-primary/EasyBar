## EasyBar

[TOC]

---

### 1、简介

js 实现的浏览器自定义 ScrollBar 工具

---

### 2、获得

npm build:构建

npm build-min:构建压缩

npm start:运行开启服务,查看示例 http://localhost:8080/

---

### 3、兼容性

电脑端：主流浏览器全部兼容；

移动端：除了火狐手机版外都兼容；

---

### 4、快速使用

根据开发场景选择对应的版本.browser.js|.modeule.js|.umd.js

#### 4.1、HTML-JS-CSS

引入

```html
<script src="./easy-bar.browser.min.js"></script>
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
EasyBar.bind(el, { minLength: 50 });
//修改bar
EasyBar.update(el, { minLength: 50 });
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
bar.bind({ minLength: 50 });
//修改bar
bar.update({ minLength: 50 });
//刷新bar状态 --必要时才用
bar.refreshBar();
//解绑
bar.unBind();
```

#### 4.2、Vue

引入

```javascript
import EasyBar from "./easy-bar.module.min.js";
Vue.use(EasyBar);
```

使用

```html
<div style="width:500px; height:500px;" v-bar="{ minLength: 50}">
    <div style="width:600px; height:600px;"></div>
</div>
```

#### 4.3、其他

请自行封装

### 5、参数说明

```javascript
{
    minLength: 50,//thumb的最小长度
    maxLength: -1,//thumb的最大长度
    resizeRefresh: true,//是否监听窗口大小变化
    barfloat: false,//--还没用 还木有做
    preventParentScroll: false,//是否拦截外部滚动
    scrollBarBehavior: null, //bar行为 如："show" "show none" 取值：show|hide|none

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

    clsContent: "eb-content",

    clsTrackV: "eb-track-v",
    clsThumbV: "eb-thumb-v",
    clsTrackH: "eb-track-h",
    clsThumbH: "eb-thumb-h"
}
```

### 6、感谢

vuebar:https://github.com/DominikSerafin/vuebar
