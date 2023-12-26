define(["require", "exports"], function(require, exports) {
    (function (ToneClock) {
        var Controller = (function () {
            function Controller(oToneClockWidget, oToneClockController) {
                this.NAME = "Tone Clock Controller";
                this.VERSION = "0.1";
                this.tc = oToneClockWidget; // reference injection through constructor.
                this.tcc = oToneClockController;
                this.jsonToneClockSheet = "";
            }
            Controller.prototype.initializeState = function (sJSONSource, fCallback) {
                var tcc;
                tcc = this.tcc;
                var tc;
                tc = this.tc;

                $.ajaxSetup({ cache: false });
                $.getJSON("../application/data/" + sJSONSource, function (items) {
                    //REFACTOR: references to tcc and tc should be injected, not global.
                    tcc.jsonToneClockSheet = items;
                    $.ajaxSetup({ cache: true });

                    tc.setSheetTitle(items.toneclocksheet.name);
                    tc.setClockCanvasSize(items.toneclocksheet.clockcanvassize);
                    tc.setClockSize(items.toneclocksheet.clocksize);
                    tc.setHourSize(items.toneclocksheet.hoursize);
                    tc.setCanvasSize(items.toneclocksheet.clockshorizontal, items.toneclocksheet.clocksvertical);
                    tc.setNoteNameStyle(items.toneclocksheet.notenamestyle);
                    tc.setNoteNameDirection(items.toneclocksheet.notenamedirection);
                    tc.setNoteNameFlat(items.toneclocksheet.notenameaccidentals);
                    tc.setNoteNameMargin(items.toneclocksheet.notenamemargin);
                    tc.setNoteNameFontSize(items.toneclocksheet.notenamefontsize);
                    tc.setNoteNameFontName(items.toneclocksheet.notenamefontname);
                    tc.setNoteNameRotation(items.toneclocksheet.notenamerotation);

                    tc.initializeClocks();
                    tcc.setPropertiesOfClocks();

                    if (typeof fCallback === "function") {
                        fCallback();
                    }
                });

                return true;
            };

            Controller.prototype.setPropertiesOfClocks = function () {
                this.tc.removeHarmoniesFromSheet();
                if (typeof (this.jsonToneClockSheet.toneclocks) === 'object') {
                    for (var i = 0; i < this.jsonToneClockSheet.toneclocks.length; i++) {
                        this._setClockProperties(this.jsonToneClockSheet.toneclocks[i]);
                        this._setHarmonies(this.jsonToneClockSheet.toneclocks[i]);
                    }
                }
            };

            Controller.prototype._setHarmonies = function (jsonToneClock) {
                if (typeof (jsonToneClock.harmonies) === 'object') {
                    for (var i = 0; i < jsonToneClock.harmonies.length; i++) {
                        this._addHarmony(jsonToneClock, jsonToneClock.harmonies[i]);
                    }
                }
            };

            Controller.prototype._setClockProperties = function (jsonToneClock) {
                this.tc.setClockProperties(jsonToneClock.id, jsonToneClock.name, jsonToneClock.displayRoot, jsonToneClock.rootNoteNumber);
            };

            Controller.prototype._addHarmony = function (jsonToneClock, jsonHarmony) {
                this.tc.addHarmony(jsonToneClock.id, jsonHarmony.id, jsonHarmony.color, jsonHarmony.fill, jsonHarmony.midiNotes);
            };
            return Controller;
        })();
        ToneClock.Controller = Controller;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
//# sourceMappingURL=controller.js.map
