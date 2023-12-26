/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports", 'objectid'], function(require, exports, objectid) {
    (function (ToneClock) {
        var Clock = (function () {
            function Clock(aCanvas, aMath, aHarmony) {
                this.myCanvas = aCanvas;
                this.myMath = aMath;
                this.myHarmony = aHarmony;
            }
            Clock.prototype.moveHarmony = function (aClock, harmonyId, direction, transposition) {
                this.myHarmony.move(aClock, harmonyId, direction);

                this.myHarmony.drawAll(aClock, transposition);
            };

            Clock.prototype.drawClock = function (aClock, clockSize, hourSize, clockCanvasSize, aPCSPrefs, aNNPrefs, sheetTransposition) {
                this.drawNoteNames(aClock, clockSize, clockCanvasSize, aNNPrefs); // and initializes the note numbers associated with every hour
                this.drawHours(aClock, clockSize, hourSize, clockCanvasSize); // and initializes the x,y coordinates associated with every hour
                this.myHarmony.drawAll(aClock, sheetTransposition); // including clockId
                this.drawClockId(aClock, clockCanvasSize, aNNPrefs);
                this.drawRoot(aClock, sheetTransposition, hourSize);
                this.drawClockName(aClock, aNNPrefs, aPCSPrefs, clockCanvasSize); // and all pitch class set names
            };

            Clock.prototype.drawClockName = function (aClock, aNNPrefs, aPCSPrefs, clockCanvasSize) {
                var sClockName = "";
                if (typeof aClock.name !== "undefined") {
                    sClockName = aClock.name;
                    if (sClockName == "0") {
                        sClockName = "";
                    }
                }

                // determine the id of this clock
                var clockId = aClock['id'];

                var x = aClock.xpos + clockCanvasSize / 2;

                // var y = aClock.ypos + fontsize + note name margin;
                var y = aClock.hours[6].ypos + (3 * aNNPrefs.fontSize) + aNNPrefs.margin;

                // if this clock has a name, display the name
                if (typeof sClockName !== "undefined") {
                    this.writeText(clockId, 100, sClockName, x, y, aNNPrefs);
                    y = y + aNNPrefs.fontSize; // write on new line
                }

                this.drawPitchClassNames(aClock, x, y, aPCSPrefs, aNNPrefs);
            };

            Clock.prototype.drawPitchClassNames = function (aClock, x, y, aPCSPrefs, aNNPrefs) {
                var id = aClock['id'];
                var noteNameFontSize = aNNPrefs.fontSize;

                this.myHarmony.addPitchSetNamesToHarmony(aHarmony);

                // Display the names of the various pitch class sets of the first harmony
                if (typeof aClock.harmonies !== "undefined") {
                    if (typeof aClock.harmonies[0] !== "undefined") {
                        var aHarmony = aClock.harmonies[0];
                        this.myHarmony.addPitchSetNamesToHarmony(aHarmony);

                        if (aPCSPrefs.displayPrimeForm) {
                            var sPrimeForm = "PF: " + aHarmony.primeForm;
                            this.writeText(id, 101, sPrimeForm, x, y, aNNPrefs);
                            y = y + noteNameFontSize; // write on new line
                        }

                        if (aPCSPrefs.displayForteCode) {
                            var sForteCode = "FC: " + aHarmony.forteCode;
                            this.writeText(id, 102, sForteCode, x, y, aNNPrefs);
                            y = y + noteNameFontSize; // write on new line
                        }

                        if (aPCSPrefs.displayIntervalVector) {
                            var sIntervalVector = "IV: " + aHarmony.intervalVector;
                            this.writeText(id, 103, sIntervalVector, x, y, aNNPrefs);
                            y = y + noteNameFontSize; // write on new line
                        }

                        if (aPCSPrefs.displayPrimeInversion) {
                            var sPrimeInversion = "PI: " + aHarmony.primeInversion;
                            this.writeText(id, 104, sPrimeInversion, x, y, aNNPrefs);
                            y = y + noteNameFontSize; // write on new line
                        }
                    }
                }
            };

            Clock.prototype.drawNoteNames = function (aClock, clockSize, clockCanvasSize, aNNPrefs) {
                for (var hour = 12; hour >= 1; hour--) {
                    this.initializeMidiNoteNumberOfHour(aClock, hour, aNNPrefs);
                    this.drawNoteName(aClock, hour, clockSize, clockCanvasSize, aNNPrefs);
                }
            };

            Clock.prototype.initializeMidiNoteNumberOfHour = function (aClock, hour, aNNPrefs) {
                // store the midi note number of this hour based on the note name index of this hour
                var styleId = aNNPrefs.interval;
                var midiNoteNumber = this.myMath.hourToMidiNoteNumber(hour, aNNPrefs);

                aClock.hours[hour - 1].midiNoteNumber = midiNoteNumber;
            };

            Clock.prototype.drawNoteName = function (aClock, hour, clocksize, clockCanvasSize, aNNPrefs) {
                var x = 0;
                var y = 0;
                var radius = 0;
                var noteName = "";

                var horizontalAlign = "";
                var verticalAlign = "";

                radius = clocksize / 2 + aNNPrefs.margin;
                x = aClock.xpos + this.hourToX(hour, radius, clockCanvasSize);
                y = aClock.ypos + this.hourToY(hour, radius, clockCanvasSize);

                // get the note name for this hour
                noteName = this.myMath.hourToNoteName(hour, aNNPrefs);

                switch (hour) {
                    case 12:
                        horizontalAlign = "center";
                        verticalAlign = "bottom";
                        break;
                    case 6:
                        horizontalAlign = "center";
                        verticalAlign = "top";
                        break;
                    case 3:
                        horizontalAlign = "left";
                        verticalAlign = "middle";
                        break;
                    case 9:
                        horizontalAlign = "right";
                        verticalAlign = "middle";
                        break;
                    case 1:
                        horizontalAlign = "left";
                        verticalAlign = "bottom";
                        break;
                    case 2:
                        horizontalAlign = "left";
                        verticalAlign = "bottom";
                        break;
                    case 4:
                        horizontalAlign = "left";
                        verticalAlign = "top";
                        break;
                    case 5:
                        horizontalAlign = "left";
                        verticalAlign = "top";
                        break;
                    case 7:
                        horizontalAlign = "right";
                        verticalAlign = "top";
                        break;
                    case 8:
                        horizontalAlign = "right";
                        verticalAlign = "top";
                        break;
                    case 10:
                        horizontalAlign = "right";
                        verticalAlign = "bottom";
                        break;
                    case 11:
                        horizontalAlign = "right";
                        verticalAlign = "bottom";
                        break;
                }

                this.myCanvas.writeNoteName(x, y, noteName, aNNPrefs.fontName, aNNPrefs.fontSize, horizontalAlign, verticalAlign, "#000000");
            };

            Clock.prototype.drawHours = function (aClock, clockSize, hourSize, clockCanvasSize) {
                for (var i = 12; i >= 1; i--) {
                    this.drawHour(aClock, i, clockSize, hourSize, clockCanvasSize);
                }
            };

            Clock.prototype.drawHour = function (aClock, hour, clockSize, hourSize, clockCanvasSize) {
                var x = 0;
                var y = 0;
                var radius = 0;

                radius = clockSize / 2;
                x = aClock.xpos + this.hourToX(hour, radius, clockCanvasSize);
                y = aClock.ypos + this.hourToY(hour, radius, clockCanvasSize);

                // Store the calculated position to easily draw harmonies and melodies between hours
                aClock.hours[hour - 1].xpos = x;
                aClock.hours[hour - 1].ypos = y;

                radius = hourSize / 2;

                // create objectid for event handling
                var objectId;
                objectId = new objectid.ToneClock.ObjectId(aClock.id, hour);

                // draw
                this.myCanvas.drawCircle(x, y, radius, "#000000", false, objectId);
            };

            Clock.prototype.drawClockId = function (aClock, clockCanvasSize, aNNPrefs) {
                var x = aClock.xpos;
                var y = aClock.ypos;
                var iCenter = clockCanvasSize / 2;
                var sFontName = aNNPrefs.fontName;

                x = x + iCenter;
                y = y + iCenter;

                var objectId = new objectid.ToneClock.ObjectId(aClock.id, 0);
                this.myCanvas.writeToneClockId(x, y, objectId, sFontName, (1.5 * aNNPrefs.fontSize), "center", "middle", "#8ec89a");
            };

            Clock.prototype.drawHarmonies = function (aClock, transposition) {
                if ((typeof aClock != "undefined") && (typeof aClock.harmonies != "undefined")) {
                    // determine how many harmonies this clock has
                    var length = aClock.harmonies.length;

                    // draw each harmony
                    if (length > 0) {
                        for (var i = 0; i <= (length - 1); i++) {
                            aClock.harmonies[i].id = i + 24; // Add 24 to make sure it's id is different from an hour
                            this.myHarmony.draw(aClock, aClock.harmonies[i], transposition);
                        }
                    }
                }
            };

            Clock.prototype.drawRoot = function (aClock, sheetTransposition, hourSize) {
                if (aClock.displayRoot === true) {
                    // transpose the root according to sheetTransposition
                    var noteNumber = this.myMath.transposeMidiNoteNumber(aClock.rootNoteNumber, sheetTransposition);

                    var hourIndex = this.myMath.midiNoteNumberToHourIndex(aClock, noteNumber);
                    var x = aClock.hours[hourIndex].xpos;
                    var y = aClock.hours[hourIndex].ypos;
                    var radius = ((hourSize) / 2) * 1.4;

                    // create objectid for event handling
                    var objectId = new objectid.ToneClock.ObjectId(aClock['id'], hourIndex + 1);

                    // draw
                    this.myCanvas.drawCircle(x, y, radius, "#ff0000", true, objectId);
                }
            };

            Clock.prototype.toggleRoot = function (objectId, aClock, clockCanvasSize, aNNPrefs, sheetTransposition, clockSize, hourSize) {
                // which hour is right clicked from which toneclock?
                var clockIndex = objectId.getId1();
                var hour = objectId.getId2();

                // which of the clocks is this clock?
                var aHarmony = aClock.harmonies[0];

                // determine the notenumber of the new root
                var styleId = aNNPrefs.interval;
                var newRootNoteNumber = this.myMath.hourToMidiNoteNumber(hour, aNNPrefs);

                // determine the notenumber of the old root
                var oldRootNoteNumber = aClock.rootNoteNumber % 12;

                // Draw the hour without the root colors
                this.drawHour(aClock, this.myMath.midiNoteNumberToHourIndex(aClock, oldRootNoteNumber) + 1, clockSize, hourSize, clockCanvasSize);

                if (aClock.displayRoot) {
                    if (newRootNoteNumber != oldRootNoteNumber) {
                        // toggle new root on
                        aClock.rootNoteNumber = newRootNoteNumber;
                        this.drawRoot(aClock, sheetTransposition, hourSize);
                    } else {
                        // Toggle root off
                        aClock.displayRoot = false;
                    }
                } else {
                    // toggle root display on and draw root
                    aClock.rootNoteNumber = newRootNoteNumber;
                    aClock.displayRoot = true;
                    this.drawRoot(aClock, sheetTransposition, hourSize);
                }

                this.myCanvas.updateCacheAndCanvas();
            };

            Clock.prototype.toggleHour = function (objectId, aClock, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize) {
                var clockIndex = objectId.getId1();
                var hourIndex = objectId.getId2() - 1;
                var isNotANewHarmonicStructure = true;
                var aHarmony;

                // get MidiNoteNumber of this hour
                var midiNoteNumber = this.myMath.hourToMidiNoteNumber(hourIndex + 1, aNNPrefs);

                // if this clock has no harmonies, add one basic harmony
                if (aClock.harmonies.length == 0) {
                    aHarmony = this.myHarmony.addHarmonicStructureForOneMidiNoteNumber(aClock, midiNoteNumber);
                    isNotANewHarmonicStructure = false;
                } else {
                    // get harmony of this clock
                    aHarmony = aClock.harmonies[aClock.harmonies.length - 1];
                }

                this.myHarmony.toggleHourOfHarmony.call(this, aHarmony, midiNoteNumber, isNotANewHarmonicStructure);

                // Add the pitch set names to this harmony
                this.myHarmony.addPitchSetNamesToHarmony(aHarmony);

                // Draw the results
                // aHarmony.id += 24;
                this.redrawHarmonies(aClock, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);

                this.myCanvas.updateCacheAndCanvas();
            };

            Clock.prototype.redrawHarmony = function (aClock, aHarmony, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize) {
                // draw the harmony again
                this.myHarmony.draw(aClock, aHarmony, sheetTransposition);
                this.drawClockId(aClock, clockCanvasSize, aNNPrefs); // draw clockId on top of harmony
                this.drawHours(aClock, clockSize, hourSize, clockCanvasSize); // display hours on top of harmony
                this.drawRoot(aClock, sheetTransposition, hourSize); // display root on top of hour
                this.drawClockName(aClock, aNNPrefs, aPCSPrefs, clockCanvasSize);
            };

            Clock.prototype.redrawHarmonies = function (aClock, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize) {
                // draw the harmony again
                this.myHarmony.drawAll(aClock, sheetTransposition);
                this.drawClockId(aClock, clockCanvasSize, aNNPrefs); // draw clockId on top of harmony
                this.drawHours(aClock, clockSize, hourSize, clockCanvasSize); // display hours on top of harmony
                this.drawRoot(aClock, sheetTransposition, hourSize); // display root on top of hour
                this.drawClockName(aClock, aNNPrefs, aPCSPrefs, clockCanvasSize);
            };

            Clock.prototype.writeText = function (clockId, textId, text, x, y, aNNPefs) {
                var objectId = new objectid.ToneClock.ObjectId(clockId, textId);
                this.myCanvas.writeToneClockName(objectId, x, y, text, aNNPefs.fontName, aNNPefs.fontSize, "center", "top", "#000000");
            };

            Clock.prototype.hourToX = function (hour, radius, clockCanvasSize) {
                var centerX = clockCanvasSize / 2;
                var x = 0;
                var radianMultiplier = Math.PI / 180;

                // var radianMultiplier = 180 / Math.PI;
                x = centerX + Math.cos((hour * 30 - 90) * radianMultiplier) * radius;
                return x;
            };

            Clock.prototype.hourToY = function (hour, radius, clockCanvasSize) {
                var centerY = (clockCanvasSize / 2);
                var y = 0;
                var radianMultiplier = Math.PI / 180;

                // var radianMultiplier = 180 / Math.PI;
                y = centerY + Math.sin((hour * 30 - 90) * radianMultiplier) * radius;
                return y;
            };
            return Clock;
        })();
        ToneClock.Clock = Clock;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
//# sourceMappingURL=clock.js.map
