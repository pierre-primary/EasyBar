/**
 * @author:Ybao
 */

import Utils from "./utils/utils.js";
import { DefConfig, DefCls } from "./config.js";

import "./css/easy-bar.css";

const HideNativeBarClass = "hide-native-bar";
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
    let container = document.body;

    let box = document.createElement("div");
    let cev = document.createElement("div");

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

    let fullWidth = cev.offsetWidth;
    let fullHeight = cev.offsetHeight;

    box.style.overflow = "scroll";

    let v = fullWidth - cev.offsetWidth;
    let h = fullHeight - cev.offsetHeight;

    container.removeChild(box);

    return {
        v,
        h
    };
}

function createBar() {
    let scrollBarBox = document.createElement("div");
    scrollBarBox.style.position = "absolute";
    scrollBarBox.style.overflow = "hidden";
    let scrollBarTrack = document.createElement("div");
    scrollBarTrack.style.position = "relative";
    scrollBarTrack.style.overflow = "hidden";
    let scrollBarThumb = document.createElement("div");
    scrollBarThumb.style.position = "relative";

    scrollBarTrack.appendChild(scrollBarThumb);
    scrollBarBox.appendChild(scrollBarTrack);
    return {
        scrollBarBox,
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
        Utils.throttle(
            function() {
                refreshBar(state);
            },
            function() {
                return state.config.observerThrottle;
            }
        )
    );
}

/**
 *
 * @param {*} state
 */
function initScrollHandler(state) {
    if (!state.scrollHandler) {
        state.scrollHandler = Utils.throttle(
            function() {
                computeScrollBarBox(state);
                computeScrollBarThumb(state);
                withScrollingClass(state);
            },
            function() {
                return state.config.scrollThrottle;
            }
        );
    }
}

/**
 *
 * @param {*} state
 */
function initMouseDown(state) {
    if (!state.mouseDown) {
        state.mouseDown = function(event) {
            if (!event.targetTouches && event.which !== 1) {
                return false;
            }
            let p = event.targetTouches ? event.targetTouches[0] : event;
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
        state.mouseMove = Utils.throttle(
            function(event) {
                let p = event.targetTouches ? event.targetTouches[0] : event;
                onDragging(state, p);
            },
            function() {
                return state.config.draggerThrottle;
            },
            function(event) {
                event.stopPropagation();
            }
        );
    }
}

/**
 *
 * @param {*} state
 */
function initMouseUp(state) {
    if (!state.mouseUp) {
        state.mouseUp = function(event) {
            state.vBar && (state.vBar.barDragging = false);
            state.hBar && (state.hBar.barDragging = false);

            Utils.removeClass(state.scrollBox, DefCls.clsBoxDragging, state.config.clsBoxDragging);
            state.draggingPhantomClassTimer && clearTimeout(state.draggingPhantomClassTimer);
            state.draggingPhantomClassTimer = setTimeout(() => {
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
            state.wheelHandler = function(event) {
                if (state.visibleArea >= 1) {
                    return false;
                }
                let scrollDistV = state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight;
                let scrollTop = state.scrollCevBox.scrollTop;

                let wheelingUp = event.deltaY < 0;
                let wheelingDown = event.deltaY > 0;
                if ((scrollTop <= 0 && wheelingUp) || (scrollTop >= scrollDistV && wheelingDown)) {
                    event.preventDefault();
                    return false;
                }

                let scrollDistH = state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight;
                let scrollLeft = state.scrollCevBox.scrollLeft;

                let wheelingLeft = event.deltaX < 0;
                let wheelingRight = event.deltaX > 0;
                if ((scrollLeft <= 0 && wheelingLeft) || (scrollLeft >= scrollDistH && wheelingRight)) {
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
            state.resizeHandler = Utils.debounce(
                function() {
                    refreshBar(state);
                },
                function() {
                    return state.config.resizeDebounce;
                }
            );

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
    let bar;
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
        let nBarW = getNativeScrollbarWidth();
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
    let showBarV = 0,
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
    let bar;
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
    let bar, visibleArea, barLength, barOffset, scrollOffsetArea;
    if ((bar = state.vBar) && bar.show) {
        visibleArea = state.scrollCevBox.scrollHeight == 0 ? 1 : state.scrollCevBox.clientHeight / state.scrollCevBox.scrollHeight;

        barLength = bar.scrollBarTrack.clientHeight * visibleArea;
        bar.scrollBarThumb.style.height = parseInt(Math.round(barLength)) + "px";

        scrollOffsetArea =
            (bar.scrollBarTrack.clientHeight - bar.scrollBarThumb.clientHeight) /
            (state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight);

        barOffset = state.scrollCevBox.scrollTop * scrollOffsetArea;
        bar.scrollBarThumb.style.top = parseInt(Math.round(barOffset)) + "px";
    }

    if ((bar = state.hBar) && bar.show) {
        visibleArea = state.scrollCevBox.scrollWidth == 0 ? 1 : state.scrollCevBox.clientWidth / state.scrollCevBox.scrollWidth;

        barLength = bar.scrollBarTrack.clientWidth * visibleArea;
        bar.scrollBarThumb.style.width = parseInt(Math.round(barLength)) + "px";

        scrollOffsetArea =
            (bar.scrollBarTrack.clientWidth - bar.scrollBarThumb.clientWidth) /
            (state.scrollCevBox.scrollWidth - state.scrollCevBox.clientWidth);

        barOffset = state.scrollCevBox.scrollLeft * scrollOffsetArea;
        bar.scrollBarThumb.style.left = parseInt(Math.round(barOffset)) + "px";
    }
}

/**
 *
 * @param {*} state
 */
function onDragging(state, p) {
    let handlerEvent = false;
    let bar, relativeMouse, barOffset, scrollOffsetArea;
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
        scrollOffsetArea =
            (state.scrollCevBox.scrollHeight - state.scrollCevBox.clientHeight) /
            (bar.scrollBarTrack.clientHeight - bar.scrollBarThumb.clientHeight);
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
        scrollOffsetArea =
            (state.scrollCevBox.scrollWidth - state.scrollCevBox.clientWidth) /
            (bar.scrollBarTrack.clientWidth - bar.scrollBarThumb.clientWidth);
        state.scrollCevBox.scrollLeft = barOffset * scrollOffsetArea;
        handlerEvent = true;
    }
    return handlerEvent;
}

function withScrollingClass(state) {
    state.scrollingClassTimeout && clearTimeout(state.scrollingClassTimeout);
    Utils.addClass(state.scrollBox, DefCls.clsBoxScrolling, state.config.clsBoxScrolling);
    state.scrollingClassTimeout = setTimeout(() => {
        Utils.removeClass(state.scrollBox, DefCls.clsBoxScrolling, state.config.clsBoxScrolling);
        state.scrollingClassTimeout && delete state.scrollingClassTimeout;
    }, state.config.scrollThrottle + 5);

    state.scrollingPhantomClassTimeout && clearTimeout(state.scrollingPhantomClassTimeout);
    Utils.addClass(state.scrollBox, DefCls.clsBoxScrollingPhantom, state.config.clsBoxScrollingPhantom);
    state.scrollingPhantomClassTimeout = setTimeout(() => {
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
function refreshBar(state) {
    let refreshFn = () => {
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
    let v = "show",
        h = "show";
    let oneRegex = /^\s*(show|hide|none)\s*$/i;
    let twoRegex = /^\s*(show|hide|none)\s+(show|hide|none)\s*$/i;
    let match;
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
    let vBarEnable = true;
    let vBarShow = true;
    if (v == "none") {
        vBarEnable = false;
        vBarShow = false;
    } else if (v == "hide") {
        vBarEnable = true;
        vBarShow = false;
    }
    let hBarEnable = true;
    let hBarShow = true;
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
        for (let key in options) {
            state.config[key] = options[key];
        }
    }
    state.barBehavior = analyzeScrollBarBehavior(state.config.scrollBarBehavior);
}

export default class EasyBar {
    constructor(el, nextTickHandler) {
        if (!checkCevEl(el)) {
            return {};
        }
        this.rootEl = el;

        this.config = {};
        setOptions(this, DefConfig);

        init(this, nextTickHandler);
    }

    bind(options) {
        this.update(options);
        return this;
    }

    update(options) {
        setOptions(this, options);
        create(this);
        refreshBar(this);
        return this;
    }

    refreshBar() {
        refreshBar(this);
        return this;
    }

    unBind() {
        destroy(this);
        return this;
    }

    static bind(el, options, nextTickHandler) {
        if (!el._easyBar) {
            el._easyBar = new EasyBar(el, nextTickHandler).bind(options);
        }
        return el._easyBar;
    }

    static update(el, options) {
        if (el._easyBar) {
            el._easyBar.update(options);
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

    static unBind(el) {
        if (el._easyBar) {
            el._easyBar.unBind();
            delete el._easyBar;
        }
    }

    static install(Vue) {
        Vue.directive("bar", {
            inserted: (el, binding) => {
                EasyBar.bind(el, binding && binding.value ? binding.value : null, Vue.nextTick);
            },
            update: (el, binding) => {
                EasyBar.update(el, binding && binding.value ? binding.value : null);
            },
            componentUpdated: el => {
                EasyBar.refreshBar(el);
            },
            unbind: el => {
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
