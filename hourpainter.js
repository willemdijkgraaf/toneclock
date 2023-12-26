/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports", "./objectid"], function (require, exports, objectid) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var HourPainter = (function () {
            function HourPainter(aCanvas, aMidiNoteNumber, aHour) {
                this.myCanvas = aCanvas;
                this.myMidiNoteNumber = aMidiNoteNumber;
                this.myHour = aHour;
            }
            HourPainter.prototype.writeText = function (objectId, x, y, text, aNNPrefs, textAlign, textBaseline, color) {
                this.myCanvas.writeText(objectId, x, y, text, aNNPrefs.fontName, aNNPrefs.fontSize, textAlign, textBaseline, color);
            };
            HourPainter.prototype.drawNoteNames = function (aClock, clockSize, clockCanvasSize, aNNPrefs) {
                var objectId = new objectid.ToneClock.ObjectId(aClock.id, hour, 2 /* NOTENAME */);
                for (var hour = 12; hour >= 1; hour--) {
                    this.setMidiNoteNumber(aClock, hour, aNNPrefs);
                    this.drawNoteName(objectId, aClock, hour, clockSize, clockCanvasSize, aNNPrefs);
                }
            };
            HourPainter.prototype.setMidiNoteNumber = function (aClock, hour, aNNPrefs) {
                // store the midi note number of this hour based on the note name index of this hour
                var midiNoteNumber = this.myHour.toMidiNoteNumber(hour, aNNPrefs);
                aClock.hours[hour - 1].midiNoteNumber = midiNoteNumber;
            };
            HourPainter.prototype.drawNoteName = function (objectId, aClock, hour, clocksize, clockCanvasSize, aNNPrefs) {
                var x = 0;
                var y = 0;
                var radius = 0;
                var noteName = "";
                var horizontalAlign = "center"; // left, center, right
                var verticalAlign = "middle"; // top, middle, bottom
                radius = clocksize / 2;
                x = aClock.xpos + this.getX(hour, radius, clockCanvasSize);
                y = aClock.ypos + this.getY(hour, radius, clockCanvasSize);
                // get the note name for this hour
                noteName = this.myHour.toNoteName(hour, aNNPrefs);
                var noteNameObjectId = new objectid.ToneClock.ObjectId(objectId.getId1(), hour, 2 /* NOTENAME */);
                this.writeText(noteNameObjectId, x, y, noteName, aNNPrefs, horizontalAlign, verticalAlign, "#000000");
            };
            HourPainter.prototype.drawHarmonicFunction = function (objectId, aClock, hour, rootAsMidiNoteNumber, clocksize, hoursize, clockCanvasSize, aNNPrefs) {
                var x = 0;
                var y = 0;
                var radius = 0;
                var harmonicFunction = "";
                var horizontalAlign = ""; // left, center, right
                var verticalAlign = ""; // top, middle, bottom
                radius = clocksize / 2 + hoursize / 2 + aNNPrefs.margin;
                x = aClock.xpos + this.getX(hour, radius, clockCanvasSize);
                y = aClock.ypos + this.getY(hour, radius, clockCanvasSize);
                // get the note name for this hour
                harmonicFunction = this.myHour.toHarmonicFunction(hour, rootAsMidiNoteNumber, aNNPrefs);
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
                this.writeText(objectId, x, y, harmonicFunction, aNNPrefs, horizontalAlign, verticalAlign, "#000000");
            };
            HourPainter.prototype.drawHours = function (aClock, clockSize, hourSize, clockCanvasSize) {
                for (var i = 12; i >= 1; i--) {
                    this.drawHour(aClock, i, clockSize, hourSize, clockCanvasSize);
                }
            };
            HourPainter.prototype.drawHour = function (aClock, hour, clockSize, hourSize, clockCanvasSize) {
                var x = 0;
                var y = 0;
                var radius = 0;
                radius = clockSize / 2;
                x = aClock.xpos + this.getX(hour, radius, clockCanvasSize);
                y = aClock.ypos + this.getY(hour, radius, clockCanvasSize);
                // store the calculated position to easily draw harmonies and melodies between hours
                aClock.hours[hour - 1].xpos = x;
                aClock.hours[hour - 1].ypos = y;
                radius = hourSize / 2;
                // create objectid for event handling
                var objectId;
                objectId = new objectid.ToneClock.ObjectId(aClock.id, hour, 1 /* HOUR */);
                // draw
                this.myCanvas.drawCircle(x, y, radius, "#000000", false, objectId);
            };
            HourPainter.prototype.drawRoot = function (aClock, sheetTransposition, hourSize) {
                if (aClock.displayRoot === true) {
                    // transpose the root according to sheetTransposition
                    var noteNumber = this.myMidiNoteNumber.transpose(aClock.rootNoteNumber, sheetTransposition);
                    var hourIndex = this.myMidiNoteNumber.toHourIndex(aClock, noteNumber);
                    var x = aClock.hours[hourIndex].xpos;
                    var y = aClock.hours[hourIndex].ypos;
                    var radius = ((hourSize) / 2) * 1.4; // 40 percent larger than other clocks
                    // create objectid for event handling
                    var objectId = new objectid.ToneClock.ObjectId(aClock.id, hourIndex + 1, 5 /* ROOT */); // make the id different from the harmony id
                    // draw
                    this.myCanvas.drawCircle(x, y, radius, "#ff0000", true, objectId);
                }
            };
            HourPainter.prototype.drawHarmonicFunctions = function (aClock, clockSize, hoursize, clockCanvasSize, sheetTransposition, aNNPrefs) {
                var objectId;
                var rootAsMidiNoteNumber = this.myMidiNoteNumber.transpose(aClock.rootNoteNumber, sheetTransposition);
                for (var hour = 1; hour < 13; hour++) {
                    objectId = new objectid.ToneClock.ObjectId(aClock.id, hour, 3 /* HARMONICFUNCTION */);
                    if (aClock.displayRoot === true) {
                        this.drawHarmonicFunction(objectId, aClock, hour, rootAsMidiNoteNumber, clockSize, hoursize, clockCanvasSize, aNNPrefs);
                    }
                    else {
                        this.myCanvas.remove(objectId);
                    }
                }
            };
            HourPainter.prototype.toggleRoot = function (objectId, aClock, clockCanvasSize, aNNPrefs, sheetTransposition, clockSize, hourSize) {
                // which hour is right clicked from which toneclock?
                var hour = objectId.getId2();
                // determine the notenumber of the new root
                var newRootNoteNumber = this.myHour.toMidiNoteNumber(hour, aNNPrefs);
                // determine the notenumber of the old root
                var oldRootNoteNumber = aClock.rootNoteNumber % 12;
                // remove the old root
                var hourOfOldRoot = this.myMidiNoteNumber.toHourIndex(aClock, oldRootNoteNumber) + 1;
                var oldRootObjectId = new objectid.ToneClock.ObjectId(aClock.id, hourOfOldRoot, 5 /* ROOT */);
                this.myCanvas.remove(oldRootObjectId);
                if (aClock.displayRoot) {
                    if (newRootNoteNumber !== oldRootNoteNumber) {
                        // toggle new root on
                        aClock.rootNoteNumber = newRootNoteNumber;
                        this.drawRoot(aClock, sheetTransposition, hourSize);
                    }
                    else {
                        // toggle root off
                        aClock.displayRoot = false;
                    }
                }
                else {
                    // toggle root display on and draw root
                    aClock.rootNoteNumber = newRootNoteNumber;
                    aClock.displayRoot = true;
                    this.drawRoot(aClock, sheetTransposition, hourSize);
                }
            };
            HourPainter.prototype.getX = function (hour, radius, clockCanvasSize) {
                var centerX = clockCanvasSize / 2;
                var x = 0;
                var radianMultiplier = Math.PI / 180;
                x = centerX + Math.cos((hour * 30 - 90) * radianMultiplier) * radius;
                return x;
            };
            HourPainter.prototype.getY = function (hour, radius, clockCanvasSize) {
                var centerY = (clockCanvasSize / 2);
                var y = 0;
                var radianMultiplier = Math.PI / 180;
                // var radianMultiplier = 180 / Math.PI;
                y = centerY + Math.sin((hour * 30 - 90) * radianMultiplier) * radius;
                return y;
            };
            return HourPainter;
        })();
        ToneClock.HourPainter = HourPainter;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=hourpainter.js.map