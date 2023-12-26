define(["require", "exports", "toneclockviewcontroller"], function(require, exports, viewcontroller) {
    function start() {
        var myWindow = window;

        myWindow.myViewController = new viewcontroller.ToneClock.ViewController();

        $(document).ready(function () {
            console.log("document ready");
            myWindow.myViewController.Initialize();
        });
    }
    exports.start = start;
});
