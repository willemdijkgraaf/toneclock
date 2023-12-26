/// <reference path="./Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports"], function (require, exports) {
    var ToneClock;
    (function (ToneClock) {
        var Sheet = (function () {
            function Sheet(aCanvas, aJSONSheet) {
                this.myCanvasWidth = 0;
                this.myCanvasHeight = 0;
                this.myCanvas = aCanvas;
                this.myJSONSheet = aJSONSheet;
                this.resize(this.myJSONSheet.clockshorizontal, this.myJSONSheet.clocksvertical);
            }
            Sheet.prototype.setData = function (aJSONSheet) {
                this.myJSONSheet = aJSONSheet;
            };
            Sheet.prototype.getData = function () {
                return this.myJSONSheet;
            };
            Sheet.prototype.resize = function (clocksHorizontal, clocksVertical) {
                var i = 0;
                var length = 0;
                // if toneclocks collection element doesn´t exist, create it
                if (typeof (this.myJSONSheet.toneclocks) === "undefined") {
                    this.myJSONSheet.toneclocks = [];
                    console.log("toneclocks: " + this.myJSONSheet.toneclocks);
                }
                for (var y = 0; y < clocksVertical; y++) {
                    for (var x = 0; x < clocksHorizontal; x++) {
                        if (typeof (this.myJSONSheet.toneclocks[i]) === "undefined") {
                            length = this.myJSONSheet.toneclocks.push({
                                "id": 0,
                                "name": "0",
                                "xpos": 0,
                                "ypos": 0,
                                "displayRoot": false,
                                "rootNoteNumber": 0,
                                "hours": [
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                                    { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 }
                                ],
                                "harmonies": []
                            });
                        }
                        this.myJSONSheet.toneclocks[i].xpos = x * this.myJSONSheet.clockcanvassize;
                        this.myJSONSheet.toneclocks[i].ypos = y * this.myJSONSheet.clockcanvassize;
                        this.addHoursToClockData(this.myJSONSheet.toneclocks[i]);
                        i++;
                    }
                }
            };
            Sheet.prototype.addHoursToClockData = function (aClock) {
                if (typeof aClock !== "undefined") {
                    //if (typeof aClock.hours === "undefined") {
                    aClock.hours = [
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 },
                        { "xpos": 0, "ypos": 0, "midiNoteNumber": 0 }
                    ];
                }
            };
            Sheet.prototype.getSheetTitle = function () {
                return this.myJSONSheet.name;
            };
            Sheet.prototype.setSheetTitle = function (sTitle) {
                this.myJSONSheet.name = sTitle;
            };
            Sheet.prototype.getSheetTransposition = function () {
                return this.myJSONSheet.sheetTransposition;
            };
            Sheet.prototype.setSheetTransposition = function (iTransposition) {
                this.myJSONSheet.sheetTransposition = iTransposition % 7; // positive and negative -5 ... 5
            };
            Sheet.prototype.getClocksHorizontal = function () {
                return this.myJSONSheet.clockshorizontal;
            };
            Sheet.prototype.setHourSize = function (size) {
                this.myJSONSheet.hoursize = size;
            };
            Sheet.prototype.getHourSize = function () {
                return this.myJSONSheet.hoursize;
            };
            Sheet.prototype.getClockSize = function () {
                return this.myJSONSheet.clocksize;
            };
            Sheet.prototype.setClockSize = function (size) {
                this.myJSONSheet.clocksize = size;
            };
            Sheet.prototype.setClocksHorizontal = function (amount) {
                this.myJSONSheet.clockshorizontal = amount;
            };
            Sheet.prototype.getClocksVertical = function () {
                return this.myJSONSheet.clocksvertical;
            };
            Sheet.prototype.setClocksVertical = function (amount) {
                this.myJSONSheet.clocksvertical = amount;
            };
            Sheet.prototype.getNoteNameStyle = function () {
                return this.myJSONSheet.noteNameInterval;
            };
            Sheet.prototype.setNoteNameInterval = function (intervalId) {
                // style id"s can be 0 = 4ths, 1 = 2nds
                this.myJSONSheet.noteNameInterval = intervalId;
            };
            Sheet.prototype.getNoteNameAs = function () {
                return this.myJSONSheet.noteNameAs;
            };
            Sheet.prototype.setNoteNameAs = function (iNameClass) {
                this.myJSONSheet.noteNameAs = iNameClass;
            };
            Sheet.prototype.getNoteNameFontSize = function () {
                return this.myJSONSheet.noteNameFontSize;
            };
            Sheet.prototype.setNoteNameFontSize = function (pixels) {
                this.myJSONSheet.noteNameFontSize = pixels;
            };
            Sheet.prototype.getNoteNameRotation = function () {
                return this.myJSONSheet.noteNameRotation;
            };
            Sheet.prototype.setNoteNameRotation = function (rotation) {
                this.myJSONSheet.noteNameRotation = rotation;
            };
            Sheet.prototype.getNoteNameFontName = function () {
                return this.myJSONSheet.noteNameFontName;
            };
            Sheet.prototype.setNoteNameFontName = function (fontName) {
                this.myJSONSheet.noteNameFontName = fontName;
            };
            Sheet.prototype.getNoteNameMargin = function () {
                return this.myJSONSheet.noteNameMargin;
            };
            Sheet.prototype.setNoteNameDirection = function (bClockwise) {
                this.myJSONSheet.noteNameDirection = bClockwise;
            };
            Sheet.prototype.getNoteNameDirection = function () {
                return this.myJSONSheet.noteNameDirection;
            };
            Sheet.prototype.setNoteNameFlat = function (bFlat) {
                this.myJSONSheet.noteNameAccidentals = bFlat;
            };
            Sheet.prototype.getNoteNameFlat = function () {
                return this.myJSONSheet.noteNameAccidentals;
            };
            Sheet.prototype.setNoteNameMargin = function (pixels) {
                this.myJSONSheet.noteNameMargin = pixels;
            };
            Sheet.prototype.getClockCanvasSize = function () {
                return this.myJSONSheet.clockcanvassize;
            };
            Sheet.prototype.setClockCanvasSize = function (pixels) {
                this.myJSONSheet.clockcanvassize = pixels;
            };
            Sheet.prototype.setDisplayPrimeForm = function (bDisplay) {
                this.myJSONSheet.displaySetNamePrimeForm = bDisplay;
            };
            Sheet.prototype.getDisplayPrimeForm = function () {
                return this.myJSONSheet.displaySetNamePrimeForm;
            };
            Sheet.prototype.setPitchClassSetPreferences = function (PCSNames) {
                this.myJSONSheet.displaySetNameForteCode = PCSNames.displayForteCode;
                this.myJSONSheet.displaySetNameIntervalVector = PCSNames.displayIntervalVector;
                this.myJSONSheet.displaySetNamePrimeForm = PCSNames.displayPrimeForm;
                this.myJSONSheet.displaySetNamePrimeInversion = PCSNames.displayPrimeInversion;
            };
            Sheet.prototype.getDisplayForteCode = function () {
                return this.myJSONSheet.displaySetNameForteCode;
            };
            Sheet.prototype.setDisplayIntervalVector = function (bDisplay) {
                this.myJSONSheet.displaySetNameIntervalVector = bDisplay;
            };
            Sheet.prototype.getDisplayIntervalVector = function () {
                return this.myJSONSheet.displaySetNameIntervalVector;
            };
            Sheet.prototype.setDisplayPrimeInversion = function (bDisplay) {
                this.myJSONSheet.displaySetNamePrimeInversion = bDisplay;
            };
            Sheet.prototype.getDisplayPrimeInversion = function () {
                return this.myJSONSheet.displaySetNamePrimeInversion;
            };
            Sheet.prototype.setCanvasSize = function (horizontalClocks, verticalClocks) {
                this.myJSONSheet.clockshorizontal = horizontalClocks;
                this.myJSONSheet.clocksvertical = verticalClocks;
                this.deleteClocksOutsideOfSheet(this.getClocksHorizontal(), this.getClocksVertical());
            };
            Sheet.prototype.getCanvasWidth = function () {
                return this.myCanvasWidth;
            };
            Sheet.prototype.setCanvasWidth = function (width) {
                this.myCanvasWidth = width;
            };
            Sheet.prototype.getCanvasHeight = function () {
                return this.myCanvasHeight;
            };
            Sheet.prototype.setCanvasHeight = function (height) {
                this.myCanvasHeight = height;
            };
            Sheet.prototype.getJSONClock = function (clockIndex) {
                return this.myJSONSheet.toneclocks[clockIndex];
            };
            Sheet.prototype.deleteClocksOutsideOfSheet = function (clocksHorizontal, clocksVertical) {
                var clocksNeeded;
                clocksNeeded = clocksHorizontal * clocksVertical;
                while (this.myJSONSheet.toneclocks.length > clocksNeeded) {
                    this.myJSONSheet.toneclocks.pop();
                }
            };
            Sheet.prototype.removeHarmoniesFromSheet = function (aHarmony) {
                var i = 0;
                var clocksVertical = this.getClocksVertical();
                var clocksHorizontal = this.getClocksHorizontal();
                for (var y = 0; y < clocksVertical; y++) {
                    for (var x = 0; x < clocksHorizontal; x++) {
                        if (typeof (this.myJSONSheet.toneclocks[i]) !== "undefined") {
                            aHarmony.removeAllFromClock(this.myJSONSheet.toneclocks[i]);
                        }
                        i++;
                    }
                }
            };
            Sheet.prototype.getPitchClassSetPreferences = function () {
                var aPCSPrefs = {
                    "displayForteCode": this.myJSONSheet.displaySetNameForteCode,
                    "displayIntervalVector": this.myJSONSheet.displaySetNameIntervalVector,
                    "displayPrimeForm": this.myJSONSheet.displaySetNamePrimeForm,
                    "displayPrimeInversion": this.myJSONSheet.displaySetNamePrimeInversion
                };
                return aPCSPrefs;
            };
            Sheet.prototype.getNoteNamePreferences = function () {
                var aNNPrefs = {
                    "accidentals": this.myJSONSheet.noteNameAccidentals,
                    "direction": this.myJSONSheet.noteNameDirection,
                    "fontName": this.myJSONSheet.noteNameFontName,
                    "fontSize": this.myJSONSheet.noteNameFontSize,
                    "interval": this.myJSONSheet.noteNameInterval,
                    "margin": this.myJSONSheet.noteNameMargin,
                    "nameAs": this.myJSONSheet.noteNameAs,
                    "rotation": this.myJSONSheet.noteNameRotation
                };
                return aNNPrefs;
            };
            Sheet.prototype.calculateClockCanvasSize = function (clockRadius) {
                // set clock size only if it stays within the boundaries of the clock canvas
                var clockCanvasSize = 0;
                // determine the basic size of the clocks
                clockCanvasSize = clockRadius * 2;
                // add the note name margin
                clockCanvasSize += this.myJSONSheet.noteNameMargin * 2;
                // add the standard clock margin
                clockCanvasSize += 30 * 2;
                // get the size of the font in use
                var fontSize = this.myJSONSheet.noteNameFontSize;
                // determine the amount of text lines necessary
                var numberOfLines = 1; // line 1 is the name of the clock
                if (this.myJSONSheet.displaySetNameForteCode) {
                    numberOfLines += 1;
                }
                if (this.myJSONSheet.displaySetNameIntervalVector) {
                    numberOfLines += 1;
                }
                if (this.myJSONSheet.displaySetNamePrimeForm) {
                    numberOfLines += 1;
                }
                if (this.myJSONSheet.displaySetNamePrimeInversion) {
                    numberOfLines += 1;
                }
                clockCanvasSize += (numberOfLines * fontSize) * 2;
                return clockCanvasSize;
            };
            return Sheet;
        })();
        ToneClock.Sheet = Sheet;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=sheet.js.map