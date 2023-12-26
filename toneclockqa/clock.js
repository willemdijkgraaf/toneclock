define(["require", "exports", 'toneclockmath', 'harmony'], function(require, exports, toneclockmath, harmony) {
    (function (ToneClock) {
        (function (moveHarmony) {
            moveHarmony[moveHarmony["TO_FRONT"] = 0] = "TO_FRONT";
            moveHarmony[moveHarmony["FORWARD"] = 1] = "FORWARD";
            moveHarmony[moveHarmony["BACKWARD"] = 2] = "BACKWARD";
            moveHarmony[moveHarmony["TO_BACK"] = 3] = "TO_BACK";
        })(ToneClock.moveHarmony || (ToneClock.moveHarmony = {}));
        var moveHarmony = ToneClock.moveHarmony;

        var Clock = (function () {
            // private myClocks: Array<IJSONClock>;
            function Clock(aCanvas, aClocks) {
                this.myCanvas = aCanvas;

                //this.myClocks = aClocks;
                this.myHarmony = new harmony.ToneClock.Harmony(this.myCanvas);
                this.myMath = new toneclockmath.ToneClock.Math();
            }
            Clock.prototype.getUniqueHarmonyId = function (objectId, aClocks) {
                var aToneClockId = this.myMath.ObjectIdToArray(objectId);
                var toneclockIndex = aToneClockId[0];

                // find the highest harmony Id in use
                var harmonyId = 0;
                for (var x = 0; x < aClocks[toneclockIndex].harmonies.length; x++) {
                    if (aClocks[toneclockIndex].harmonies[x].id > harmonyId) {
                        harmonyId = aClocks[toneclockIndex].harmonies[x].id;
                    }
                }

                //  return a unique Id that is 1 higher than the highest
                return harmonyId + 1;
            };

            Clock.prototype.moveHarmony = function (aClock, harmonyId, direction, transposition) {
                this.myHarmony.move(aClock, harmonyId, direction);

                this.myHarmony.drawAll(aClock, transposition);
            };

            Clock.prototype.transposeHarmony = function (aClocks, harmonyId, steps, aNNPrefs, aPCSPrefs, sheetTransposition, clockCanvasSize, clockSize, hourSize) {
                var aObjectId = this.myMath.ObjectIdToArray(harmonyId);
                var clockIndex = aObjectId[0];
                var aClock = aClocks[clockIndex];
                var aHarmony = this.myHarmony.objectIdToHarmony(harmonyId, aClock);

                this.myHarmony.transpose(aClock, aHarmony, steps, aNNPrefs);

                // redraw the transposed harmony
                this.redrawHarmonies(aClock, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);
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
                var clockId = aClock['id'];
                var noteNameFontSize = aNNPrefs.fontSize;

                this.myHarmony.addPitchSetNamesToHarmony(aHarmony);

                // Display the names of the various pitch class sets of the first harmony
                if (typeof aClock.harmonies !== "undefined") {
                    if (typeof aClock.harmonies[0] !== "undefined") {
                        var aHarmony = aClock.harmonies[0];
                        this.myHarmony.addPitchSetNamesToHarmony(aHarmony);

                        if (aPCSPrefs.displayPrimeForm) {
                            var sPrimeForm = "PF: " + aHarmony.primeForm;
                            this.writeText(clockId, 101, sPrimeForm, x, y, aNNPrefs);
                            y = y + noteNameFontSize; // write on new line
                        }

                        if (aPCSPrefs.displayForteCode) {
                            var sForteCode = "FC: " + aHarmony.forteCode;
                            this.writeText(clockId, 102, sForteCode, x, y, aNNPrefs);
                            y = y + noteNameFontSize; // write on new line
                        }

                        if (aPCSPrefs.displayIntervalVector) {
                            var sIntervalVector = "IV: " + aHarmony.intervalVector;
                            this.writeText(clockId, 103, sIntervalVector, x, y, aNNPrefs);
                            y = y + noteNameFontSize; // write on new line
                        }

                        if (aPCSPrefs.displayPrimeInversion) {
                            var sPrimeInversion = "PI: " + aHarmony.primeInversion;
                            this.writeText(clockId, 104, sPrimeInversion, x, y, aNNPrefs);
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
                objectId = this.myMath.createObjectId(aClock.id, hour);

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

                this.myCanvas.writeToneClockId(x, y, aClock.id, sFontName, (1.5 * aNNPrefs.fontSize), "center", "middle", "#8ec89a");
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
                    var objectId;
                    objectId = this.myMath.createObjectId(aClock['id'], hourIndex + 1); // make the id different from the harmony id

                    // draw
                    this.myCanvas.drawCircle(x, y, radius, "#ff0000", true, objectId);
                }
            };

            Clock.prototype.getColorOfHarmony = function (objectId, aClock) {
                return this.myHarmony.getColor(objectId, aClock);
            };

            Clock.prototype.setColorOfHarmony = function (aClock, harmonyId, color, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize) {
                // set the color of this harmony
                this.myHarmony.setColor(harmonyId, aClock, color);

                // redraw this harmony
                //var aHarmony:harmony.ToneClock.IJsonHarmony = this.myHarmony.objectIdToHarmony(objectId, aClock); // @@@TBD refactor this line!
                //this.myHarmony.draw(aClock, aHarmony, sheetTransposition);
                this.redrawHarmonies(aClock, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);
            };

            Clock.prototype.toggleRoot = function (objectId, aClock, clockCanvasSize, aNNPrefs, sheetTransposition, clockSize, hourSize) {
                // which hour is right clicked from which toneclock?
                var aObjectId = this.myMath.ObjectIdToArray(objectId);

                var clockIndex = aObjectId[0];
                var hour = aObjectId[1];
                console.log("hour: " + hour);

                // which of the clocks is this clock?
                var aHarmony = aClock.harmonies[0];

                // determine the notenumber of the new root
                var styleId = aNNPrefs.interval;
                var newRootNoteNumber = this.myMath.hourToMidiNoteNumber(hour, aNNPrefs);

                console.log("newRootNoteNumber: " + newRootNoteNumber);

                // determine the notenumber of the old root
                var oldRootNoteNumber = aClock.rootNoteNumber % 12;
                console.log("oldRootNoteNumber: " + oldRootNoteNumber);

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
                var aObjectId = this.myMath.ObjectIdToArray(objectId);
                var clockIndex = aObjectId[0];
                var hourIndex = aObjectId[1] - 1;
                var isNotANewHarmonicStructure = true;
                var aHarmony;

                // get MidiNoteNumber of this hour
                var midiNoteNumber = this.myMath.hourToMidiNoteNumber(hourIndex + 1, aNNPrefs);

                // if this clock has no harmonies, add one basic harmony
                if (aClock.harmonies.length == 0) {
                    aHarmony = this.myHarmony.createHarmonicStructure(aClock, midiNoteNumber);
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

            Clock.prototype.addHarmony = function (aClock, harmonyId, sColor, bFill, transposition, aMidiNotes, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize) {
                var aHarmony = this.myHarmony.add(aClock, harmonyId, sColor, bFill, aMidiNotes);
                this.redrawHarmonies(aClock, transposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);
                return aHarmony;
            };

            Clock.prototype.deleteHarmony = function (aClock, harmonyId) {
                this.myHarmony.remove(aClock, harmonyId);
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

            Clock.prototype.removeAllHarmonies = function (aClock) {
                this.myHarmony.removeAllFromClock(aClock);
            };

            Clock.prototype.writeText = function (clockId, textId, text, x, y, aNNPefs) {
                var objectId = this.myMath.createObjectId(clockId, textId);
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
