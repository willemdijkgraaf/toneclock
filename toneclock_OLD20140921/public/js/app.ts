/**
 * Created by wimdijkgraaf on 09-06-14.
 */

import viewcontroller = require("toneclockviewcontroller");
import jquery = require("jquery");

export function start () {
    var myWindow:any = window;

    myWindow.myViewController = new viewcontroller.ToneClock.ViewController();

    $(document).ready(function () {
        //This function is called once the DOM is ready.
        //It will be safe to query the DOM and manipulate
        //DOM nodes in this function.
        console.log("document ready");
        myWindow.myViewController.Initialize();
    });

}

