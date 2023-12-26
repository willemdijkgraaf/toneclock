define(["require", "exports"], function(require, exports) {
    (function (ToneClock) {
        var Controller = (function () {
            function Controller(oToneClock) {
                this.sNAME = "Tone Clock Controller";
                this.sVERSION = "0.1";
                this.myJSONObjectURL = null;
                this.tc = oToneClock;
                this.tcc = this;
            }
            Controller.prototype.initializeState = function (sJSONSource, fCallback) {
                this.fCallback = fCallback;
                $.ajaxSetup({ cache: false });
                $.getJSON("../application/data/" + sJSONSource, $.proxy(this.OnJSONLoaded, this));

                return true;
            };

            Controller.prototype.OnJSONLoaded = function (items) {
                $.ajaxSetup({ cache: true });

                this.initializeToneClockView(items.toneclocksheet, items.toneclocks);

                this.tc.drawSheet();

                if (typeof this.fCallback === "function") {
                    this.fCallback();
                }
            };

            Controller.prototype.OnLoadEnd = function (event) {
                var sJSON = this.myFileReader.result;
                var json = jQuery.parseJSON(sJSON);

                this.initializeToneClockView(json.toneclocksheet, json.toneclocksheet.toneclocks);

                this.tc.drawSheet();

                if (typeof this.fCallback === "function") {
                    this.fCallback();
                }
            };

            Controller.prototype.initializeToneClockView = function (toneClockSheet, toneClocks) {
                var toneClockView = this.tc;

                toneClockView.setSheetTitle(toneClockSheet.name);
                toneClockView.setClockCanvasSize(toneClockSheet.clockcanvassize);
                toneClockView.setClockSize(toneClockSheet.clocksize);
                toneClockView.setHourSize(toneClockSheet.hoursize);
                toneClockView.setCanvasSize(toneClockSheet.clockshorizontal, toneClockSheet.clocksvertical);
                toneClockView.setNoteNameStyle(toneClockSheet.notenamestyle);
                toneClockView.setNoteNameDirection(toneClockSheet.notenamedirection);
                toneClockView.setNoteNameFlat(toneClockSheet.notenameaccidentals);
                toneClockView.setNoteNameMargin(toneClockSheet.notenamemargin);
                toneClockView.setNoteNameFontSize(toneClockSheet.notenamefontsize);
                toneClockView.setNoteNameFontName(toneClockSheet.notenamefontname);
                toneClockView.setNoteNameRotation(toneClockSheet.notenamerotation);

                this.setPropertiesOfClocks(toneClocks);
            };

            Controller.prototype.setPropertiesOfClocks = function (toneClocks) {
                this.tc.removeHarmoniesFromSheet(); // remove old harmonies
                this.tc.complementArrayOfClocks(); // add clocks if necessary
                if (typeof (toneClocks) === 'object') {
                    for (var i = 0; i < toneClocks.length; i++) {
                        this.setPropertiesOfClock(toneClocks[i]);
                        this.setHarmoniesOfClock(toneClocks[i]);
                    }
                }
            };

            Controller.prototype.setHarmoniesOfClock = function (jsonToneClock) {
                if (typeof (jsonToneClock.harmonies) === 'object') {
                    for (var i = 0; i < jsonToneClock.harmonies.length; i++) {
                        // make sure this harmony is not a fake placeholder
                        if (jsonToneClock.harmonies[i].midiNotes.length > 0) {
                            this._addHarmony(jsonToneClock, jsonToneClock.harmonies[i]);
                        }
                    }
                }
            };

            Controller.prototype.setPropertiesOfClock = function (jsonToneClock) {
                this.tc.setClockProperties(jsonToneClock.id, jsonToneClock.name, jsonToneClock.displayRoot, jsonToneClock.rootNoteNumber);
            };

            Controller.prototype._addHarmony = function (jsonToneClock, jsonHarmony) {
                this.tc.addHarmony(jsonToneClock.id, jsonHarmony.id, jsonHarmony.color, jsonHarmony.fill, jsonHarmony.midiNotes);
            };

            Controller.prototype.handleFileSelect = function (event) {
                var file = event.target.files[0];

                this.myFileReader = new FileReader();
                this.myFileReader.onloadend = $.proxy(this.OnLoadEnd, this);
                this.myFileReader.readAsText(file);
            };

            Controller.prototype.saveSheet = function () {
                var sheet = this.convertCurrentSheetToJSONString();
                var a = this.createFileDownloadLink(sheet);

                // click the download link make the download start.
                a.click();
            };

            Controller.prototype.convertCurrentSheetToJSONString = function () {
                var currentSheet = {
                    "toneclocksheet": {
                        "id": 1,
                        "name": this.tc.getSheetTitle(),
                        "clockcanvassize": this.tc.getClockCanvasSize(),
                        "clocksize": this.tc.getClockSize(),
                        "hoursize": this.tc.getHourSize(),
                        "clockshorizontal": this.tc.getClocksHorizontal(),
                        "clocksvertical": this.tc.getClocksVertical(),
                        "notenamestyle": this.tc.getNoteNameStyle(),
                        "notenamedirection": this.tc.getNoteNameDirection(),
                        "notenameaccidentals": this.tc.getNoteNameFlat(),
                        "notenamemargin": this.tc.getNoteNameMargin(),
                        "notenamefontsize": this.tc.getNoteNameFontSize(),
                        "notenamefontname": this.tc.getNoteNameFontName(),
                        "notenamerotation": this.tc.getNoteNameRotation(),
                        "toneclocks": this.tc.myClocks
                    }
                };

                return JSON.stringify(currentSheet);
            };

            Controller.prototype.createFileDownloadLink = function (sJSON) {
                var blob = new Blob([sJSON], { type: "application/json" });
                var url = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.id = "toneclocksheetdownload";
                a.style = "visibility=hidden;opacity=0;";
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
//# sourceMappingURL=toneclockcontroller.js.map
