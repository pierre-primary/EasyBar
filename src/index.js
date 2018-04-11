import Utils from "./utils/utils.js";
import BrowserHelper from "./utils/browser.js";
import DefConfig from "./config.js";

import "./css/easy-bar.css";

const StrongNativeBarClass = "hide-native-bar";
const IsFirefox = BrowserHelper.isFirefox();
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

    box.className = StrongNativeBarClass;
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
        v,
        h
    };
}

function createBar() {
    var scrollBarTrack = document.createElement("div");
    scrollBarTrack.style.position = "absolute";
    var scrollBarThumb = document.createElement("div");
    scrollBarThumb.style.position = "absolute";

    scrollBarTrack.appendChild(scrollBarThumb);
    return {
        scrollBarTrack,
        scrollBarThumb
    };
}

/**
 *
 * @param {*} state
 */
function careteMutationObserver(state) {
    if (typeof MutationObserver === typeof void 0) {
        return null;
    }

    return new MutationObserver(
        Utils.throttle(function() {
            refreshBar(state);
        }, state.config.observerThrottle)
    );
}

/**
 *
 * @param {*} state
 */
function initScrollHandler(state) {
    if (!state.scrollHandler) {
        state.scrollHandler = Utils.throttle(function() {
            updateScrollBar(state);
            withScrollingClass(state);
        }, state.config.scrollThrottle);
    }
}

/**
 *
 * @param {*} state
 */
function initMouseMove(state) {
    if (!state.mouseMove) {
        state.mouseMove = Utils.throttle(function(event) {
            onDragging(state, event);
        }, state.config.draggerThrottle);
    }
}

/**
 *
 * @param {*} state
 */
function initMouseUp(state) {
    if (!state.mouseUp) {
        state.mouseUp = function() {
            state.vBar && (state.vBar.barDragging = false);
            state.hBar && (state.hBar.barDragging = false);

            Utils.compatStyle(state.scrollBox, "userSelect", "");
            state.config.unselectableBody &&
                Utils.compatStyle(document.body, "userSelect", "");

            Utils.removeClass(state.scrollBox, state.config.clsBoxDragging);
            state.draggingPhantomClassTimer &&
                clearTimeout(state.draggingPhantomClassTimer);
            state.draggingPhantomClassTimer = setTimeout(function() {
                Utils.removeClass(
                    state.scrollBox,
                    state.config.clsBoxDraggingPhantomClass
                );
                state.draggingPhantomClassTimer &&
                    delete state.draggingPhantomClassTimer;
            }, state.config.draggingPhantomDelay);

            document.removeEventListener("mousemove", state.mouseMove, 0);
            document.removeEventListener("mouseup", state.mouseUp, 0);
        };
    }
}

/**
 *
 * @param {*} state
 */
function initMouseDown(state) {
    if (!state.mouseDown) {
        state.mouseDown = function(event) {
            if (event.which !== 1) {
                return false;
            }
            if (state.vBar && this == state.vBar.scrollBarThumb) {
                state.vBar.barDragging = true;
                state.vBar.mouseBarOffset = event.offsetY;
            }
            if (state.hBar && this == state.hBar.scrollBarThumb) {
                state.hBar.barDragging = true;
                state.hBar.mouseBarOffset = event.offsetX;
            }

            Utils.compatStyle(state.scrollBox, "userSelect", "none");
            state.config.unselectableBody &&
                Utils.compatStyle(document.body, "userSelect", "none");

            Utils.addClass(state.scrollBox, state.config.clsBoxDragging);
            state.draggingPhantomClassTimer &&
                clearTimeout(state.draggingPhantomClassTimer);
            Utils.addClass(
                state.scrollBox,
                state.config.clsBoxDraggingPhantomClass
            );

            document.addEventListener("mousemove", state.mouseMove, 0);
            document.addEventListener("mouseup", state.mouseUp, 0);
        };
    }
}

/**
 *
 * @param {*} state
 */
function bindScrollBox(state) {
    if (!state.scrollCevBox) {
        state.scrollBox = state.rootEl;
        state.scrollCev = state.rootEl.firstElementChild;
        state.scrollCevBox = document.createElement("div");

        Utils.addClass(state.scrollBox, state.config.clsBox);
        state.scrollBox.style.position = "relative";
        state.scrollBox.style.overflow = "hidden";

        Utils.addClass(state.scrollCevBox, state.config.clsContent);
        Utils.addClass(state.scrollCevBox, StrongNativeBarClass);
        state.scrollCevBox.style.display = "block";
        state.scrollCevBox.style.overflow = "hidden";
        state.scrollCevBox.style.height = "100%";
        state.scrollCevBox.style.width = "100%";

        state.scrollBox.removeChild(state.scrollCev);
        state.scrollCevBox.appendChild(state.scrollCev);
        state.scrollBox.appendChild(state.scrollCevBox);

        state.scrollCevBox.addEventListener("scroll", state.scrollHandler, 0);

        state.mutationObserver = careteMutationObserver(state);
        state.mutationObserver &&
            state.mutationObserver.observe(state.scrollCevBox, {
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

        state.scrollBox.removeChild(state.scrollCevBox);
        state.scrollCevBox.removeChild(state.scrollCev);
        state.scrollBox.appendChild(state.scrollCev);

        state.scrollCevBox.removeEventListener(
            "scroll",
            state.scrollHandler,
            0
        );

        if (state.mutationObserver) {
            state.mutationObserver.disconnect();
            delete state.mutationObserver;
        }

        delete state.scrollBox;
        delete state.scrollCev;
        delete state.scrollCevBox;
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
            state.scrollBox.appendChild(state.vBar.scrollBarTrack);
            state.vBar.scrollBarThumb.addEventListener(
                "mousedown",
                state.mouseDown,
                0
            );
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
            state.scrollBox.appendChild(state.hBar.scrollBarTrack);
            state.hBar.scrollBarThumb.addEventListener(
                "mousedown",
                state.mouseDown,
                0
            );
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
        state.vBar.scrollBarThumb.removeEventListener(
            "mousedown",
            state.mouseDown,
            0
        );
        state.scrollBox.removeChild(state.vBar.scrollBarTrack);
        delete state.vBar;
    }
}

function unBindScrollBarH(state) {
    if (state.hBar) {
        state.hBar.scrollBarThumb.removeEventListener(
            "mousedown",
            state.mouseDown,
            0
        );
        state.scrollBox.removeChild(state.hBar.scrollBarTrack);
        delete state.hBar;
    }
}

/**
 *
 * @param {*} state
 */
function computeArea(state) {
    var bar, visibleArea, _barLenght, barLenght, minBarBoxLenght;
    if ((bar = state.vBar)) {
        visibleArea =
            state.scrollCevBox.scrollHeight == 0
                ? 1
                : state.scrollCevBox.clientHeight /
                  state.scrollCevBox.scrollHeight;
        bar.scrollOffsetArea = visibleArea;
        bar.barBoxLenght = bar.scrollBarTrack.clientHeight;

        if (visibleArea >= 1) {
            bar.barLenght = 0;

            Utils.removeClass(state.scrollBox, state.config.clsBoxVisibleBarV);
            Utils.addClass(state.scrollBox, state.config.clsBoxInvisibleBarV);
        } else {
            _barLenght = bar.scrollBarTrack.clientHeight * visibleArea;
            barLenght = _barLenght;
            barLenght =
                state.config.minLenght > 0 && state.config.minLenght > barLenght
                    ? state.config.minLenght
                    : barLenght;
            barLenght =
                state.config.maxLenght > 0 && state.config.maxLenght < barLenght
                    ? state.config.maxLenght
                    : barLenght;
            bar.barLenght = barLenght;
            minBarBoxLenght =
                (state.config.minLenght > 0 ? state.config.minLenght : 0) + 100;
            bar.barBoxLenght =
                minBarBoxLenght > bar.scrollBarTrack.clientHeight
                    ? minBarBoxLenght
                    : bar.scrollBarTrack.clientHeight;
            bar.scrollOffsetArea =
                (bar.barBoxLenght - barLenght) /
                (bar.scrollBarTrack.clientHeight - _barLenght) *
                (bar.scrollBarTrack.clientHeight /
                    state.scrollCevBox.scrollHeight);

            Utils.removeClass(
                state.scrollBox,
                state.config.clsBoxInvisibleBarV
            );
            Utils.addClass(state.scrollBox, state.config.clsBoxVisibleBarV);
        }
    }

    if ((bar = state.hBar)) {
        visibleArea =
            state.scrollCevBox.scrollWidth == 0
                ? 1
                : state.scrollCevBox.clientWidth /
                  state.scrollCevBox.scrollWidth;
        bar.scrollOffsetArea = visibleArea;
        bar.barBoxLenght = bar.scrollBarTrack.clientWidth;
        if (visibleArea >= 1) {
            bar.barLenght = 0;

            Utils.removeClass(state.scrollBox, state.config.clsBoxVisibleBarH);
            Utils.addClass(state.scrollBox, state.config.clsBoxInvisibleBarH);
        } else {
            _barLenght = bar.scrollBarTrack.clientWidth * visibleArea;
            barLenght = _barLenght;
            barLenght =
                state.config.minLenght > 0 && state.config.minLenght > barLenght
                    ? state.config.minLenght
                    : barLenght;
            barLenght =
                state.config.maxLenght > 0 && state.config.maxLenght < barLenght
                    ? state.config.maxLenght
                    : barLenght;
            bar.barLenght = barLenght;
            minBarBoxLenght =
                (state.config.minLenght > 0 ? state.config.minLenght : 0) + 100;
            bar.barBoxLenght =
                minBarBoxLenght > bar.scrollBarTrack.clientWidth
                    ? minBarBoxLenght
                    : bar.scrollBarTrack.clientWidth;
            bar.scrollOffsetArea =
                (bar.barBoxLenght - barLenght) /
                (bar.scrollBarTrack.clientWidth - _barLenght) *
                (bar.scrollBarTrack.clientWidth /
                    state.scrollCevBox.scrollWidth);

            Utils.removeClass(
                state.scrollBox,
                state.config.clsBoxInvisibleBarH
            );
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
    if ((bar = state.vBar)) {
        bar.barOffset = state.scrollCevBox.scrollTop * bar.scrollOffsetArea;

        bar.scrollBarThumb.style.height =
            parseInt(Math.round(bar.barLenght)) + "px";
        bar.scrollBarThumb.style.top =
            parseInt(Math.round(bar.barOffset)) + "px";
    }

    if ((bar = state.hBar)) {
        bar.barOffset = state.scrollCevBox.scrollLeft * bar.scrollOffsetArea;

        bar.scrollBarThumb.style.width =
            parseInt(Math.round(bar.barLenght)) + "px";
        bar.scrollBarThumb.style.left =
            parseInt(Math.round(bar.barOffset)) + "px";
    }
}

/**
 *
 * @param {*} state
 */
function onDragging(state, event) {
    var handlerEvent = false;
    var bar, relativeMouse;
    if ((bar = state.vBar) && bar.barDragging) {
        relativeMouse =
            event.clientY - state.scrollBox.getBoundingClientRect().top;
        if (relativeMouse <= bar.mouseBarOffset) {
            bar.barOffset = 0;
        }

        if (relativeMouse > bar.mouseBarOffset) {
            bar.barOffset = relativeMouse - bar.mouseBarOffset;
        }

        if (bar.barOffset + bar.barLenght >= bar.barBoxLenght) {
            bar.barOffset = bar.barBoxLenght - bar.barLenght;
        }
        state.scrollCevBox.scrollTop = bar.barOffset / bar.scrollOffsetArea;
        handlerEvent = true;
    }
    if ((bar = state.hBar) && bar.barDragging) {
        relativeMouse =
            event.clientX - state.scrollBox.getBoundingClientRect().left;
        if (relativeMouse <= bar.mouseBarOffset) {
            bar.barOffset = 0;
        }

        if (relativeMouse > bar.mouseBarOffset) {
            bar.barOffset = relativeMouse - bar.mouseBarOffset;
        }

        if (bar.barOffset + bar.barLenght >= bar.barBoxLenght) {
            bar.barOffset = bar.barBoxLenght - bar.barLenght;
        }
        state.scrollCevBox.scrollLeft = bar.barOffset / bar.scrollOffsetArea;
        handlerEvent = true;
    }
    return handlerEvent;
}

function withScrollingClass(state) {
    state.scrollingClassTimeout && clearTimeout(state.scrollingClassTimeout);
    Utils.addClass(state.scrollBox, state.config.clsBoxScrolling);
    state.scrollingClassTimeout = setTimeout(function() {
        Utils.removeClass(state.scrollBox, state.config.clsBoxScrolling);
        state.scrollingClassTimeout && delete state.scrollingClassTimeout;
    }, state.config.scrollThrottle + 5);

    state.scrollingPhantomClassTimeout &&
        clearTimeout(state.scrollingPhantomClassTimeout);
    Utils.addClass(state.scrollBox, state.config.clsBoxScrollingPhantom);
    state.scrollingPhantomClassTimeout = setTimeout(function() {
        Utils.removeClass(state.scrollBox, state.config.clsBoxScrollingPhantom);
        state.scrollingPhantomClassTimeout &&
            delete state.scrollingPhantomClassTimeout;
    }, state.config.scrollThrottle + state.config.scrollingPhantomDelay);
}

function clearBarTimeout(state) {
    state.draggingPhantomClassTimer &&
        clearTimeout(state.draggingPhantomClassTimer);
    state.scrollingClassTimeout && clearTimeout(state.scrollingClassTimeout);
    state.scrollingPhantomClassTimeout &&
        clearTimeout(state.scrollingPhantomClassTimeout);
}

/**
 *
 * @param {*} state
 */
function bindWheelHandler(state) {
    if (state.config.preventParentScroll) {
        if (!state.wheelHandler) {
            state.wheelHandler = function(event) {
                if (state.visibleArea >= 1) {
                    return false;
                }

                var scrollDist =
                    state.scrollCevBox.scrollHeight -
                    state.scrollCevBox.clientHeight;
                var scrollTop = state.scrollCevBox.scrollTop;

                var wheelingUp = event.deltaY < 0;
                var wheelingDown = event.deltaY > 0;

                if (scrollTop <= 0 && wheelingUp) {
                    event.preventDefault();
                    return false;
                }

                if (scrollTop >= scrollDist && wheelingDown) {
                    event.preventDefault();
                    return false;
                }
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
            state.resizeHandler = Utils.debounce(function() {
                refreshBar(state);
            }, state.config.resizeDebounce);

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
function refreshBar(state) {
    var refreshFn = function() {
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
    if ((match = scrollBarBehavior.match(oneRegex))) {
        if (match.length >= 2) {
            v = h = match[1].toLowerCase();
        }
    } else if ((match = scrollBarBehavior.match(twoRegex))) {
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
        vBarEnable,
        vBarShow,
        hBarEnable,
        hBarShow
    };
}

function setOptions(state, options) {
    if (options) {
        for (var key in options) {
            state.config[key] = options[key];
        }
    }
    state.barBehavior = analyzeScrollBarBehavior(
        state.config.scrollBarBehavior
    );
}

export default class EasyBar {
    constructor(el, options, nextTickHandler) {
        if (!checkCevEl(el)) {
            return {};
        }
        this.rootEl = el;
        this.config = Object.assign({}, DefConfig);

        init(this, nextTickHandler);

        this.update(options);
    }

    update(options) {
        setOptions(this, options);
        create(this);
        refreshBar(this);
    }

    refreshBar() {
        refreshBar(this);
    }

    destroy() {
        destroy(this);
    }

    static bind(el, options, nextTickHandler) {
        if (!el._easyBar) {
            el._easyBar = new EasyBar(el, options, nextTickHandler);
        }
        return el._easyBar;
    }

    static update(el, options) {
        if (el._easyBar) {
            el._easyBar.update(options);
        }
    }

    static unBind(el) {
        if (el._easyBar) {
            el._easyBar.destroy();
            delete el._easyBar;
        }
    }

    static get(el) {
        return el._easyBar;
    }

    static refreshBar(el) {
        if (el._easyBar) {
            el._easyBar.refreshBar();
        }
    }

    static install(Vue) {
        Vue.directive("bar", {
            inserted: function(el, binding) {
                EasyBar.bind(
                    el,
                    binding && binding.value ? binding.value : null,
                    Vue.nextTick
                );
            },
            update: function(el, binding) {
                EasyBar.update(
                    el,
                    binding && binding.value ? binding.value : null
                );
            },
            componentUpdated: function(el) {
                EasyBar.refreshBar(el);
            },
            unbind: function(el) {
                EasyBar.unBind(el);
            }
        });
        Object.defineProperty(Vue.prototype, "$EasyBar", {
            get: function get() {
                return EasyBar;
            }
        });
    }
}
