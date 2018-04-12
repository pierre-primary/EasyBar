/**
 * @author:Ybao
 */
export default class Utils {
    /**
     * 判断元素是否存在对应的类
     * @param {HTMLElement} el 元素
     * @param {String} className 类名
     * @returns {Bool} 是否纯在
     */
    static hasClass(el, className) {
        return el.classList
            ? el.classList.contains(className)
            : new RegExp("\\b" + className + "\\b").test(el.className);
    }
    /**
     * 为元素添加类
     * @param {HTMLElement} el 元素
     * @param {String} classNames 类名
     */
    static addClass(el, ...classNames) {
        if (classNames && classNames.length > 0) {
            classNames.forEach(e => {
                if (!e) {
                    return;
                }
                if (el.classList) {
                    el.classList.add(e);
                } else if (!hasClass(el, e)) {
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
    static removeClass(el, ...classNames) {
        if (classNames && classNames.length > 0) {
            classNames.forEach(e => {
                if (!e) {
                    return;
                }
                if (el.classList) {
                    el.classList.remove(e);
                } else {
                    el.className = el.className.replace(
                        new RegExp("\\b" + e + "\\b", "g"),
                        ""
                    );
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
    static compatStyle(el, property, value) {
        var _property =
            property.slice(0, 1).toUpperCase() + property.substring(1);
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
    static style(el, property, value) {
        if (el.style[property] != value) {
            el.style[property] = value;
        }
    }

    /**
     * 去抖
     * @param {Function} fn 执行体
     * @param {Number} delay 周期时间
     */
    static debounce(fn, delayFn, nowFn) {
        var timer = null;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            var delay = delayFn ? delayFn.apply(context, args) : undefined;
            if (delay) {
                timer = setTimeout(() => {
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
    static throttle(fn, threshholdFn, nowFn) {
        var last, timer;
        return function() {
            var context = this;
            var now = +new Date(),
                args = arguments;
            var threshhold = threshholdFn
                ? threshholdFn.apply(context, args)
                : undefined;
            if (last && threshhold && now < last + threshhold) {
                clearTimeout(timer);
                timer = setTimeout(() => {
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
}
