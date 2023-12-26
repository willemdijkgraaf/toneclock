define(["require", "exports", 'clock', 'toneclockmath'], function(require, exports, clock, toneclockmath) {
    (function (ToneClock) {
        var Sheet = (function () {
            function Sheet(aCanvas, aJSONSheet) {
                this.myCanvasWidth = 0;
                this.myCanvasHeight = 0;
                this.myCanvas = aCanvas;
                this.Clock = new clock.ToneClock.Clock(aCanvas, aJSONSheet.toneclocks);
                this.myJSONSheet = aJSONSheet;
                this.complementJSONSHeetWithClocks(this.myJSONSheet.clockshorizontal, this.myJSONSheet.clocksvertical);
                this.myMath = new toneclockmath.ToneClock.Math;
            }
            Sheet.prototype.getUniqueHarmonyId = function (objectId) {
                var aClocks = this.myJSONSheet.toneclocks;
                return this.Clock.getUniqueHarmonyId(objectId, aClocks);
            };

            Sheet.prototype.complementJSONSHeetWithClocks = function (clocksHorizontal, clocksVertical) {
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
                        this.addHoursToClock(this.myJSONSheet.toneclocks[i]);
                        i++;
                    }
                }
            };

            Sheet.prototype.addHoursToClock = function (aClock) {
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
                    //}
                }
            };

            Sheet.prototype.transposeHarmony = function (harmonyId, steps) {
                var aNNPrefs = this.getNoteNamePreferences();
                var aPCSPrefs = this.getPitchClassSetPreferences();

                var sheetTransposition = this.getSheetTransposition();
                var clockCanvasSize = this.getClockCanvasSize();
                var clockSize = this.getClockSize();
                var hourSize = this.getHourSize();

                this.Clock.transposeHarmony(this.myJSONSheet.toneclocks, harmonyId, steps, aNNPrefs, aPCSPrefs, sheetTransposition, clockCanvasSize, clockSize, hourSize);
            };

            Sheet.prototype.getJSONSheet = function () {
                return this.myJSONSheet;
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
                // style id's can be 0 = 4ths, 1 = 2nds
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

            Sheet.prototype.setDisplayForteCode = function (bDisplay) {
                this.myJSONSheet.displaySetNameForteCode = bDisplay;
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

            Sheet.prototype.getClock = function (clockIndex) {
                return this.myJSONSheet.toneclocks[clockIndex];
            };

            Sheet.prototype.deleteClocksOutsideOfSheet = function (clocksHorizontal, clocksVertical) {
                var clocksNeeded;

                clocksNeeded = clocksHorizontal * clocksVertical;

                while (this.myJSONSheet.toneclocks.length > clocksNeeded) {
                    this.myJSONSheet.toneclocks.pop();
                }
            };

            Sheet.prototype.removeHarmoniesFromSheet = function (clocksVertical, clocksHorizontal) {
                var i = 0;

                for (var y = 0; y < clocksVertical; y++) {
                    for (var x = 0; x < clocksHorizontal; x++) {
                        if (typeof (this.myJSONSheet.toneclocks[i]) !== "undefined") {
                            this.Clock.removeAllHarmonies(this.myJSONSheet.toneclocks[i]);
                        }
                        i++;
                    }
                }
            };

            Sheet.prototype.toggleRoot = function (objectId) {
                var aObjectId = this.myMath.ObjectIdToArray(objectId);
                var clockIndex = aObjectId[0];
                var aClock = this.getClock(clockIndex);

                var clockCanvasSize = this.myJSONSheet.clockcanvassize;
                var aNNPrefs = this.getNoteNamePreferences();
                var sheetTransposition = this.myJSONSheet.sheetTransposition;
                var clockSize = this.myJSONSheet.clocksize;
                var hourSize = this.myJSONSheet.hoursize;

                this.Clock.toggleRoot(objectId, aClock, clockCanvasSize, aNNPrefs, sheetTransposition, clockSize, hourSize);
            };

            Sheet.prototype.toggleHour = function (objectId) {
                var aObjectId = this.myMath.ObjectIdToArray(objectId);
                var clockIndex = aObjectId[0];
                var aClock = this.getClock(clockIndex);

                var clockCanvasSize = this.myJSONSheet.clockcanvassize;
                var aNNPrefs = this.getNoteNamePreferences();
                var aPCSPrefs = this.getPitchClassSetPreferences();
                var sheetTransposition = this.myJSONSheet.sheetTransposition;
                var clockSize = this.myJSONSheet.clocksize;
                var hourSize = this.myJSONSheet.hoursize;

                this.Clock.toggleHour(objectId, aClock, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);
            };

            Sheet.prototype.addHarmony = function (toneClockId, harmonyId, sColor, bFill, aMidiNotes) {
                var aObjectId = this.myMath.ObjectIdToArray(toneClockId);
                var clockIndex = aObjectId[0];
                var aClock = this.getClock(clockIndex);

                var clockCanvasSize = this.myJSONSheet.clockcanvassize;
                var aNNPrefs = this.getNoteNamePreferences();
                var aPCSPrefs = this.getPitchClassSetPreferences();
                var sheetTransposition = this.myJSONSheet.sheetTransposition;
                var clockSize = this.myJSONSheet.clocksize;
                var hourSize = this.myJSONSheet.hoursize;

                this.Clock.addHarmony(aClock, harmonyId, sColor, bFill, this.myJSONSheet.sheetTransposition, aMidiNotes, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);
            };

            Sheet.prototype.deleteHarmony = function (objectId) {
                var aObjectId = this.myMath.ObjectIdToArray(objectId);
                var toneclockId = aObjectId[0];
                var harmonyId = aObjectId[1];

                var aClock = this.myJSONSheet.toneclocks[toneclockId];
                this.Clock.deleteHarmony(aClock, harmonyId);
            };

            Sheet.prototype.moveHarmony = function (objectId, direction) {
                var aObjectId = this.myMath.ObjectIdToArray(objectId);
                var toneclockId = aObjectId[0];
                var harmonyId = aObjectId[1];

                var aClock = this.myJSONSheet.toneclocks[toneclockId];
                this.Clock.moveHarmony(aClock, harmonyId, direction, this.myJSONSheet.sheetTransposition);
            };

            Sheet.prototype.setColorOfHarmony = function (toneClockId, sColor) {
                var aObjectId = this.myMath.ObjectIdToArray(toneClockId);
                var clockIndex = aObjectId[0];
                var harmonyId = aObjectId[1] - 24;
                var aClock = this.getClock(clockIndex);

                var clockCanvasSize = this.myJSONSheet.clockcanvassize;
                var aNNPrefs = this.getNoteNamePreferences();
                var aPCSPrefs = this.getPitchClassSetPreferences();
                var sheetTransposition = this.myJSONSheet.sheetTransposition;
                var clockSize = this.myJSONSheet.clocksize;
                var hourSize = this.myJSONSheet.hoursize;

                this.Clock.setColorOfHarmony(aClock, harmonyId, sColor, this.myJSONSheet.sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);
            };

            Sheet.prototype.draw = function () {
                // Delete all elements on current canvas
                this.myCanvas.clearCanvas(); // make "old" canvas blank

                // recalculate the size of each clock canvas based on the current property settings at sheet level
                this.myJSONSheet.clockcanvassize = this.calculateClockCanvasSize(this.myJSONSheet.clocksize / 2);

                // set the canvas size of the current sheet
                this.setCanvasWidth(this.getClocksHorizontal() * this.myJSONSheet.clockcanvassize);
                this.setCanvasHeight(this.getClocksVertical() * this.myJSONSheet.clockcanvassize);
                this.myCanvas.setSize(this.getCanvasWidth(), this.getCanvasHeight());

                // set the area size of the canvas to be cached
                this.myCanvas.SetCanvasCacheArea(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

                // in case this sheet has more clocks than the previous sheet, make sure that the array of clocks has all the elements necessary
                this.complementJSONSHeetWithClocks(this.getClocksHorizontal(), this.getClocksVertical());

                var aPCSPrefs = this.getPitchClassSetPreferences();
                var aNNPrefs = this.getNoteNamePreferences();
                var clockSize = this.myJSONSheet.clocksize;
                var hourSize = this.myJSONSheet.hoursize;

                this.drawClocks(this.getSheetTransposition(), clockSize, hourSize, aPCSPrefs, aNNPrefs, this.myJSONSheet.clockcanvassize);
                this.drawSheetTitle();
                this.myCanvas.updateCacheAndCanvas();
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
            Sheet.prototype.drawClocks = function (sheetTransposition, clockSize, hourSize, aPCSPrefs, aNNPrefs, clockCanvasSize) {
                // to display the clock ids, start counting from 0
                var clockId = 0;

                var aClock;
                for (var i = 0; i < this.myJSONSheet.toneclocks.length; i++) {
                    aClock = this.myJSONSheet.toneclocks[i];
                    aClock.id = clockId;
                    clockId += 1;
                    this.Clock.drawClock(aClock, clockSize, hourSize, clockCanvasSize, aPCSPrefs, aNNPrefs, sheetTransposition);
                }
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
                var numberOfLines = 1;
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

            Sheet.prototype.drawSheetTitle = function () {
                var iCanvasWidth = this.getClocksHorizontal() * this.myJSONSheet.clockcanvassize;
                var sSheetTitle = this.getSheetTitle();

                var x = iCanvasWidth / 2;
                var y = this.myJSONSheet.noteNameFontSize;

                this.myCanvas.writeSheetTitle(x, y, sSheetTitle, this.myJSONSheet.noteNameFontName, this.myJSONSheet.noteNameFontSize, "center", "top", "#000000");
            };
            return Sheet;
        })();
        ToneClock.Sheet = Sheet;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
//# sourceMappingURL=sheet.js.map
