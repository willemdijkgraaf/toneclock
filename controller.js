/**
* Created by wimdijkgraaf on 09-06-14.
*/
define(["require", "exports"], function(require, exports) {
    (function (ToneClock) {
        var Controller = (function () {
            function Controller() {
                this.sNAME = "Tone Clock Controller";
                this.sVERSION = "0.1";
                this.myJSONObjectURL = null;
            }
            Controller.prototype.initializeState = function (sJSONSource, fCallback) {
                this.fCallback = fCallback;
                $.ajaxSetup({ cache: false });
                $.getJSON("./application/data/" + sJSONSource, $.proxy(this.OnJSONLoaded, this));

                return true;
            };

            Controller.prototype.OnJSONLoaded = function (items) {
                $.ajaxSetup({ cache: true });

                if (typeof this.fCallback === "function") {
                    this.fCallback(items);
                }
            };

            Controller.prototype.OnLoadEnd = function (event) {
                var sJSON = this.myFileReader.result;
                var json = jQuery.parseJSON(sJSON);

                if (typeof this.fCallback === "function") {
                    this.fCallback(json);
                }
            };

            Controller.prototype.handleFileSelect = function (event) {
                var file = event.target.files[0];

                this.myFileReader = new FileReader();
                this.myFileReader.onloadend = $.proxy(this.OnLoadEnd, this);
                this.myFileReader.readAsText(file);
            };

            Controller.prototype.saveSheet = function (aSheet) {
                var a = this.createFileDownloadLink(this.getSheetAsJSONString(aSheet));

                // click the download link make the download start.
                a.click();
            };

            Controller.prototype.getSheetAsJSONString = function (aSheet) {
                return JSON.stringify(aSheet);
            };

            Controller.prototype.createFileDownloadLink = function (sJSON) {
                var blob = new Blob([sJSON], { type: "application/json" });
                var url = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.id = "toneclocksheetdownload";
                a.style.visibility = "hidden";
                a.style.opacity = "0";
                a.download = "toneclocksheet.json";
                a.href = url;
                a.textContent = "toneclocksheet.json";

                return a;
            };
            return Controller;
        })();
        ToneClock.Controller = Controller;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
//# sourceMappingURL=controller.js.map
