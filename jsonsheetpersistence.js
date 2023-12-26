/**
 * Created by wimdijkgraaf on 09-06-14.
 */
define(["require", "exports"], function (require, exports) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var JsonSheetPersistence = (function () {
            function JsonSheetPersistence() {
                this.sNAME = "Tone Clock Controller";
                this.sVERSION = "0.1";
            }
            JsonSheetPersistence.prototype.loadSheet = function (sJSONSource, fCallback) {
                this.fCallback = fCallback;
                $.ajaxSetup({ cache: false });
                $.getJSON("./application/data/" + sJSONSource, $.proxy(this.OnLoaded, this));
                return true;
            };
            JsonSheetPersistence.prototype.OnLoaded = function (items) {
                $.ajaxSetup({ cache: true });
                if (typeof this.fCallback === "function") {
                    this.fCallback(items);
                }
            };
            JsonSheetPersistence.prototype.OnLoadEnd = function (event) {
                var sJSON = this.myFileReader.result;
                var json = jQuery.parseJSON(sJSON);
                if (typeof this.fCallback === "function") {
                    this.fCallback(json);
                }
            };
            JsonSheetPersistence.prototype.handleSelectedFile = function (event) {
                var file = event.target.files[0]; // File object
                this.myFileReader = new FileReader();
                this.myFileReader.onloadend = $.proxy(this.OnLoadEnd, this);
                this.myFileReader.readAsText(file);
            };
            JsonSheetPersistence.prototype.saveSheet = function (aSheet) {
                var a = this.createFileDownloadLink(this.getSheetAsJSONString(aSheet));
                // click the download link make the download start.
                a.click();
            };
            JsonSheetPersistence.prototype.getSheetAsJSONString = function (aSheet) {
                return JSON.stringify(aSheet);
            };
            JsonSheetPersistence.prototype.createFileDownloadLink = function (sJSON) {
                var blob = new Blob([sJSON], { type: "application/json" });
                var url = URL.createObjectURL(blob);
                var a = document.createElement("a"); // should be HTMLAnchorElement
                a.id = "toneclocksheetdownload";
                a.style.visibility = "hidden";
                a.style.opacity = "0";
                a.download = "toneclocksheet.json";
                a.href = url;
                a.textContent = "toneclocksheet.json";
                return a;
            };
            return JsonSheetPersistence;
        })();
        ToneClock.JsonSheetPersistence = JsonSheetPersistence;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=jsonsheetpersistence.js.map