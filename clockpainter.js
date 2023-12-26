/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports", "./objectid"], function (require, exports, objectid) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var ClockPainter = (function () {
            function ClockPainter(aCanvas, aHarmony, aHour) {
                this.NoteNameIndex = 34;
                this.HarmonicFunctionIndex = 46;
                this.myCanvas = aCanvas;
                this.myHarmony = aHarmony;
                this.myHour = aHour;
            }
            ClockPainter.prototype.drawNames = function (aClock, aNNPrefs, aPCSPrefs, clockCanvasSize) {
                var sClockName = "";
                if (typeof aClock.name !== "undefined") {
                    sClockName = aClock.name;
                    if (sClockName === "0") {
                        sClockName = "";
                    }
                }
                var x = aClock.xpos + clockCanvasSize / 2;
                var y = aClock.hours[6].ypos + (3 * aNNPrefs.fontSize) + aNNPrefs.margin;
                var objectId = new objectid.ToneClock.ObjectId(aClock.id, 0, 7 /* CLOCKNAME */);
                // if this clock has a name, display the name
                if (typeof sClockName !== "undefined") {
                    this.writeText(objectId, x, y, sClockName, aNNPrefs, "center", "middle", "#000000");
                    y = y + aNNPrefs.fontSize; // write on new line
                }
                this.drawPitchClassNames(aClock, x, y, aPCSPrefs, aNNPrefs);
            };
            ClockPainter.prototype.writeText = function (objectId, x, y, text, aNNPrefs, textAlign, textBaseline, color) {
                this.myCanvas.writeText(objectId, x, y, text, aNNPrefs.fontName, aNNPrefs.fontSize, textAlign, textBaseline, color);
            };
            ClockPainter.prototype.drawPitchClassNames = function (aClock, x, y, aPCSPrefs, aNNPrefs) {
                var id = aClock.id;
                var noteNameFontSize = aNNPrefs.fontSize;
                // display the names of the various pitch class sets of the first harmony
                if (typeof aClock.harmonies !== "undefined") {
                    if (typeof aClock.harmonies[0] !== "undefined") {
                        var aHarmony = aClock.harmonies[0];
                        this.myHarmony.addPitchClassSetNames(aHarmony);
                        var objectId;
                        if (aPCSPrefs.displayPrimeForm) {
                            objectId = new objectid.ToneClock.ObjectId(aClock.id, 0, 8 /* PCSETNAME */);
                            var sPrimeForm = "PF: " + aHarmony.primeForm;
                            this.writeText(objectId, x, y, sPrimeForm, aNNPrefs, "center", "middle", "#000000");
                            y = y + noteNameFontSize; // write on new line
                        }
                        if (aPCSPrefs.displayForteCode) {
                            objectId = new objectid.ToneClock.ObjectId(aClock.id, 1, 8 /* PCSETNAME */);
                            var sForteCode = "FC: " + aHarmony.forteCode;
                            this.writeText(objectId, x, y, sForteCode, aNNPrefs, "center", "middle", "#000000");
                            y = y + noteNameFontSize; // write on new line
                        }
                        if (aPCSPrefs.displayIntervalVector) {
                            objectId = new objectid.ToneClock.ObjectId(aClock.id, 2, 8 /* PCSETNAME */);
                            var sIntervalVector = "IV: " + aHarmony.intervalVector;
                            this.writeText(objectId, x, y, sIntervalVector, aNNPrefs, "center", "middle", "#000000");
                            y = y + noteNameFontSize; // write on new line
                        }
                        if (aPCSPrefs.displayPrimeInversion) {
                            objectId = new objectid.ToneClock.ObjectId(aClock.id, 3, 8 /* PCSETNAME */);
                            var sPrimeInversion = "PI: " + aHarmony.primeInversion;
                            this.writeText(objectId, x, y, sPrimeInversion, aNNPrefs, "center", "middle", "#000000");
                            y = y + noteNameFontSize; // write on new line
                        }
                    }
                }
            };
            ClockPainter.prototype.drawId = function (aClock, clockCanvasSize, aNNPrefs) {
                var x = aClock.xpos;
                var y = aClock.ypos;
                var iCenter = clockCanvasSize / 2;
                var sFontName = aNNPrefs.fontName;
                x = x + iCenter;
                y = y + iCenter;
                var objectId = new objectid.ToneClock.ObjectId(aClock.id, 0, 6 /* CLOCKID */);
                this.writeText(objectId, x, y, objectId.getId1().toString(), aNNPrefs, "center", "middle", "#8ec89a");
            };
            return ClockPainter;
        })();
        ToneClock.ClockPainter = ClockPainter;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=clockpainter.js.map