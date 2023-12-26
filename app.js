/**
 * Created by wimdijkgraaf on 09-06-14.
 */
define(["require", "exports", "htmlviewcontroller"], function (require, exports, htmlviewcontroller) {
    function start() {
        "use strict";
        var myWindow = window;
        myWindow.myViewController = new htmlviewcontroller.ToneClock.HtmlViewController();
        $(document).ready(function () {
            //This function is called once the DOM is ready.
            //It will be safe to query the DOM and manipulate
            //DOM nodes in this function.
            myWindow.myViewController.getJSONSheet("peterschat.json");
        });
    }
    exports.start = start;
});
//# sourceMappingURL=app.js.map