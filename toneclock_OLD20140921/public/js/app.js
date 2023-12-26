/**
* Created by wimdijkgraaf on 09-06-14.
*/
define(["require", "exports", "toneclockviewcontroller", "jquery", "jqueryui", "bootstrap", "flatui-checkbox","flatui-radio", "easeljs"], function(require, exports, viewcontroller, $, jqueryui, bootstrap, flatuicheckbox , flatuiradio, easeljs) {

    function start() {
        var myWindow = window;

        myWindow.myViewController = new viewcontroller.ToneClock.ViewController();

        $(document).ready(function () {
            //This function is called once the DOM is ready.
            //It will be safe to query the DOM and manipulate
            //DOM nodes in this function.
            console.log("document ready");
            myWindow.myViewController.Initialize();
        });
    }
    exports.start = start;
});
//# sourceMappingURL=app.js.map
