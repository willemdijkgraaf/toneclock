/**
 * Created by wimdijkgraaf on 09-06-14.
 */
/// <reference path="./Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports", "./objectid"], function (require, exports, objectid) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var CanvasViewController = (function () {
            function CanvasViewController(aSheet, aHarmony, aHarmonyPainter, aClockPainter, aCanvas, aHour, aHourPainter, subscriber) {
                this.sNAME = "Tone Clock";
                this.sVERSION = "1.2";
                this.myDefaultColor = "#000000";
                this.myCanvas = aCanvas;
                this.mySheet = aSheet;
                this.myHarmony = aHarmony;
                this.myHarmonyPainter = aHarmonyPainter;
                this.myClockPainter = aClockPainter;
                this.myHour = aHour;
                this.myHourPainter = aHourPainter;
                // register event handlers
                this.myCanvas.addEventListener("OnHourRightClick", $.proxy(this.OnHourRightClick, this));
                this.myCanvas.addEventListener("OnHourClick", $.proxy(this.OnHourLeftClick, this));
                this.myCanvas.addEventListener("OnHarmonyDragDrop", $.proxy(this.OnHarmonyDragDrop, this));
                this.myCanvas.addEventListener("OnHarmonyRightClick", $.proxy(this.OnHarmonyRightClick, this));
                // register subscriber
                this.mySubscriber = subscriber;
            }
            // AppInsights function call
            CanvasViewController.prototype.logEvent = function (event) {
                var appIns = window["appInsights"];
                appIns["logEvent"].call(event);
            };
            CanvasViewController.prototype.draw = function () {
                // Delete all elements on current canvas
                this.myCanvas.clear(); // make "old" canvas blank
                // recalculate the size of each clock canvas based on the current property settings at sheet level
                this.setClockCanvasSize(this.mySheet.calculateClockCanvasSize(this.getClockSize() / 2));
                // set the canvas size of the current sheet
                this.setCanvasWidth(this.getClocksHorizontal() * this.getClockCanvasSize());
                this.setCanvasHeight(this.getClocksVertical() * this.getClockCanvasSize());
                this.myCanvas.setSize(this.getCanvasWidth(), this.getCanvasHeight());
                // set the area size of the canvas to be cached
                this.myCanvas.setCacheArea(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
                // in case this sheet has more clocks than the previous sheet, make sure that the array of clocks has all the elements necessary
                this.mySheet.resize(this.getClocksHorizontal(), this.getClocksVertical());
                var aPCSPrefs = this.mySheet.getPitchClassSetPreferences();
                var aNNPrefs = this.mySheet.getNoteNamePreferences();
                var clockSize = this.getClockSize();
                var hourSize = this.getHourSize();
                this.drawClocks(this.getSheetTransposition(), clockSize, hourSize, aPCSPrefs, aNNPrefs, this.getClockCanvasSize());
                this.updateCacheAndCanvas();
            };
            CanvasViewController.prototype.drawClocks = function (sheetTransposition, clockSize, hourSize, aPCSPrefs, aNNPrefs, clockCanvasSize) {
                // to display the clock ids, start counting from 0
                var clockId = 0;
                var aJSONSheet = this.getSheet();
                var aClock;
                for (var i = 0; i < aJSONSheet.toneclocks.length; i++) {
                    aClock = aJSONSheet.toneclocks[i];
                    aClock.id = clockId;
                    clockId += 1;
                    this.drawClock(aClock, sheetTransposition, clockSize, hourSize, aPCSPrefs, aNNPrefs, clockCanvasSize);
                }
            };
            CanvasViewController.prototype.drawClock = function (aClock, sheetTransposition, clockSize, hourSize, aPCSPrefs, aNNPrefs, clockCanvasSize) {
                this.myHourPainter.drawNoteNames(aClock, clockSize, clockCanvasSize, aNNPrefs); // and initializes the note numbers associated with every hour
                this.myHourPainter.drawHarmonicFunctions(aClock, clockSize, hourSize, clockCanvasSize, sheetTransposition, aNNPrefs);
                this.myHourPainter.drawHours(aClock, clockSize, hourSize, clockCanvasSize); // and initializes the x,y coordinates associated with every hour
                this.myHarmonyPainter.drawAll(aClock, sheetTransposition); // including clockId
                this.myClockPainter.drawId(aClock, clockCanvasSize, aNNPrefs);
                this.myHourPainter.drawRoot(aClock, sheetTransposition, hourSize);
                this.myClockPainter.drawNames(aClock, aNNPrefs, aPCSPrefs, clockCanvasSize); // and all pitch class set names
            };
            CanvasViewController.prototype.addHarmony = function () {
                var objectId = this.myOnHarmonyRightClickObjectId;
                var aClocks = this.mySheet.getData().toneclocks;
                var harmonyId = this.myHarmony.createUniqueObjectId(objectId, aClocks);
                var sColor = this.myDefaultColor;
                var bFill = true;
                var aMidiNotes = [0, 4, 8];
                var clockIndex = objectId.getId1();
                var aClock = this.mySheet.getJSONClock(clockIndex);
                this.myHarmony.add(aClock, harmonyId, sColor, bFill, aMidiNotes);
                this.redraw(aClock);
            };
            CanvasViewController.prototype.removeHarmony = function () {
                var objectId = this.myOnHarmonyRightClickObjectId;
                var aClock = this.mySheet.getData().toneclocks[objectId.getId1()];
                this.myHarmony.remove(aClock, objectId);
                this.updateCacheAndCanvas();
            };
            CanvasViewController.prototype.moveHarmony = function (objectId, direction) {
                var aJSONSheet = this.mySheet.getData();
                var aClock = aJSONSheet.toneclocks[objectId.getId1()];
                this.myHarmony.move(aClock, objectId, direction);
                this.myHarmonyPainter.drawAll(aClock, aJSONSheet.sheetTransposition);
            };
            CanvasViewController.prototype.moveHarmonyToFront = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;
                this.moveHarmony(harmonyId, 1 /* TO_FRONT */);
                this.updateCacheAndCanvas();
            };
            CanvasViewController.prototype.moveHarmonyToBack = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;
                this.moveHarmony(harmonyId, 4 /* TO_BACK */);
                this.updateCacheAndCanvas();
            };
            CanvasViewController.prototype.moveHarmonyBackward = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;
                this.moveHarmony(harmonyId, 3 /* BACKWARD */);
                this.updateCacheAndCanvas();
            };
            CanvasViewController.prototype.moveHarmonyForward = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;
                this.moveHarmony(harmonyId, 2 /* FORWARD */);
                this.updateCacheAndCanvas();
            };
            CanvasViewController.prototype.toggleRoot = function () {
                var objectId = this.myOnHourRightClickObjectId;
                var clockIndex = objectId.getId1();
                var aJSONSheet = this.mySheet.getData();
                var aJSONClock = this.mySheet.getJSONClock(clockIndex);
                var clockCanvasSize = aJSONSheet.clockcanvassize;
                var aNNPrefs = this.mySheet.getNoteNamePreferences();
                var sheetTransposition = aJSONSheet.sheetTransposition;
                var clockSize = aJSONSheet.clocksize;
                var hourSize = aJSONSheet.hoursize;
                this.myHourPainter.toggleRoot(objectId, aJSONClock, clockCanvasSize, aNNPrefs, sheetTransposition, clockSize, hourSize);
                this.redraw(aJSONClock);
            };
            CanvasViewController.prototype.OnHarmonyRightClick = function (id, x, y) {
                // store the objectId for later usage
                var objectId = new objectid.ToneClock.ObjectId(id);
                this.myOnHarmonyRightClickObjectId = objectId;
                // get the toneclock
                var aClock = this.mySheet.getJSONClock(objectId.getId1());
                // get the color
                var color = this.myHarmony.getColor(objectId, aClock);
                // get the pitch class set names
                var pcsNames = this.myHarmony.getPitchClassSetNames(aClock, objectId);
                // call subscriber to handle event
                this.mySubscriber.OnHarmonyContextShow(x, y, color, pcsNames);
                return false;
            };
            CanvasViewController.prototype.OnHarmonyColorChange = function (color) {
                var objectId = this.myOnHarmonyRightClickObjectId;
                var clockId = objectId.getId1();
                var harmonyId = new objectid.ToneClock.ObjectId(clockId, objectId.getId2(), 4 /* HARMONY */); // was -24
                var aClock = this.mySheet.getJSONClock(clockId);
                this.myHarmony.setColor(harmonyId, aClock, color);
                // this.myClockPainter.redrawIncludingHarmonies(aClock, sheetTransposition, clockCanvasSize, aNNPrefs, aPCSPrefs, clockSize, hourSize);
                this.redraw(aClock);
            };
            CanvasViewController.prototype.setDefaultColor = function (color) {
                this.myDefaultColor = color;
            };
            CanvasViewController.prototype.OnHourRightClick = function (id, x, y) {
                // store the objectId for later usage
                var objectId = new objectid.ToneClock.ObjectId(id);
                this.myOnHourRightClickObjectId = objectId;
                // call subscriber to handle event
                this.mySubscriber.OnHourContextShow(x, y);
                return false;
            };
            CanvasViewController.prototype.OnHourContextMenuClick = function (invokedOn, selectedMenu) {
                switch (selectedMenu.id) {
                    case "toggleRoot":
                        this.toggleRoot(); // this.toggleRoot(this.myOnHourRightClickObjectId);
                        break;
                }
            };
            CanvasViewController.prototype.OnHourLeftClick = function (id) {
                var objectId = new objectid.ToneClock.ObjectId(id);
                var clockIndex = objectId.getId1();
                var aClock = this.mySheet.getJSONClock(clockIndex);
                this.toggleHour(objectId, aClock);
            };
            CanvasViewController.prototype.toggleHour = function (objectId, aClock) {
                var aNNPrefs = this.mySheet.getNoteNamePreferences();
                var hourIndex = objectId.getId2() - 1;
                var isNotANewHarmonicStructure = true;
                var aHarmony;
                // get MidiNoteNumber of this hour
                var midiNoteNumber = this.myHour.toMidiNoteNumber(hourIndex + 1, aNNPrefs);
                // if this clock has no harmonies, add one basic harmony
                if (aClock.harmonies.length == 0) {
                    aHarmony = this.myHarmony.addStructureForOneMidiNoteNumber(aClock, midiNoteNumber);
                    isNotANewHarmonicStructure = false;
                }
                else {
                    // get harmony of this clock
                    aHarmony = aClock.harmonies[aClock.harmonies.length - 1];
                }
                // set the color to the default color
                aHarmony.color = this.myDefaultColor;
                this.myHarmony.toggleHour(aHarmony, midiNoteNumber, isNotANewHarmonicStructure);
                // Add the pitch set names to this harmony
                this.myHarmony.addPitchClassSetNames(aHarmony);
                this.redraw(aClock);
            };
            CanvasViewController.prototype.OnHarmonyDragDrop = function (id, steps, x) {
                var objectId = new objectid.ToneClock.ObjectId(id);
                // only transpose in small steps
                if (Math.abs(steps) < 4) {
                    var clockIndex = objectId.getId1();
                    var aClock = this.mySheet.getJSONClock(clockIndex);
                    // if the drag&drop x is higher than the middle of the clock, than the transposition should be reversed
                    var middleX = aClock.xpos + this.mySheet.getClockCanvasSize() / 2;
                    if (x < middleX) {
                        steps = steps * -1;
                    }
                    var aNNPrefs = this.mySheet.getNoteNamePreferences();
                    this.myHarmony.transpose(aClock, objectId, steps, aNNPrefs);
                    // redraw the transposed harmony
                    this.redraw(aClock);
                }
            };
            CanvasViewController.prototype.updateCacheAndCanvas = function () {
                this.myCanvas.updateCacheAndCanvas();
                // to improve testability
                var e = document.getElementById("toneClockArea");
                e.setAttribute("style", "visibility: visible");
            };
            CanvasViewController.prototype.redraw = function (aClock) {
                var aJSONSheet = this.mySheet.getData();
                var clockCanvasSize = aJSONSheet.clockcanvassize;
                var aNNPrefs = this.mySheet.getNoteNamePreferences();
                var aPCSPrefs = this.mySheet.getPitchClassSetPreferences();
                var sheetTransposition = aJSONSheet.sheetTransposition;
                var clockSize = aJSONSheet.clocksize;
                var hourSize = aJSONSheet.hoursize;
                this.drawClock(aClock, sheetTransposition, clockSize, hourSize, aPCSPrefs, aNNPrefs, clockCanvasSize);
                this.updateCacheAndCanvas();
            };
            CanvasViewController.prototype.setClockProperties = function (toneClockId, sToneClockName, bDisplayRoot, iRootNoteNumber) {
                var aClock = this.mySheet.getJSONClock(toneClockId);
                if (typeof (aClock) !== "undefined") {
                    aClock.id = toneClockId;
                    aClock.name = sToneClockName;
                    aClock.displayRoot = bDisplayRoot;
                    aClock.rootNoteNumber = iRootNoteNumber;
                }
            };
            CanvasViewController.prototype.removeHarmoniesFromSheet = function () {
                this.mySheet.removeHarmoniesFromSheet(this.myHarmony);
            };
            CanvasViewController.prototype.getSheetTitle = function () {
                return this.mySheet.getSheetTitle();
            };
            CanvasViewController.prototype.setSheetTitle = function (sTitle) {
                this.mySheet.setSheetTitle(sTitle);
            };
            CanvasViewController.prototype.getSheetTransposition = function () {
                return this.mySheet.getSheetTransposition();
            };
            CanvasViewController.prototype.setSheetTransposition = function (iTransposition) {
                this.mySheet.setSheetTransposition(iTransposition); // positive and negative -5 ... 5
            };
            CanvasViewController.prototype.getClocksHorizontal = function () {
                return this.mySheet.getClocksHorizontal();
            };
            CanvasViewController.prototype.setHourSize = function (size) {
                this.mySheet.setHourSize(size);
            };
            CanvasViewController.prototype.getHourSize = function () {
                return this.mySheet.getHourSize();
            };
            CanvasViewController.prototype.getClockSize = function () {
                return this.mySheet.getClockSize();
            };
            CanvasViewController.prototype.setClockSize = function (size) {
                this.mySheet.setClockSize(size);
            };
            CanvasViewController.prototype.setClocksHorizontal = function (amount) {
                this.mySheet.setClocksHorizontal(amount);
            };
            CanvasViewController.prototype.getClocksVertical = function () {
                return this.mySheet.getClocksVertical();
            };
            CanvasViewController.prototype.setClocksVertical = function (amount) {
                this.mySheet.setClocksVertical(amount);
            };
            CanvasViewController.prototype.getNoteNameStyle = function () {
                return this.mySheet.getNoteNameStyle();
            };
            CanvasViewController.prototype.setNoteNameInterval = function (intervalId) {
                // style id"s can be 0 = 4ths, 1 = 2nds
                this.mySheet.setNoteNameInterval(intervalId);
            };
            CanvasViewController.prototype.getNoteNameAs = function () {
                return this.mySheet.getNoteNameAs();
            };
            CanvasViewController.prototype.setNoteNameAs = function (iNameClass) {
                this.mySheet.setNoteNameAs(iNameClass);
            };
            CanvasViewController.prototype.getNoteNameFontSize = function () {
                return this.mySheet.getNoteNameFontSize();
            };
            CanvasViewController.prototype.setNoteNameFontSize = function (pixels) {
                this.mySheet.setNoteNameFontSize(pixels);
            };
            CanvasViewController.prototype.getNoteNameRotation = function () {
                return this.mySheet.getNoteNameRotation();
            };
            CanvasViewController.prototype.setNoteNameRotation = function (rotation) {
                this.mySheet.setNoteNameRotation(rotation);
            };
            CanvasViewController.prototype.getNoteNameFontName = function () {
                return this.mySheet.getNoteNameFontName();
            };
            CanvasViewController.prototype.setNoteNameFontName = function (fontName) {
                this.mySheet.setNoteNameFontName(fontName);
            };
            CanvasViewController.prototype.getNoteNameMargin = function () {
                return this.mySheet.getNoteNameMargin();
            };
            CanvasViewController.prototype.setNoteNameDirection = function (bClockwise) {
                this.mySheet.setNoteNameDirection(bClockwise);
            };
            CanvasViewController.prototype.getNoteNameDirection = function () {
                return this.mySheet.getNoteNameDirection();
            };
            CanvasViewController.prototype.setNoteNameFlat = function (bFlat) {
                this.mySheet.setNoteNameFlat(bFlat);
            };
            CanvasViewController.prototype.getNoteNameFlat = function () {
                return this.mySheet.getNoteNameFlat();
            };
            CanvasViewController.prototype.setNoteNameMargin = function (pixels) {
                this.mySheet.setNoteNameMargin(pixels);
            };
            CanvasViewController.prototype.getClockCanvasSize = function () {
                return this.mySheet.getClockCanvasSize();
            };
            CanvasViewController.prototype.setClockCanvasSize = function (pixels) {
                this.mySheet.setClockCanvasSize(pixels);
            };
            CanvasViewController.prototype.setDisplayPrimeForm = function (bDisplay) {
                var curPrefs = this.mySheet.getPitchClassSetPreferences();
                var newPrefs = {
                    "displayPrimeForm": bDisplay,
                    "displayForteCode": curPrefs.displayForteCode,
                    "displayIntervalVector": curPrefs.displayIntervalVector,
                    "displayPrimeInversion": curPrefs.displayPrimeInversion
                };
                this.mySheet.setPitchClassSetPreferences(newPrefs);
            };
            CanvasViewController.prototype.getDisplayPrimeForm = function () {
                return this.mySheet.getPitchClassSetPreferences().displayPrimeForm;
            };
            CanvasViewController.prototype.setDisplayForteCode = function (bDisplay) {
                var curPrefs = this.mySheet.getPitchClassSetPreferences();
                var newPrefs = {
                    "displayPrimeForm": curPrefs.displayPrimeForm,
                    "displayForteCode": bDisplay,
                    "displayIntervalVector": curPrefs.displayIntervalVector,
                    "displayPrimeInversion": curPrefs.displayPrimeInversion
                };
                this.mySheet.setPitchClassSetPreferences(newPrefs);
            };
            CanvasViewController.prototype.getDisplayForteCode = function () {
                return this.mySheet.getPitchClassSetPreferences().displayForteCode;
            };
            CanvasViewController.prototype.setDisplayIntervalVector = function (bDisplay) {
                var curPrefs = this.mySheet.getPitchClassSetPreferences();
                var newPrefs = {
                    "displayPrimeForm": curPrefs.displayPrimeForm,
                    "displayForteCode": curPrefs.displayForteCode,
                    "displayIntervalVector": bDisplay,
                    "displayPrimeInversion": curPrefs.displayPrimeInversion
                };
                this.mySheet.setPitchClassSetPreferences(newPrefs);
            };
            CanvasViewController.prototype.getDisplayIntervalVector = function () {
                return this.mySheet.getPitchClassSetPreferences().displayIntervalVector;
            };
            CanvasViewController.prototype.setDisplayPrimeInversion = function (bDisplay) {
                var curPrefs = this.mySheet.getPitchClassSetPreferences();
                var newPrefs = {
                    "displayPrimeForm": curPrefs.displayPrimeForm,
                    "displayForteCode": curPrefs.displayForteCode,
                    "displayIntervalVector": curPrefs.displayIntervalVector,
                    "displayPrimeInversion": bDisplay
                };
                this.mySheet.setPitchClassSetPreferences(newPrefs);
            };
            CanvasViewController.prototype.getDisplayPrimeInversion = function () {
                return this.mySheet.getPitchClassSetPreferences().displayPrimeInversion;
            };
            CanvasViewController.prototype.setCanvasSize = function (horizontalClocks, verticalClocks) {
                this.mySheet.setCanvasSize(horizontalClocks, verticalClocks);
            };
            CanvasViewController.prototype.getCanvasWidth = function () {
                return this.mySheet.getCanvasWidth();
            };
            CanvasViewController.prototype.setCanvasWidth = function (width) {
                this.mySheet.setCanvasWidth(width);
            };
            CanvasViewController.prototype.getCanvasHeight = function () {
                return this.mySheet.getCanvasHeight();
            };
            CanvasViewController.prototype.setCanvasHeight = function (height) {
                this.mySheet.setCanvasHeight(height);
            };
            CanvasViewController.prototype.getSheet = function () {
                return this.mySheet.getData();
            };
            CanvasViewController.prototype.setSheet = function (aJSONSheet) {
                this.mySheet.setData(aJSONSheet);
            };
            return CanvasViewController;
        })();
        ToneClock.CanvasViewController = CanvasViewController;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=canvasviewcontroller.js.map