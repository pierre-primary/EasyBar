export default class BrowserUtils {
    static isFirefox() {
        var ua = window.navigator.userAgent;
        return ua.toLowerCase().indexOf("firefox") > -1;
    }
}
