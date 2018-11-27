(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
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
         * @param {String} classNames 类名
         */

    }, {
        key: "addClass",
        value: function addClass(el) {
            for (var _len = arguments.length, classNames = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                classNames[_key - 1] = arguments[_key];
            }

            if (classNames && classNames.length > 0) {
                classNames.forEach(function (e) {
                    if (!e) {
                        return;
                    }
                    if (el.classList) {
                        el.classList.add(e);
                    } else if (!Utils.hasClass(el, e)) {
                        el.className += " " + e;
                    }
                });
            }
        }

        /**
         * 从元素删除类
         * @param {HTMLElement} el 元素
         * @param {String} classNames 类名
         */

    }, {
        key: "removeClass",
        value: function removeClass(el) {
            for (var _len2 = arguments.length, classNames = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                classNames[_key2 - 1] = arguments[_key2];
            }

            if (classNames && classNames.length > 0) {
                classNames.forEach(function (e) {
                    if (!e) {
                        return;
                    }
                    if (el.classList) {
                        el.classList.remove(e);
                    } else {
                        el.className = el.className.replace(new RegExp("\\b" + e + "\\b", "g"), "");
                    }
                });
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
         * 设置css属性兼容
         * @param {HTMLElement} el 元素
         * @param {String} property 属性名
         * @param {*} value 元素
         */

    }, {
        key: "style",
        value: function style(el, property, value) {
            if (el.style[property] != value) {
                el.style[property] = value;
            }
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
var DefConfig = {
    resizeRefresh: true,
    barfloat: true,
    preventParentScroll: false,
    scrollBarBehavior: null, //show|hide|none show|hide|none

    scrollThrottle: 10,
    draggerThrottle: 10,
    observerThrottle: 200,
    resizeDebounce: 200,
    scrollingPhantomDelay: 1000,
    draggingPhantomDelay: 1000,

    clsBox: "",
    clsBoxScrolling: "",
    clsBoxScrollingPhantom: "",
    clsBoxDragging: "",
    clsBoxDraggingPhantomClass: "",

    clsBoxVisibleBarV: "",
    clsBoxInvisibleBarV: "",
    clsBoxVisibleBarH: "",
    clsBoxInvisibleBarH: "",

    clsBoxClip: "",

    clsContent: "",

    clsBarV: "",
    clsBarH: "",

    clsTrack: "",
    clsThumb: ""
};

var DefCls = {
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

var css = ".hide-native-bar::-webkit-scrollbar{display:none}.hide-native-bar::-o-scrollbar{display:none}.hide-native-bar{-ms-overflow-style:none}.eb>.eb-bar-h,.eb>.eb-bar-v{z-index:1;-webkit-box-sizing:border-box;box-sizing:border-box}.eb>.eb-bar-v{left:auto;top:0;right:0;bottom:0;width:16px;padding:4px}.eb.eb-visible-h>.eb-bar-v{bottom:8px}.eb>.eb-bar-h{left:0;top:auto;right:0;bottom:0;height:16px;padding:4px}.eb.eb-visible-v>.eb-bar-h{right:8px}.eb>.eb-bar-h>.eb-track,.eb>.eb-bar-v>.eb-track{-webkit-transition:background-color .3s;transition:background-color .3s;border-radius:20px;width:100%;height:100%}.eb>.eb-bar-v>.eb-track{min-height:150px}.eb>.eb-bar-h>.eb-track{min-width:150px}.eb.eb-visible-h.eb-scrolling-phantom>.eb-bar-h .eb-track,.eb.eb-visible-h>.eb-bar-h:hover .eb-track,.eb.eb-visible-v.eb-scrolling-phantom>.eb-bar-v .eb-track,.eb.eb-visible-v>.eb-bar-v:hover .eb-track{-webkit-transition:background-color .1s;transition:background-color .1s;background-color:rgba(0,0,0,.1)}.eb>.eb-bar-v .eb-thumb{width:100%;min-height:50px}.eb>.eb-bar-h .eb-thumb{height:100%;min-width:50px}.eb.eb-visible-h>.eb-bar-h .eb-thumb,.eb.eb-visible-v>.eb-bar-v .eb-thumb{-webkit-transition:background-color .3s;transition:background-color .3s;background-color:rgba(0,0,0,.15);border-radius:20px}.eb.eb-visible-h.eb-scrolling-phantom>.eb-bar-h .eb-thumb,.eb.eb-visible-h>.eb-bar-h:hover .eb-thumb,.eb.eb-visible-v.eb-scrolling-phantom>.eb-bar-v .eb-thumb,.eb.eb-visible-v>.eb-bar-v:hover .eb-thumb{-webkit-transition:background-color .1s;transition:background-color .1s;background-color:rgba(0,0,0,.3)}";
styleInject(css);

/**
 * @author:Ybao
 */

var HideNativeBarClass = "hide-native-bar";
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
    var scrollBarBox = document.createElement("div");
    scrollBarBox.style.position = "absolute";
    scrollBarBox.style.overflow = "hidden";
    var scrollBarTrack = document.createElement("div");
    scrollBarTrack.style.position = "relative";
    scrollBarTrack.style.overflow = "hidden";
    var scrollBarThumb = document.createElement("div");
    scrollBarThumb.style.position = "relative";

    scrollBarTrack.appendChild(scrollBarThumb);
    scrollBarBox.appendChild(scrollBarTrack);
    return {
        scrollBarBox: scrollBarBox,
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
        if (!state.isBinded) {
            return;
        }
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
            if (!state.isBinded) {
                return;
            }
            computeScrollBarBox(state);
            computeScrollBarThumb(state);
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
            if (!state.isBinded) {
                return false;
            }
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

            Utils.addClass(state.scrollBox, DefCls.clsBoxDragging, state.config.clsBoxDragging);
            state.draggingPhantomClassTimer && clearTimeout(state.draggingPhantomClassTimer);
            Utils.addClass(state.scrollBox, DefCls.clsBoxDraggingPhantomClass, state.config.clsBoxDraggingPhantomClass);

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
            if (!state.isBinded) {
                return;
            }
            var p = event.targetTouches ? event.targetTouches[0] : event;
            onDragging(state, p);
        }, function () {
            return state.config.draggerThrottle;
        }, function (event) {
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
            if (!state.isBinded) {
                return;
            }
            state.vBar && (state.vBar.barDragging = false);
            state.hBar && (state.hBar.barDragging = false);

            Utils.removeClass(state.scrollBox, DefCls.clsBoxDragging, state.config.clsBoxDragging);
            state.draggingPhantomClassTimer && clearTimeout(state.draggingPhantomClassTimer);
            state.draggingPhantomClassTimer = setTimeout(function () {
                Utils.removeClass(state.scrollBox, DefCls.clsBoxDraggingPhantomClass, state.config.clsBoxDraggingPhantomClass);
                state.draggingPhantomClassTimer && delete state.draggingPhantomClassTimer;
            }, state.config.draggingPhantomDelay);

            document.removeEventListener("mousemove", state.mouseMove, 1);
            document.removeEventListener("mouseup", state.mouseUp, 1);
            document.removeEventListener("touchmove", state.mouseMove, 1);
            document.removeEventListener("touchend", state.mouseUp, 1);
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
                if (!state.isBinded) {
                    return;
                }
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
                if (!state.isBinded) {
                    return;
                }
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

        Utils.addClass(state.scrollBox, DefCls.clsBox, state.config.clsBox);
        state.scrollBox.style.position = "relative";
        state.scrollBox.style.overflow = "hidden";

        Utils.addClass(state.scrollBoxClip, DefCls.clsBoxClip, state.config.clsBoxClip);
        state.scrollBoxClip.style.height = "100%";
        state.scrollBoxClip.style.width = "100%";
        state.scrollBoxClip.style.overflow = "hidden";
        state.scrollBoxClip.style.boxSizing = "border-box";

        Utils.addClass(state.scrollCevBox, DefCls.clsContent, state.config.clsContent);
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
        Utils.removeClass(state.scrollBox, DefCls.clsBox, state.config.clsBox);
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
    var bar = void 0;
    if (state.barBehavior.vBarEnable && state.barBehavior.vBarShow) {
        if (!state.vBar) {
            bar = createBar();
            state.vBar = {
                scrollBarBox: bar.scrollBarBox,
                scrollBarTrack: bar.scrollBarTrack,
                scrollBarThumb: bar.scrollBarThumb
            };
            Utils.compatStyle(state.vBar.scrollBarBox, "userSelect", "none");
            state.scrollBox.appendChild(state.vBar.scrollBarBox);
            state.vBar.scrollBarThumb.addEventListener("mousedown", state.mouseDown, 0);
            state.vBar.scrollBarThumb.addEventListener("touchstart", state.mouseDown, 0);
        }
        Utils.addClass(state.vBar.scrollBarBox, DefCls.clsBarV, state.config.clsBarV);
        Utils.addClass(state.vBar.scrollBarTrack, DefCls.clsTrack, state.config.clsTrack);
        Utils.addClass(state.vBar.scrollBarThumb, DefCls.clsThumb, state.config.clsThumb);
    } else {
        unBindScrollBarV(state);
    }
    if (state.barBehavior.hBarEnable && state.barBehavior.hBarShow) {
        if (!state.hBar) {
            bar = createBar();
            state.hBar = {
                scrollBarBox: bar.scrollBarBox,
                scrollBarTrack: bar.scrollBarTrack,
                scrollBarThumb: bar.scrollBarThumb
            };
            Utils.compatStyle(state.hBar.scrollBarBox, "userSelect", "none");
            state.scrollBox.appendChild(state.hBar.scrollBarBox);
            state.hBar.scrollBarThumb.addEventListener("mousedown", state.mouseDown, 0);
            state.hBar.scrollBarThumb.addEventListener("touchstart", state.mouseDown, 0);
        }
        Utils.addClass(state.hBar.scrollBarBox, DefCls.clsBarH, state.config.clsBarH);
        Utils.addClass(state.hBar.scrollBarTrack, DefCls.clsTrack, state.config.clsTrack);
        Utils.addClass(state.hBar.scrollBarThumb, DefCls.clsThumb, state.config.clsThumb);
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
        } else {
            state.scrollCevBox.style.overflowY = "hidden";
            state.scrollCevBox.style.width = "100%";
        }
        if (state.hBar) {
            state.scrollCevBox.style.overflowX = "scroll";
            state.scrollCevBox.style.height = "calc(100% + " + nBarW.h + "px)";
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
        state.scrollBox.removeChild(state.vBar.scrollBarBox);
        delete state.vBar;
    }
}

function unBindScrollBarH(state) {
    if (state.hBar) {
        state.hBar.scrollBarThumb.removeEventListener("mousedown", state.mouseDown, 0);
        state.hBar.scrollBarThumb.removeEventListener("touchstart", state.mouseDown, 0);
        state.scrollBox.removeChild(state.hBar.scrollBarBox);
        delete state.hBar;
    }
}

function computeScrollBarBox(state) {
    var showBarV = 0,
        showBarH = 0;
    state.scrollBoxClip.style.width = "100%";
    state.scrollBoxClip.style.height = "100%";
    state.vBar && (state.vBar.scrollBarBox.style.display = "");
    state.hBar && (state.hBar.scrollBarBox.style.display = "");

    if (state.vBar && state.scrollCevBox.clientHeight < state.scrollCevBox.scrollHeight) {
        showBarV = state.vBar.scrollBarBox.clientWidth;
        if (!state.config.barfloat) {
            state.scrollBoxClip.style.width = "calc(100% - " + showBarV + "px)";
        }
        state.vBar.show = showBarV > 0;
    }
    if (state.hBar && state.scrollCevBox.clientWidth < state.scrollCevBox.scrollWidth) {
        showBarH = state.hBar.scrollBarBox.clientHeight;
        if (!state.config.barfloat) {
            state.scrollBoxClip.style.height = "calc(100% - " + showBarH + "px)";
        }
        state.hBar.show = showBarH > 0;
    }
    if (showBarV <= 0 && showBarH > 0) {
        if (state.vBar && state.scrollCevBox.clientHeight < state.scrollCevBox.scrollHeight) {
            showBarV = state.vBar.scrollBarBox.clientWidth;
            if (!state.config.barfloat) {
                state.scrollBoxClip.style.width = "calc(100% - " + showBarV + "px)";
            }
            state.vBar.show = showBarV > 0;
        }
    } else if (showBarV > 0 && showBarH <= 0) {
        if (state.hBar && state.scrollCevBox.clientWidth < state.scrollCevBox.scrollWidth) {
            showBarH = state.hBar.scrollBarBox.clientHeight;
            if (!state.config.barfloat) {
                state.scrollBoxClip.style.height = "calc(100% - " + showBarH + "px)";
            }
            state.hBar.show = showBarH > 0;
        }
    }
    showBarV <= 0 && state.vBar && (state.vBar.scrollBarBox.style.display = "none");
    showBarH <= 0 && state.hBar && (state.hBar.scrollBarBox.style.display = "none");
    computeScrollBoxStyle(state);
}

function computeScrollBoxStyle(state) {
    var bar = void 0;
    if ((bar = state.vBar) && bar.show) {
        Utils.removeClass(state.scrollBox, DefCls.clsBoxInvisibleBarV, state.config.clsBoxInvisibleBarV);
        Utils.addClass(state.scrollBox, DefCls.clsBoxVisibleBarV, state.config.clsBoxVisibleBarV);
    } else {
        Utils.removeClass(state.scrollBox, DefCls.clsBoxVisibleBarV, state.config.clsBoxVisibleBarV);
        Utils.addClass(state.scrollBox, DefCls.clsBoxInvisibleBarV, state.config.clsBoxInvisibleBarV);
    }
    if ((bar = state.hBar) && bar.show) {
        Utils.removeClass(state.scrollBox, DefCls.clsBoxInvisibleBarH, state.config.clsBoxInvisibleBarH);
        Utils.addClass(state.scrollBox, DefCls.clsBoxVisibleBarH, state.config.clsBoxVisibleBarH);
    } else {
        Utils.removeClass(state.scrollBox, DefCls.clsBoxVisibleBarH, state.config.clsBoxVisibleBarH);
        Utils.addClass(state.scrollBox, DefCls.clsBoxInvisibleBarH, state.config.clsBoxInvisibleBarH);
    }
}

/**
 *
 * @param {*} state
 */
function computeScrollBarThumb(state) {
    var bar = void 0,
        visibleArea = void 0,
        barLength = void 0,
        barOffset = void 0,
        scrollOffsetArea = void 0;
    if ((bar = state.vBar) && bar.show) {
        visibleArea = state.scrollCevBox.scrollHeight == 0 ? 1 : state.scrollCevBox.clientHeight / state.scrollCevBox.scrollHeight;

        barLength = bar.scrollBarTrack.clientHeight * visibleArea;
        bar.scrollBarThumb.style.height = parseInt(Math.round(barLength)) + "px";

        scrollOffsetArea = (bar.scrollBarTrack.clientHeight - bar.scrollBarThumb.clientHeight) / (state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight);

        barOffset = state.scrollCevBox.scrollTop * scrollOffsetArea;
        bar.scrollBarThumb.style.top = parseInt(Math.round(barOffset)) + "px";
    }

    if ((bar = state.hBar) && bar.show) {
        visibleArea = state.scrollCevBox.scrollWidth == 0 ? 1 : state.scrollCevBox.clientWidth / state.scrollCevBox.scrollWidth;

        barLength = bar.scrollBarTrack.clientWidth * visibleArea;
        bar.scrollBarThumb.style.width = parseInt(Math.round(barLength)) + "px";

        scrollOffsetArea = (bar.scrollBarTrack.clientWidth - bar.scrollBarThumb.clientWidth) / (state.scrollCevBox.scrollWidth - state.scrollCevBox.clientWidth);

        barOffset = state.scrollCevBox.scrollLeft * scrollOffsetArea;
        bar.scrollBarThumb.style.left = parseInt(Math.round(barOffset)) + "px";
    }
}

/**
 *
 * @param {*} state
 */
function onDragging(state, p) {
    var handlerEvent = false;
    var bar = void 0,
        relativeMouse = void 0,
        barOffset = void 0,
        scrollOffsetArea = void 0;
    if ((bar = state.vBar) && bar.barDragging && bar.show) {
        relativeMouse = p.clientY - bar.scrollBarTrack.getBoundingClientRect().top;
        if (relativeMouse <= bar.startMouse) {
            barOffset = 0;
        }

        if (relativeMouse > bar.startMouse) {
            barOffset = relativeMouse - bar.startMouse;
        }

        if (barOffset + bar.scrollBarThumb.clientHeight >= bar.scrollBarTrack.clientHeight) {
            barOffset = bar.scrollBarTrack.clientHeight - bar.scrollBarThumb.clientHeight;
        }
        scrollOffsetArea = (state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight) / (bar.scrollBarTrack.clientHeight - bar.scrollBarThumb.clientHeight);
        state.scrollCevBox.scrollTop = barOffset * scrollOffsetArea;
        handlerEvent = true;
    }
    if ((bar = state.hBar) && bar.barDragging && bar.show) {
        relativeMouse = p.clientX - bar.scrollBarTrack.getBoundingClientRect().left;
        if (relativeMouse <= bar.startMouse) {
            barOffset = 0;
        }

        if (relativeMouse > bar.startMouse) {
            barOffset = relativeMouse - bar.startMouse;
        }

        if (barOffset + bar.scrollBarThumb.clientWidth >= bar.scrollBarTrack.clientWidth) {
            barOffset = bar.scrollBarTrack.clientWidth - bar.scrollBarThumb.clientWidth;
        }
        scrollOffsetArea = (state.scrollCevBox.scrollWidth - state.scrollCevBox.clientWidth) / (bar.scrollBarTrack.clientWidth - bar.scrollBarThumb.clientWidth);
        state.scrollCevBox.scrollLeft = barOffset * scrollOffsetArea;
        handlerEvent = true;
    }
    return handlerEvent;
}

function withScrollingClass(state) {
    state.scrollingClassTimeout && clearTimeout(state.scrollingClassTimeout);
    Utils.addClass(state.scrollBox, DefCls.clsBoxScrolling, state.config.clsBoxScrolling);
    state.scrollingClassTimeout = setTimeout(function () {
        Utils.removeClass(state.scrollBox, DefCls.clsBoxScrolling, state.config.clsBoxScrolling);
        state.scrollingClassTimeout && delete state.scrollingClassTimeout;
    }, state.config.scrollThrottle + 5);

    state.scrollingPhantomClassTimeout && clearTimeout(state.scrollingPhantomClassTimeout);
    Utils.addClass(state.scrollBox, DefCls.clsBoxScrollingPhantom, state.config.clsBoxScrollingPhantom);
    state.scrollingPhantomClassTimeout = setTimeout(function () {
        Utils.removeClass(state.scrollBox, DefCls.clsBoxScrollingPhantom, state.config.clsBoxScrollingPhantom);
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
        computeScrollBarBox(state);
        computeScrollBarThumb(state);
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
    var match = void 0;
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
            this._isBinded = true;
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
            this._isBinded = false;
            destroy(this);
            return this;
        }
    }, {
        key: "isBinded",
        get: function get$$1() {
            return !!this._isBinded;
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
//# sourceMappingURL=dev.js.map
