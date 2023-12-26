define(["require", "exports"], function(require, exports) {
    (function (ToneClock) {
        var Controller = (function () {
            function Controller(oToneClock) {
                this.sNAME = "Tone Clock Controller";
                this.sVERSION = "0.1";
                this.myJSONObjectURL = null;
                this.tcView = oToneClock;
            }
            Controller.prototype.initializeState = function (sJSONSource, fCallback) {
                this.fCallback = fCallback;
                $.ajaxSetup({ cache: false });
                $.getJSON("./application/data/" + sJSONSource, $.proxy(this.OnJSONLoaded, this));

                return true;
            };

            Controller.prototype.OnJSONLoaded = function (items) {
                $.ajaxSetup({ cache: true });

                this.initializeToneClockView(items.toneclocksheet, items.toneclocks);

                this.tcView.drawSheet();

                if (typeof this.fCallback === "function") {
                    this.fCallback();
                }
            };

            Controller.prototype.OnLoadEnd = function (event) {
                var sJSON = this.myFileReader.result;
                var json = jQuery.parseJSON(sJSON);

                this.initializeToneClockView(json.toneclocksheet, json.toneclocksheet.toneclocks);

                this.tcView.drawSheet();

                if (typeof this.fCallback === "function") {
                    this.fCallback();
                }
            };

            Controller.prototype.initializeToneClockView = function (toneClockSheet, toneClocks) {
                var toneClockView = this.tcView;

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
                this.tcView.removeHarmoniesFromSheet();
                this.tcView.complementArrayOfClocks();
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
                        if (jsonToneClock.harmonies[i].midiNotes.length > 0) {
                            this._addHarmony(jsonToneClock, jsonToneClock.harmonies[i]);
                        }
                    }
                }
            };

            Controller.prototype.setPropertiesOfClock = function (jsonToneClock) {
                this.tcView.setClockProperties(jsonToneClock.id, jsonToneClock.name, jsonToneClock.displayRoot, jsonToneClock.rootNoteNumber);
            };

            Controller.prototype._addHarmony = function (jsonToneClock, jsonHarmony) {
                this.tcView.addHarmony(jsonToneClock.id, jsonHarmony.id, jsonHarmony.color, jsonHarmony.fill, jsonHarmony.midiNotes);
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

                a.click();
            };

            Controller.prototype.convertCurrentSheetToJSONString = function () {
                var currentSheet = {
                    "toneclocksheet": {
                        "id": 1,
                        "name": this.tcView.getSheetTitle(),
                        "clockcanvassize": this.tcView.getClockCanvasSize(),
                        "clocksize": this.tcView.getClockSize(),
                        "hoursize": this.tcView.getHourSize(),
                        "clockshorizontal": this.tcView.getClocksHorizontal(),
                        "clocksvertical": this.tcView.getClocksVertical(),
                        "notenamestyle": this.tcView.getNoteNameStyle(),
                        "notenamedirection": this.tcView.getNoteNameDirection(),
                        "notenameaccidentals": this.tcView.getNoteNameFlat(),
                        "notenamemargin": this.tcView.getNoteNameMargin(),
                        "notenamefontsize": this.tcView.getNoteNameFontSize(),
                        "notenamefontname": this.tcView.getNoteNameFontName(),
                        "notenamerotation": this.tcView.getNoteNameRotation(),
                        "toneclocks": this.tcView.myClocks
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
