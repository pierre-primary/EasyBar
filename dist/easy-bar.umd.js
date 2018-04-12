/*!
* author: PengYuan-Jiang
* email: 392579823@qq.com
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.EasyBar = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * @author:Ybao
 */
var Utils = function () {
    function Utils() {
        classCallCheck(this, Utils);
    }

    createClass(Utils, null, [{
        key: "hasClass",

        /**
         * 判断元素是否存在对应的类
         * @param {HTMLElement} el 元素
         * @param {String} className 类名
         * @returns {Bool} 是否纯在
         */
        value: function hasClass(el, className) {
            return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
        }
        /**
         * 为元素添加类
         * @param {HTMLElement} el 元素
         * @param {String} className 类名
         */

    }, {
        key: "addClass",
        value: function addClass(el, className) {
            if (el.classList) {
                el.classList.add(className);
            } else if (!hasClass(el, className)) {
                el.className += " " + className;
            }
        }

        /**
         * 从元素删除类
         * @param {HTMLElement} el 元素
         * @param {String} className 类名
         */

    }, {
        key: "removeClass",
        value: function removeClass(el, className) {
            if (el.classList) {
                el.classList.remove(className);
            } else {
                el.className = el.className.replace(new RegExp("\\b" + className + "\\b", "g"), "");
            }
        }
        /**
         * 设置css属性兼容
         * @param {HTMLElement} el 元素
         * @param {String} property 属性名
         * @param {*} value 元素
         */

    }, {
        key: "compatStyle",
        value: function compatStyle(el, property, value) {
            var _property = property.slice(0, 1).toUpperCase() + property.substring(1);
            el.style["webkit" + _property] = value;
            el.style["moz" + _property] = value;
            el.style["ms" + _property] = value;
            el.style["o" + _property] = value;
            el.style[property] = value;
        }
        /**
         * 去抖
         * @param {Function} fn 执行体
         * @param {Number} delay 周期时间
         */

    }, {
        key: "debounce",
        value: function debounce(fn, delayFn, nowFn) {
            var timer = null;
            return function () {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                var delay = delayFn ? delayFn.apply(context, args) : undefined;
                if (delay) {
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                    }, delay);
                } else {
                    fn.apply(context, args);
                }
                if (nowFn) {
                    return nowFn.apply(context, args);
                }
            };
        }
        /**
         * 节流
         * @param {Function} fn 执行体
         * @param {Number} threshhold 周期时间
         */

    }, {
        key: "throttle",
        value: function throttle(fn, threshholdFn, nowFn) {
            var last, timer;
            return function () {
                var context = this;
                var now = +new Date(),
                    args = arguments;
                var threshhold = threshholdFn ? threshholdFn.apply(context, args) : undefined;
                if (last && threshhold && now < last + threshhold) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
                if (nowFn) {
                    return nowFn.apply(context, args);
                }
            };
        }
    }]);
    return Utils;
}();

/**
 * @author:Ybao
 */
var BrowserUtils = function () {
    function BrowserUtils() {
        classCallCheck(this, BrowserUtils);
    }

    createClass(BrowserUtils, null, [{
        key: "isFirefox",
        value: function isFirefox() {
            var ua = window.navigator.userAgent;
            return ua.toLowerCase().indexOf("firefox") > -1;
        }
    }]);
    return BrowserUtils;
}();

/**
 * @author:Ybao
 */
var DefConfig = {
    minLength: 50,
    maxLength: -1,
    resizeRefresh: true,
    barfloat: false,
    preventParentScroll: false,
    scrollBarBehavior: null, //show|hide|none show|hide|none

    scrollThrottle: 10,
    draggerThrottle: 10,
    observerThrottle: 200,
    resizeDebounce: 200,
    scrollingPhantomDelay: 1000,
    draggingPhantomDelay: 1000,

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
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".hide-native-bar::-webkit-scrollbar{display:none}.hide-native-bar::-o-scrollbar{display:none}.hide-native-bar{-ms-overflow-style:none}.eb>.eb-track-h,.eb>.eb-track-v{-webkit-transition:background-color .3s;transition:background-color .3s;z-index:1;border-radius:20px}.eb>.eb-track-v{width:8px;top:5px;right:5px;height:calc(100% - 20px)}.eb>.eb-track-h{height:8px;left:5px;bottom:5px;width:calc(100% - 20px)}.eb.eb-visible-h.eb-scrolling-phantom>.eb-track-h,.eb.eb-visible-h>.eb-track-h:hover,.eb.eb-visible-v.eb-scrolling-phantom>.eb-track-v,.eb.eb-visible-v>.eb-track-v:hover{-webkit-transition:background-color .1s;transition:background-color .1s;background-color:rgba(0,0,0,.1)}.eb.eb-visible-h>.eb-track-h>.eb-thumb-h,.eb.eb-visible-v>.eb-track-v>.eb-thumb-v{-webkit-transition:background-color .3s;transition:background-color .3s;background-color:rgba(0,0,0,.15);border-radius:20px;display:block}.eb>.eb-track-v>.eb-thumb-v{width:100%}.eb>.eb-track-h>.eb-thumb-h{height:100%}.eb.eb-visible-h.eb-scrolling-phantom>.eb-track-h>.eb-thumb-h,.eb.eb-visible-h>.eb-track-h:hover>.eb-thumb-h,.eb.eb-visible-v.eb-scrolling-phantom>.eb-track-v>.eb-thumb-v,.eb.eb-visible-v>.eb-track-v:hover>.eb-thumb-v{-webkit-transition:background-color .1s;transition:background-color .1s;background-color:rgba(0,0,0,.3)}";
styleInject(css);

/**
 * @author:Ybao
 */

var HideNativeBarClass = "hide-native-bar";
var IsFirefox = BrowserUtils.isFirefox();
/**
 *
 * @param {HTMLElement} el 元素
 */
function checkCevEl(el) {
    if (!el.firstElementChild) {
        return false;
    }
    return true;
}
/**
 * 计算原生圆滚动条大小
 * @returns {Array}  [v, h]
 */
function getNativeScrollbarWidth() {
    var container = document.body;

    var box = document.createElement("div");
    var cev = document.createElement("div");

    box.className = HideNativeBarClass;
    box.style.position = "absolute";
    box.style.pointerEvents = "none";
    box.style.bottom = "0";
    box.style.right = "0";
    box.style.width = "100px";
    box.style.height = "100px";
    box.style.overflow = "hidden";

    cev.style.width = "100%";
    cev.style.height = "100%";

    box.appendChild(cev);
    container.appendChild(box);

    var fullWidth = cev.offsetWidth;
    var fullHeight = cev.offsetHeight;

    box.style.overflow = "scroll";

    var v = fullWidth - cev.offsetWidth;
    var h = fullHeight - cev.offsetHeight;

    container.removeChild(box);

    return {
        v: v,
        h: h
    };
}

function createBar() {
    var scrollBarTrack = document.createElement("div");
    scrollBarTrack.style.position = "absolute";
    var scrollBarThumb = document.createElement("div");
    scrollBarThumb.style.position = "absolute";

    scrollBarTrack.appendChild(scrollBarThumb);
    return {
        scrollBarTrack: scrollBarTrack,
        scrollBarThumb: scrollBarThumb
    };
}

/**
 *
 * @param {*} state
 */
function careteMutationObserver(state) {
    if ((typeof MutationObserver === "undefined" ? "undefined" : _typeof(MutationObserver)) === _typeof(void 0)) {
        return null;
    }

    return new MutationObserver(Utils.throttle(function () {
        _refreshBar(state);
    }, function () {
        return state.config.observerThrottle;
    }));
}

/**
 *
 * @param {*} state
 */
function initScrollHandler(state) {
    if (!state.scrollHandler) {
        state.scrollHandler = Utils.throttle(function () {
            computeArea(state);
            updateScrollBar(state);
            updateScrollBar(state);
            withScrollingClass(state);
        }, function () {
            return state.config.scrollThrottle;
        });
    }
}

/**
 *
 * @param {*} state
 */
function initMouseDown(state) {
    if (!state.mouseDown) {
        state.mouseDown = function (event) {
            if (!event.targetTouches && event.which !== 1) {
                return false;
            }
            var p = event.targetTouches ? event.targetTouches[0] : event;
            if (state.vBar && this == state.vBar.scrollBarThumb) {
                state.vBar.barDragging = true;
                state.vBar.startMouse = p.clientY - state.vBar.scrollBarThumb.getBoundingClientRect().top;
            } else if (state.hBar && this == state.hBar.scrollBarThumb) {
                state.hBar.barDragging = true;
                state.hBar.startMouse = p.clientX - state.hBar.scrollBarThumb.getBoundingClientRect().left;
            } else {
                return false;
            }

            Utils.addClass(state.scrollBox, state.config.clsBoxDragging);
            state.draggingPhantomClassTimer && clearTimeout(state.draggingPhantomClassTimer);
            Utils.addClass(state.scrollBox, state.config.clsBoxDraggingPhantomClass);

            document.addEventListener("mousemove", state.mouseMove, 1);
            document.addEventListener("mouseup", state.mouseUp, 1);
            document.addEventListener("touchmove", state.mouseMove, 1);
            document.addEventListener("touchend", state.mouseUp, 1);
            event.preventDefault();
            event.stopPropagation();
        };
    }
}

/**
 *
 * @param {*} state
 */
function initMouseMove(state) {
    if (!state.mouseMove) {
        state.mouseMove = Utils.throttle(function (event) {
            var p = event.targetTouches ? event.targetTouches[0] : event;
            onDragging(state, p);
        }, function () {
            return state.config.draggerThrottle;
        }, function (event) {
            event.preventDefault();
            event.stopPropagation();
        });
    }
}

/**
 *
 * @param {*} state
 */
function initMouseUp(state) {
    if (!state.mouseUp) {
        state.mouseUp = function (event) {
            state.vBar && (state.vBar.barDragging = false);
            state.hBar && (state.hBar.barDragging = false);

            Utils.removeClass(state.scrollBox, state.config.clsBoxDragging);
            state.draggingPhantomClassTimer && clearTimeout(state.draggingPhantomClassTimer);
            state.draggingPhantomClassTimer = setTimeout(function () {
                Utils.removeClass(state.scrollBox, state.config.clsBoxDraggingPhantomClass);
                state.draggingPhantomClassTimer && delete state.draggingPhantomClassTimer;
            }, state.config.draggingPhantomDelay);

            document.removeEventListener("mousemove", state.mouseMove, 1);
            document.removeEventListener("mouseup", state.mouseUp, 1);
            document.removeEventListener("touchmove", state.mouseMove, 1);
            document.removeEventListener("touchend", state.mouseUp, 1);
            event.preventDefault();
            event.stopPropagation();
        };
    }
}

/**
 *
 * @param {*} state
 */
function bindWheelHandler(state) {
    if (state.config.preventParentScroll) {
        if (!state.wheelHandler) {
            state.wheelHandler = function (event) {
                if (state.visibleArea >= 1) {
                    return false;
                }
                var scrollDistV = state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight;
                var scrollTop = state.scrollCevBox.scrollTop;

                var wheelingUp = event.deltaY < 0;
                var wheelingDown = event.deltaY > 0;
                if (scrollTop <= 0 && wheelingUp || scrollTop >= scrollDistV && wheelingDown) {
                    event.preventDefault();
                    return false;
                }

                var scrollDistH = state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight;
                var scrollLeft = state.scrollCevBox.scrollLeft;

                var wheelingLeft = event.deltaX < 0;
                var wheelingRight = event.deltaX > 0;
                if (scrollLeft <= 0 && wheelingLeft || scrollLeft >= scrollDistH && wheelingRight) {
                    event.preventDefault();
                    return false;
                }
                event.stopPropagation();
                return true;
            };
            state.scrollCevBox.addEventListener("wheel", state.wheelHandler, 0);
        }
    } else {
        unBindWheelHandler(state);
    }
}

function unBindWheelHandler(state) {
    if (state.wheelHandler) {
        state.scrollCevBox.removeEventListener("wheel", state.wheelHandler, 0);
        delete state.wheelHandler;
    }
}

/**
 *
 * @param {*} state
 */
function bindResizeHandler(state) {
    if (state.config.resizeRefresh) {
        if (!state.resizeHandler) {
            state.resizeHandler = Utils.debounce(function () {
                _refreshBar(state);
            }, function () {
                return state.config.resizeDebounce;
            });

            window.addEventListener("resize", state.resizeHandler, 0);
        }
    } else {
        unBindResizeHandler(state);
    }
}

function unBindResizeHandler(state) {
    if (state.resizeHandler) {
        window.removeEventListener("resize", state.resizeHandler, 0);
        delete state.resizeHandler;
    }
}

/**
 *
 * @param {*} state
 */
function bindScrollBox(state) {
    if (!state.scrollCevBox) {
        state.scrollBox = state.rootEl;
        state.scrollBoxClip = document.createElement("div");
        state.scrollCev = state.rootEl.firstElementChild;
        state.scrollCevBox = document.createElement("div");

        Utils.addClass(state.scrollBox, state.config.clsBox);
        state.scrollBox.style.position = "relative";
        state.scrollBox.style.overflow = "hidden";

        state.scrollBoxClip.style.height = "100%";
        state.scrollBoxClip.style.width = "100%";
        state.scrollBoxClip.style.overflow = "hidden";

        Utils.addClass(state.scrollCevBox, state.config.clsContent);
        Utils.addClass(state.scrollCevBox, HideNativeBarClass);
        state.scrollCevBox.style.display = "block";
        state.scrollCevBox.style.overflow = "hidden";
        state.scrollCevBox.style.height = "100%";
        state.scrollCevBox.style.width = "100%";

        state.scrollBox.removeChild(state.scrollCev);
        state.scrollCevBox.appendChild(state.scrollCev);
        state.scrollBoxClip.appendChild(state.scrollCevBox);
        state.scrollBox.appendChild(state.scrollBoxClip);

        state.scrollCevBox.addEventListener("scroll", state.scrollHandler, 0);

        state.mutationObserver = careteMutationObserver(state);
        state.mutationObserver && state.mutationObserver.observe(state.scrollCevBox, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }
}

function unBindScrollBox(state) {
    if (state.scrollCevBox) {
        Utils.removeClass(state.scrollBox, state.config.clsBox);
        state.scrollBox.style.position = "";
        state.scrollBox.style.overflow = "";

        state.scrollCev.style.display = "";

        state.scrollBox.removeChild(state.scrollBoxClip);
        state.scrollCevBox.removeChild(state.scrollCev);
        state.scrollBox.appendChild(state.scrollCev);

        state.scrollCevBox.removeEventListener("scroll", state.scrollHandler, 0);

        if (state.mutationObserver) {
            state.mutationObserver.disconnect();
            delete state.mutationObserver;
        }

        delete state.scrollCev;
        delete state.scrollCevBox;
        delete state.scrollBoxClip;
        delete state.scrollBox;
    }
}

/**
 *
 * @param {*} state
 */
function bindScrollBar(state) {
    var bar;
    if (state.barBehavior.vBarEnable && state.barBehavior.vBarShow) {
        if (!state.vBar) {
            bar = createBar();
            state.vBar = {
                scrollBarTrack: bar.scrollBarTrack,
                scrollBarThumb: bar.scrollBarThumb
            };
            Utils.compatStyle(state.vBar.scrollBarTrack, "userSelect", "none");
            state.scrollBox.appendChild(state.vBar.scrollBarTrack);
            state.vBar.scrollBarThumb.addEventListener("mousedown", state.mouseDown, 0);
            state.vBar.scrollBarThumb.addEventListener("touchstart", state.mouseDown, 0);
        }
        state.vBar.scrollBarTrack.className = state.config.clsTrackV;
        state.vBar.scrollBarThumb.className = state.config.clsThumbV;
    } else {
        unBindScrollBarV(state);
    }
    if (state.barBehavior.hBarEnable && state.barBehavior.hBarShow) {
        if (!state.hBar) {
            bar = createBar();
            state.hBar = {
                scrollBarTrack: bar.scrollBarTrack,
                scrollBarThumb: bar.scrollBarThumb
            };
            Utils.compatStyle(state.hBar.scrollBarTrack, "userSelect", "none");
            state.scrollBox.appendChild(state.hBar.scrollBarTrack);
            state.hBar.scrollBarThumb.addEventListener("mousedown", state.mouseDown, 0);
            state.hBar.scrollBarThumb.addEventListener("touchstart", state.mouseDown, 0);
        }
        state.hBar.scrollBarTrack.className = state.config.clsTrackH;
        state.hBar.scrollBarThumb.className = state.config.clsThumbH;
    } else {
        unBindScrollBarH(state);
    }
    updateScrollCevBoxStyle(state);
}

function updateScrollCevBoxStyle(state) {
    if (!state.vBar && !state.hBar) {
        state.scrollCevBox.style.overflow = "hidden";
        state.scrollCevBox.style.height = "100%";
        state.scrollCevBox.style.width = "100%";
    } else {
        //大部分浏览起的scrollbar都通过css隐藏，剩下的移除屏幕隐藏
        var nBarW = getNativeScrollbarWidth();
        if (state.vBar) {
            state.scrollCevBox.style.overflowY = "scroll";
            state.scrollCevBox.style.width = "calc(100% + " + nBarW.v + "px)";
            if (IsFirefox && nBarW.v == 0) {
                //火狐手机端悬浮bar 隐藏不了
                state.vBar.scrollBarTrack.style.display = "none";
            }
        } else {
            state.scrollCevBox.style.overflowY = "hidden";
            state.scrollCevBox.style.width = "100%";
        }
        if (state.hBar) {
            state.scrollCevBox.style.overflowX = "scroll";
            state.scrollCevBox.style.height = "calc(100% + " + nBarW.h + "px)";
            if (IsFirefox && nBarW.h == 0) {
                //火狐手机端悬浮bar 隐藏不了
                state.hBar.scrollBarTrack.style.display = "none";
            }
        } else {
            state.scrollCevBox.style.overflowX = "hidden";
            state.scrollCevBox.style.height = "100%";
        }
    }
}

function unBindScrollBar(state) {
    unBindScrollBarV(state);
    unBindScrollBarH(state);
}

function unBindScrollBarV(state) {
    if (state.vBar) {
        state.vBar.scrollBarThumb.removeEventListener("mousedown", state.mouseDown, 0);
        state.vBar.scrollBarThumb.removeEventListener("touchstart", state.mouseDown, 0);
        state.scrollBox.removeChild(state.vBar.scrollBarTrack);
        delete state.vBar;
    }
}

function unBindScrollBarH(state) {
    if (state.hBar) {
        state.hBar.scrollBarThumb.removeEventListener("mousedown", state.mouseDown, 0);
        state.hBar.scrollBarThumb.removeEventListener("touchstart", state.mouseDown, 0);
        state.scrollBox.removeChild(state.hBar.scrollBarTrack);
        delete state.hBar;
    }
}

/**
 *
 * @param {*} state
 */
function computeArea(state) {
    var bar, visibleArea, _barLength, barLength, minBarBoxLength;
    if (bar = state.vBar) {
        visibleArea = state.scrollCevBox.scrollHeight == 0 ? 1 : state.scrollCevBox.clientHeight / state.scrollCevBox.scrollHeight;
        bar.scrollOffsetArea = visibleArea;
        bar.barBoxLength = bar.scrollBarTrack.clientHeight;

        if (visibleArea >= 1) {
            bar.barLength = 0;

            Utils.removeClass(state.scrollBox, state.config.clsBoxVisibleBarV);
            Utils.addClass(state.scrollBox, state.config.clsBoxInvisibleBarV);
        } else {
            _barLength = bar.scrollBarTrack.clientHeight * visibleArea;
            barLength = _barLength;
            barLength = state.config.minLength > 0 && state.config.minLength > barLength ? state.config.minLength : barLength;
            barLength = state.config.maxLength > 0 && state.config.maxLength < barLength ? state.config.maxLength : barLength;
            bar.barLength = barLength;
            minBarBoxLength = (state.config.minLength > 0 ? state.config.minLength : 0) + 100;
            bar.barBoxLength = minBarBoxLength > bar.scrollBarTrack.clientHeight ? minBarBoxLength : bar.scrollBarTrack.clientHeight;
            bar.scrollOffsetArea = (bar.barBoxLength - barLength) / (bar.scrollBarTrack.clientHeight - _barLength) * (bar.scrollBarTrack.clientHeight / state.scrollCevBox.scrollHeight);

            Utils.removeClass(state.scrollBox, state.config.clsBoxInvisibleBarV);
            Utils.addClass(state.scrollBox, state.config.clsBoxVisibleBarV);
        }
    }

    if (bar = state.hBar) {
        visibleArea = state.scrollCevBox.scrollWidth == 0 ? 1 : state.scrollCevBox.clientWidth / state.scrollCevBox.scrollWidth;
        bar.scrollOffsetArea = visibleArea;
        bar.barBoxLength = bar.scrollBarTrack.clientWidth;
        if (visibleArea >= 1) {
            bar.barLength = 0;

            Utils.removeClass(state.scrollBox, state.config.clsBoxVisibleBarH);
            Utils.addClass(state.scrollBox, state.config.clsBoxInvisibleBarH);
        } else {
            _barLength = bar.scrollBarTrack.clientWidth * visibleArea;
            barLength = _barLength;
            barLength = state.config.minLength > 0 && state.config.minLength > barLength ? state.config.minLength : barLength;
            barLength = state.config.maxLength > 0 && state.config.maxLength < barLength ? state.config.maxLength : barLength;
            bar.barLength = barLength;
            minBarBoxLength = (state.config.minLength > 0 ? state.config.minLength : 0) + 100;
            bar.barBoxLength = minBarBoxLength > bar.scrollBarTrack.clientWidth ? minBarBoxLength : bar.scrollBarTrack.clientWidth;
            bar.scrollOffsetArea = (bar.barBoxLength - barLength) / (bar.scrollBarTrack.clientWidth - _barLength) * (bar.scrollBarTrack.clientWidth / state.scrollCevBox.scrollWidth);

            Utils.removeClass(state.scrollBox, state.config.clsBoxInvisibleBarH);
            Utils.addClass(state.scrollBox, state.config.clsBoxVisibleBarH);
        }
    }
}

/**
 *
 * @param {*} state
 */
function updateScrollBar(state) {
    var bar;
    if (bar = state.vBar) {
        bar.barOffset = state.scrollCevBox.scrollTop * bar.scrollOffsetArea;

        bar.scrollBarThumb.style.height = parseInt(Math.round(bar.barLength)) + "px";
        bar.scrollBarThumb.style.top = parseInt(Math.round(bar.barOffset)) + "px";
    }

    if (bar = state.hBar) {
        bar.barOffset = state.scrollCevBox.scrollLeft * bar.scrollOffsetArea;

        bar.scrollBarThumb.style.width = parseInt(Math.round(bar.barLength)) + "px";
        bar.scrollBarThumb.style.left = parseInt(Math.round(bar.barOffset)) + "px";
    }
}

/**
 *
 * @param {*} state
 */
function onDragging(state, p) {
    var handlerEvent = false;
    var bar, relativeMouse;
    if ((bar = state.vBar) && bar.barDragging) {
        relativeMouse = p.clientY - bar.scrollBarTrack.getBoundingClientRect().top;
        if (relativeMouse <= bar.startMouse) {
            bar.barOffset = 0;
        }

        if (relativeMouse > bar.startMouse) {
            bar.barOffset = relativeMouse - bar.startMouse;
        }

        if (bar.barOffset + bar.barLength >= bar.barBoxLength) {
            bar.barOffset = bar.barBoxLength - bar.barLength;
        }
        state.scrollCevBox.scrollTop = bar.barOffset / bar.scrollOffsetArea;
        handlerEvent = true;
    }
    if ((bar = state.hBar) && bar.barDragging) {
        relativeMouse = p.clientX - bar.scrollBarTrack.getBoundingClientRect().left;
        if (relativeMouse <= bar.startMouse) {
            bar.barOffset = 0;
        }

        if (relativeMouse > bar.startMouse) {
            bar.barOffset = relativeMouse - bar.startMouse;
        }

        if (bar.barOffset + bar.barLength >= bar.barBoxLength) {
            bar.barOffset = bar.barBoxLength - bar.barLength;
        }
        state.scrollCevBox.scrollLeft = bar.barOffset / bar.scrollOffsetArea;
        handlerEvent = true;
    }
    return handlerEvent;
}

function withScrollingClass(state) {
    state.scrollingClassTimeout && clearTimeout(state.scrollingClassTimeout);
    Utils.addClass(state.scrollBox, state.config.clsBoxScrolling);
    state.scrollingClassTimeout = setTimeout(function () {
        Utils.removeClass(state.scrollBox, state.config.clsBoxScrolling);
        state.scrollingClassTimeout && delete state.scrollingClassTimeout;
    }, state.config.scrollThrottle + 5);

    state.scrollingPhantomClassTimeout && clearTimeout(state.scrollingPhantomClassTimeout);
    Utils.addClass(state.scrollBox, state.config.clsBoxScrollingPhantom);
    state.scrollingPhantomClassTimeout = setTimeout(function () {
        Utils.removeClass(state.scrollBox, state.config.clsBoxScrollingPhantom);
        state.scrollingPhantomClassTimeout && delete state.scrollingPhantomClassTimeout;
    }, state.config.scrollThrottle + state.config.scrollingPhantomDelay);
}

function clearBarTimeout(state) {
    state.draggingPhantomClassTimer && clearTimeout(state.draggingPhantomClassTimer);
    state.scrollingClassTimeout && clearTimeout(state.scrollingClassTimeout);
    state.scrollingPhantomClassTimeout && clearTimeout(state.scrollingPhantomClassTimeout);
}

function init(state, nextTickHandler) {
    state.nextTickHandler = nextTickHandler;
    initScrollHandler(state);
    initMouseDown(state);
    initMouseMove(state);
    initMouseUp(state);
}

function create(state) {
    bindScrollBox(state);
    bindScrollBar(state);

    bindWheelHandler(state);
    bindResizeHandler(state);
}

/**
 *
 * @param {*} state
 */
function _refreshBar(state) {
    var refreshFn = function refreshFn() {
        if (!state) {
            return;
        }
        computeArea(state);
        updateScrollBar(state);
    };
    if (state.nextTickHandler) {
        state.nextTickHandler(refreshFn);
    } else {
        refreshFn();
    }
}

function destroy(state) {
    clearBarTimeout(state);
    unBindResizeHandler(state);
    unBindWheelHandler(state);

    unBindScrollBar(state);
    unBindScrollBox(state);
}

function analyzeScrollBarBehavior(scrollBarBehavior) {
    scrollBarBehavior = scrollBarBehavior || "";
    var v = "show",
        h = "show";
    var oneRegex = /^\s*(show|hide|none)\s*$/i;
    var twoRegex = /^\s*(show|hide|none)\s+(show|hide|none)\s*$/i;
    var match;
    if (match = scrollBarBehavior.match(oneRegex)) {
        if (match.length >= 2) {
            v = h = match[1].toLowerCase();
        }
    } else if (match = scrollBarBehavior.match(twoRegex)) {
        if (match.length >= 3) {
            v = match[1].toLowerCase();
            h = match[2].toLowerCase();
        }
    }
    var vBarEnable = true;
    var vBarShow = true;
    if (v == "none") {
        vBarEnable = false;
        vBarShow = false;
    } else if (v == "hide") {
        vBarEnable = true;
        vBarShow = false;
    }
    var hBarEnable = true;
    var hBarShow = true;
    if (h == "none") {
        hBarEnable = false;
        hBarShow = false;
    } else if (h == "hide") {
        hBarEnable = true;
        hBarShow = false;
    }
    return {
        vBarEnable: vBarEnable,
        vBarShow: vBarShow,
        hBarEnable: hBarEnable,
        hBarShow: hBarShow
    };
}

function setOptions(state, options) {
    if (options) {
        for (var key in options) {
            state.config[key] = options[key];
        }
    }
    state.barBehavior = analyzeScrollBarBehavior(state.config.scrollBarBehavior);
}

var EasyBar = function () {
    function EasyBar(el, nextTickHandler) {
        classCallCheck(this, EasyBar);

        if (!checkCevEl(el)) {
            return {};
        }
        this.rootEl = el;

        this.config = {};
        setOptions(this, DefConfig);

        init(this, nextTickHandler);
    }

    createClass(EasyBar, [{
        key: "bind",
        value: function bind(options) {
            this.update(options);
            return this;
        }
    }, {
        key: "update",
        value: function update(options) {
            setOptions(this, options);
            create(this);
            _refreshBar(this);
            return this;
        }
    }, {
        key: "refreshBar",
        value: function refreshBar() {
            _refreshBar(this);
            return this;
        }
    }, {
        key: "unBind",
        value: function unBind() {
            destroy(this);
            return this;
        }
    }], [{
        key: "bind",
        value: function bind(el, options, nextTickHandler) {
            if (!el._easyBar) {
                el._easyBar = new EasyBar(el, nextTickHandler).bind(options);
            }
            return el._easyBar;
        }
    }, {
        key: "update",
        value: function update(el, options) {
            if (el._easyBar) {
                el._easyBar.update(options);
            }
        }
    }, {
        key: "get",
        value: function get$$1(el) {
            return el._easyBar;
        }
    }, {
        key: "refreshBar",
        value: function refreshBar(el) {
            if (el._easyBar) {
                el._easyBar.refreshBar();
            }
        }
    }, {
        key: "unBind",
        value: function unBind(el) {
            if (el._easyBar) {
                el._easyBar.unBind();
                delete el._easyBar;
            }
        }
    }, {
        key: "install",
        value: function install(Vue) {
            Vue.directive("bar", {
                inserted: function inserted(el, binding) {
                    EasyBar.bind(el, binding && binding.value ? binding.value : null, Vue.nextTick);
                },
                update: function update(el, binding) {
                    EasyBar.update(el, binding && binding.value ? binding.value : null);
                },
                componentUpdated: function componentUpdated(el) {
                    EasyBar.refreshBar(el);
                },
                unbind: function unbind(el) {
                    EasyBar.unBind(el);
                }
            });
            Object.defineProperty(Vue.prototype, "$EasyBar", {
                get: function get$$1() {
                    return EasyBar;
                }
            });
        }
    }]);
    return EasyBar;
}();

return EasyBar;

})));
