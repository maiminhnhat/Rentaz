function findCordovaPath() {
    var path = null;
    var scripts = document.getElementsByTagName('script');
    var startterm = '/cordova.';
    var term = '/cordova.js';
    for (var n = scripts.length - 1; n > -1; n--) {
        var src = scripts[n].src.replace(/?.*$/, ''); // Strip any query param (CB-6007).
        var idx = src.indexOf(startterm);
        if (idx >= 0) {
            term = src.substring(idx + 1);
        }
        if (src.indexOf(term) === (src.length - term.length)) {
            path = src.substring(0, src.length - term.length) + '/';
            break;
        }
    }
    return path;
}