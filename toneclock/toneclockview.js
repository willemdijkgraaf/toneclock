define(["require", "exports", 'canvaseaseljs', 'setfinder'], function(require, exports, canvaseaseljs, setfinder) {
    (function (ToneClock) {
        var View = (function () {
            function View(parentElement) {
                this.sNAME = "Tone Clock";
                this.sVERSION = "1.2";
                this.mySheetTitle = "";
                this.mySheetTransposition = 0;
                this.myClocksHorizontal = 0;
                this.myClocksVertical = 0;
                this.myClockSize = 0;
                this.myClockCanvasSize = 0;
                this.myCanvasWidth = 0;
                this.myCanvasHeight = 0;
                this.myHourSize = 0;
                this.myClocks = [];
                this.myNoteNameStyle = 0;
                this.myNoteNameFlat = false;
                this.myNoteNameAs = 0;
                this.myNoteNameDirection = false;
                this.myNoteNameMargin = 0;
                this.myNoteNameFontSize = 0;
                this.myNoteNameRotation = 0;
                this.myNoteNameFontName = "";
                this.myToneClockId = 0;
                this.myDisplayPrimeForm = false;
                this.myDisplayForteCode = false;
                this.myDisplayIntervalVector = false;
                this.myDisplayPrimeInversion = false;
                this.arrNoteNames = [
                    ["D", "G", "C", "F", "B♭", "E♭", "A♭", "D♭", "G♭", "B", "E", "A"],
                    ["D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B", "C", "D♭"],
                    ["D", "G", "C", "F", "A♯", "D♯", "G♯", "C♯", "F♯", "B", "E", "A"],
                    ["D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B", "C", "C♯"],
                    ["2", "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9"],
                    ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "0", "1"],
                    ["2", "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9"],
                    ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "0", "1"],
                    ["D 1d", "G 3b", "C 1b/4d+/4b", "F 2d/2b+", "B♭ 3d+", "E♭ 1d+", "A♭ 3b+", "D♭ 1b+", "G♭ 2d+", "B 4d", "E 2b", "A 3d"],
                    ["D 1d", "E♭ 1d+", "E 2b", "F 2d/2b+", "G♭ 2d+", "G 3b", "A♭ 3b+", "A 3d", "B♭ 3d+", "B 4d", "C 1b/4d+/4b", "D♭ 1b+"],
                    ["D 1d", "G 3b", "C 1b/4d+/4b", "F 2d/2b+", "A♯ 3d+", "D♯ 1d+", "G♯ 3b+", "C♯ 1b+", "F♯ 2d+", "B 4d", "E 2b", "A 3d"],
                    ["D 1d", "D♯ 1d+", "E 2b", "F 2d/2b+", "F♯ 2d+", "G 3b", "G♯ 3b+", "A 3d", "A♯ 3d+", "B 4d", "C 1b/4d+/4b", "C♯ 1b+"],
                    ["D 1d", "G 3b+", "C 1b/4d+", "F 2d", "B♭ 4b+", "E♭ 1d+/2b", "A♭ 3d", "D♭ 1b+", "G♭ 2d+/3b", "B 4d", "E 2b+", "A 3d+/4b"],
                    ["D 1d", "E♭ 1d+/2b", "E 2b+", "F 2d", "G♭ 2d+/3b", "G 3b+", "A♭ 3d", "A 3d+/4b", "B♭ 4b+", "B 4d", "C 1b/4d+", "D♭ 1b+"],
                    ["D 1d", "G 3b+", "C 1b/4d+", "F 2d", "A♯ 4b+", "D♯ 1d+/2b", "G♯ 3d", "C♯ 1b+", "F♯ 2d+/3b", "B 4d", "E 2b+", "A 3d+/4b"],
                    ["D 1d", "D♯ 1d+/2b", "E 2b+", "F 2d", "F♯ 2d+/3b", "G 3b+", "G♯ 3d", "A 3d+/4b", "A♯ 4b+", "B 4d", "C 1b/4d+", "C♯ 1b+"],
                    ["Re", "Sol", "Re", "Fa", "Si♭", "Mi♭", "La♭", "Re♭", "Sol♭", "Si", "Mi", "La"],
                    ["Re", "Mi♭", "Mi", "Fa", "Sol♭", "Sol", "La♭", "La", "Si♭", "Si", "Re", "Re♭"],
                    ["Re", "Sol", "Do", "Fa", "La♯", "Re♯", "Sol♯", "Do♯", "Fa♯", "Si", "Mi", "La"],
                    ["Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si", "Do", "Do♯"]
                ];
                this.arrMidiNoteNumbers = [
                    [2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9],
                    [2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7],
                    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
                    [2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3]
                ];
                this.myCanvas = new canvaseaseljs.ToneClock.CanvasEaselJS(parentElement);

                this.myCanvas.addEventListener("OnHourRightClick", $.proxy(this.OnHourRightClick, this));
                this.myCanvas.addEventListener("OnHourClick", $.proxy(this.OnHourLeftClick, this));
                this.myCanvas.addEventListener("OnHourDragDrop", $.proxy(this.OnHourDrag, this));

                this.myCanvas.addEventListener("OnHarmonyDragDrop", $.proxy(this.OnHarmonyDragDrop, this));
                this.myCanvas.addEventListener("OnHarmonyRightClick", $.proxy(this.OnHarmonyRightClick, this));

                $("#toggleRoot").on('click', $.proxy(this.toggleRoot, this));
            }
            View.prototype.getSheetTitle = function () {
                return this.mySheetTitle;
            };

            View.prototype.setSheetTitle = function (sTitle) {
                this.mySheetTitle = sTitle;
            };

            View.prototype.getSheetTransposition = function () {
                return this.mySheetTransposition;
            };

            View.prototype.setSheetTransposition = function (iTransposition) {
                this.mySheetTransposition = iTransposition % 7;
            };

            View.prototype.getClocksHorizontal = function () {
                return this.myClocksHorizontal;
            };

            View.prototype.setClocksHorizontal = function (amount) {
                this.myClocksHorizontal = amount;
            };

            View.prototype.getClocksVertical = function () {
                return this.myClocksVertical;
            };

            View.prototype.setClocksVertical = function (amount) {
                this.myClocksVertical = amount;
            };

            View.prototype.getNoteNameStyle = function () {
                return this.myNoteNameStyle;
            };

            View.prototype.setNoteNameStyle = function (styleId) {
                this.myNoteNameStyle = styleId;
            };

            View.prototype.getNoteNameAs = function () {
                return this.myNoteNameAs;
            };

            View.prototype.setNoteNameAs = function (iNameClass) {
                this.myNoteNameAs = iNameClass;
            };

            View.prototype.getNoteNameFontSize = function () {
                return this.myNoteNameFontSize;
            };

            View.prototype.setNoteNameFontSize = function (pixels) {
                this.myNoteNameFontSize = pixels;
            };

            View.prototype.getNoteNameRotation = function () {
                return this.myNoteNameRotation;
            };

            View.prototype.setNoteNameRotation = function (rotation) {
                this.myNoteNameRotation = rotation;
            };

            View.prototype.getNoteNameFontName = function () {
                return this.myNoteNameFontName;
            };

            View.prototype.setNoteNameFontName = function (fontName) {
                this.myNoteNameFontName = fontName;
            };

            View.prototype.getNoteNameMargin = function () {
                return this.myNoteNameMargin;
            };

            View.prototype.setNoteNameDirection = function (bClockwise) {
                this.myNoteNameDirection = bClockwise;
            };

            View.prototype.getNoteNameDirection = function () {
                return this.myNoteNameDirection;
            };

            View.prototype.setNoteNameFlat = function (bFlat) {
                this.myNoteNameFlat = bFlat;
            };

            View.prototype.getNoteNameFlat = function () {
                return this.myNoteNameFlat;
            };

            View.prototype.setNoteNameMargin = function (pixels) {
                this.myNoteNameMargin = pixels;
            };

            View.prototype.getClockCanvasSize = function () {
                return this.myClockCanvasSize;
            };

            View.prototype.setClockCanvasSize = function (pixels) {
                this.myClockCanvasSize = pixels;
            };

            View.prototype.setDisplayPrimeForm = function (bDisplay) {
                this.myDisplayPrimeForm = bDisplay;
            };

            View.prototype.getDisplayPrimeForm = function () {
                return this.myDisplayPrimeForm;
            };

            View.prototype.setDisplayForteCode = function (bDisplay) {
                this.myDisplayForteCode = bDisplay;
            };

            View.prototype.getDisplayForteCode = function () {
                return this.myDisplayForteCode;
            };

            View.prototype.setDisplayIntervalVector = function (bDisplay) {
                this.myDisplayIntervalVector = bDisplay;
            };

            View.prototype.getDisplayIntervalVector = function () {
                return this.myDisplayIntervalVector;
            };

            View.prototype.setDisplayPrimeInversion = function (bDisplay) {
                this.myDisplayPrimeInversion = bDisplay;
            };

            View.prototype.getDisplayPrimeInversion = function () {
                return this.myDisplayPrimeInversion;
            };

            View.prototype.setCanvasSize = function (horizontalClocks, verticalClocks) {
                this.setClocksHorizontal(horizontalClocks);
                this.setClocksVertical(verticalClocks);
                this.deleteClocksOutsideOfSheet();
            };

            View.prototype.deleteClocksOutsideOfSheet = function () {
                var clocksNeeded;

                clocksNeeded = this.getClocksHorizontal() * this.getClocksVertical();

                while (this.myClocks.length > clocksNeeded) {
                    this.myClocks.pop();
                    console.log("clock removed");
                }
            };

            View.prototype.complementArrayOfClocks = function () {
                var i = 0;

                for (var y = 0; y < this.getClocksVertical(); y++) {
                    for (var x = 0; x < this.getClocksHorizontal(); x++) {
                        if (typeof (this.myClocks[i]) === "undefined") {
                            this.myClocks[i] = {
                                "id": 0,
                                "name": 0,
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
                            };
                        }
                        this.myClocks[i].xpos = x * this.getClockCanvasSize();
                        this.myClocks[i].ypos = y * this.getClockCanvasSize();
                        i++;
                    }
                }
            };

            View.prototype.drawSheet = function () {
                this.myCanvas.clearCanvas();

                this.setClockCanvasSize(this.calculateClockCanvasSize(this.getClockSize() / 2));

                this.setCanvasWidth(this.getClocksHorizontal() * this.getClockCanvasSize());
                this.setCanvasHeight(this.getClocksVertical() * this.getClockCanvasSize());
                this.myCanvas.setSize(this.getCanvasWidth(), this.getCanvasHeight());

                this.myCanvas.SetCanvasCacheArea(0, 0, this.getCanvasWidth(), this.getCanvasHeight());

                this.complementArrayOfClocks();

                this.drawClocks();
                this.drawSheetTitle();

                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.drawClocks = function () {
                this.myToneClockId = 0;

                var aClock;
                for (var i = 0; i < this.myClocks.length; i++) {
                    aClock = this.myClocks[i];
                    this.setClockId(aClock);
                    this.drawClock(aClock);
                }
            };

            View.prototype.getCanvasWidth = function () {
                return this.myCanvasWidth;
            };

            View.prototype.setCanvasWidth = function (width) {
                this.myCanvasWidth = width;
            };

            View.prototype.getCanvasHeight = function () {
                return this.myCanvasHeight;
            };

            View.prototype.setCanvasHeight = function (height) {
                this.myCanvasHeight = height;
            };

            View.prototype.getClockSize = function () {
                return this.myClockSize;
            };

            View.prototype.setClockSize = function (pixels) {
                this.myClockSize = pixels;
            };

            View.prototype.setHourSize = function (pixels) {
                this.myHourSize = pixels;
            };

            View.prototype.getHourSize = function () {
                return (this.myHourSize);
            };

            View.prototype.OnHarmonyRightClick = function (objectId, x, y) {
                $("#harmonyContextMenu").css({
                    left: x,
                    top: y,
                    position: "absolute",
                    'z-index': 1000,
                    display: "block",
                    'list-style': "none",
                    visibility: "visible",
                    opacity: 1
                });

                return false;
            };

            View.prototype.OnHourRightClick = function (objectId, x, y) {
                this.myOnHourRightClickObjectId = objectId;

                $("#hourContextMenu").css({
                    left: x,
                    top: y,
                    position: "absolute",
                    'z-index': 1000,
                    display: "block",
                    'list-style': "none",
                    visibility: "visible",
                    opacity: 1
                });

                return false;
            };

            View.prototype.OnHourContextMenuClick = function (invokedOn, selectedMenu) {
                switch (selectedMenu.id) {
                    case "toggleRoot":
                        this.toggleRoot();
                        break;
                }
            };

            View.prototype.toggleRoot = function () {
                var aObjectId = this.ObjectIdToArray(this.myOnHourRightClickObjectId);

                var clockIndex = aObjectId[0];
                var hour = aObjectId[1];
                console.log("hour: " + hour);

                var theClock = this.myClocks[clockIndex];
                var aHarmony = theClock.harmonies[0];

                var newRootNoteNumber = this.hourToMidiNoteNumber(hour);
                console.log("newRootNoteNumber: " + newRootNoteNumber);

                var oldRootNoteNumber = this.myClocks[clockIndex].rootNoteNumber % 12;
                console.log("oldRootNoteNumber: " + oldRootNoteNumber);

                this.drawHour(theClock, this.midiNoteNumberToHourIndex(theClock, oldRootNoteNumber) + 1);

                if (theClock.displayRoot) {
                    if (newRootNoteNumber != oldRootNoteNumber) {
                        theClock.rootNoteNumber = newRootNoteNumber;
                        this.drawRoot(theClock);
                    } else {
                        theClock.displayRoot = false;
                    }
                } else {
                    theClock.rootNoteNumber = newRootNoteNumber;
                    theClock.displayRoot = true;
                    this.drawRoot(theClock);
                }

                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.OnHourLeftClick = function (objectId) {
                this.toggleHour(objectId);
            };

            View.prototype.toggleHour = function (objectId) {
                var aObjectId = this.ObjectIdToArray(objectId);
                var clockIndex = aObjectId[0];
                var hourIndex = aObjectId[1] - 1;
                var isNotANewHarmonicStructure = true;
                var aHarmony;

                var theClock = this.myClocks[clockIndex];

                if (theClock.harmonies.length == 0) {
                    aHarmony = this.CreateHarmonicStructure(clockIndex, hourIndex);
                    isNotANewHarmonicStructure = false;
                } else {
                    aHarmony = theClock.harmonies[0];
                }

                this.ToggleHourOfHarmony.call(this, aHarmony, hourIndex, isNotANewHarmonicStructure);

                this.addPitchSetNamesToHarmony(aHarmony, aHarmony.midiNotes);

                this.RedrawToneClocksHarmony(theClock, aHarmony, aHarmony.id + 24);

                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.OnHourDrag = function (objectId, x, y) {
            };

            View.prototype.calculateClockCanvasSize = function (clockRadius) {
                var clockCanvasSize = 0;

                clockCanvasSize = clockRadius * 2;

                clockCanvasSize += this.getNoteNameMargin() * 2;

                clockCanvasSize += 30 * 2;

                var fontSize = this.getNoteNameFontSize();

                var numberOfLines = 1;
                if (this.getDisplayForteCode()) {
                    numberOfLines += 1;
                }
                if (this.getDisplayIntervalVector()) {
                    numberOfLines += 1;
                }
                if (this.getDisplayPrimeForm()) {
                    numberOfLines += 1;
                }
                if (this.getDisplayPrimeInversion()) {
                    numberOfLines += 1;
                }

                clockCanvasSize += (numberOfLines * fontSize) * 2;

                return clockCanvasSize;
            };

            View.prototype.OnHarmonyDragDrop = function (objectId, steps, x) {
                if (Math.abs(steps) < 4) {
                    var aObjectId = this.ObjectIdToArray(objectId);
                    var clockIndex = aObjectId[0];
                    var harmonyId = aObjectId[1];

                    var theClock = this.myClocks[clockIndex];
                    var theHarmony = theClock.harmonies[harmonyId - 24];

                    var middleX = theClock.xpos + this.getClockCanvasSize() / 2;
                    if (x < middleX) {
                        steps = steps * -1;
                    }

                    this.transposeHarmony(theClock, theHarmony, steps);

                    this.RedrawToneClocksHarmony(theClock, theHarmony, harmonyId);

                    this.myCanvas.updateCacheAndCanvas();
                }
            };

            View.prototype.RedrawToneClocksHarmony = function (theClock, aHarmony, harmonyId) {
                this.drawHarmony(theClock, aHarmony, harmonyId);
                this.drawClockId(theClock);
                this.drawHours(theClock);
                this.drawRoot(theClock);
                this.drawClockName(theClock);
            };

            View.prototype.ToggleHourOfHarmony = function (aHarmony, hourIndex, isNotANewHarmonicStructure) {
                var aPitchClasses = this._convertMidiNoteNumbersToPitchClasses(aHarmony.midiNotes);

                var midiNoteNumber = this.hourToMidiNoteNumber(hourIndex + 1);
                var pitchClassNumber = midiNoteNumber % 12;

                var index = aPitchClasses.indexOf(pitchClassNumber);

                if (index != -1) {
                    if (isNotANewHarmonicStructure) {
                        index = aHarmony.midiNotes.indexOf(midiNoteNumber);
                        aHarmony.midiNotes.splice(index, 1);
                    }
                } else {
                    if (isNotANewHarmonicStructure) {
                    }
                    aHarmony.midiNotes.push(pitchClassNumber);
                }
            };

            View.prototype._convertMidiNoteNumbersToPitchClasses = function (aMidiNotes) {
                var pitchClassArray = new Array(aMidiNotes.length);
                var i = 0;

                for (i = 0; i < aMidiNotes.length; i++) {
                    pitchClassArray[i] = aMidiNotes[i] % 12;
                }

                return pitchClassArray;
            };

            View.prototype.CreateHarmonicStructure = function (clockIndex, hourIndex) {
                var aMidiNotes = new Array(1);

                var midiNoteNumber = this.hourToMidiNoteNumber(hourIndex + 1);

                aMidiNotes[0] = midiNoteNumber;

                var aHarmony = this.addHarmony(clockIndex, 0, "#000000", true, aMidiNotes);

                return aHarmony;
            };

            View.prototype.drawClock = function (aClock) {
                this.drawNoteNames(aClock);
                this.drawHours(aClock);
                this.drawHarmonies(aClock);
                this.drawRoot(aClock);
                this.drawClockName(aClock);
            };

            View.prototype.drawHours = function (aClock) {
                for (var i = 12; i >= 1; i--) {
                    this.drawHour(aClock, i);
                }
            };

            View.prototype.drawHour = function (aClock, hour) {
                var x = 0;
                var y = 0;
                var radius = 0;

                radius = this.getClockSize() / 2;
                x = aClock.xpos + this.hourToX(hour, radius);
                y = aClock.ypos + this.hourToY(hour, radius);

                aClock.hours[hour - 1].xpos = x;
                aClock.hours[hour - 1].ypos = y;

                radius = this.getHourSize() / 2;

                var objectId;
                objectId = this.createObjectId(aClock.id, hour);

                this.myCanvas.drawCircle(x, y, radius, "#000000", false, objectId);
            };

            View.prototype.createObjectId = function (Id1, Id2) {
                var id;

                id = "[" + Id1 + "," + Id2 + "]";
                return id;
            };

            View.prototype.ObjectIdToArray = function (objectId) {
                var aId = JSON.parse(objectId);
                return aId;
            };

            View.prototype.getNamingSystemIndex = function () {
                var iNoteNameIndex = 0;

                if (this.getNoteNameFlat() === false) {
                    iNoteNameIndex = 2;
                }

                iNoteNameIndex += this.getNoteNameStyle();

                var noteNameAs = this.getNoteNameAs();
                iNoteNameIndex = iNoteNameIndex + noteNameAs * 4;

                return iNoteNameIndex;
            };

            View.prototype.hourToNoteName = function (hour) {
                var styleId = this.getNamingSystemIndex();
                var noteName = "";
                var noteIndex = this.getNoteNameIndex(hour);

                noteName = this.arrNoteNames[styleId][noteIndex];
                return noteName;
            };

            View.prototype.hourToMidiNoteNumber = function (hour) {
                var noteNumber = 0;
                var styleId = this.getNoteNameStyle();
                var noteIndex = this.getNoteNameIndex(hour);

                noteNumber = this.arrMidiNoteNumbers[styleId][noteIndex];
                return noteNumber;
            };

            View.prototype.getNoteNameIndex = function (hour) {
                var middleOfArray = 12;
                var noteId = 0;
                var hourIndex = hour - 1;

                var rotation = this.getNoteNameRotation();
                rotation = rotation * -1;
                if (rotation > 0) {
                    rotation = rotation - 12;
                }

                if (this.getNoteNameDirection() === true) {
                    noteId = middleOfArray + hourIndex;
                } else {
                    noteId = middleOfArray - hourIndex;
                }

                noteId = noteId + rotation;

                if (noteId < 0) {
                    noteId += 24;
                }

                noteId = noteId % 12;

                return noteId;
            };

            View.prototype.drawNoteNames = function (aClock) {
                var iNoteNameIndex = this.getNamingSystemIndex();

                for (var hour = 12; hour >= 1; hour--) {
                    this.initializeMidiNoteNumberOfHour(aClock, hour);
                    this.drawNoteName(aClock, hour);
                }
            };

            View.prototype.drawNoteName = function (aClock, hour) {
                var x = 0;
                var y = 0;
                var radius = 0;
                var noteName = "";

                var iNoteNameIndex = this.getNamingSystemIndex();

                var horizontalAlign = "";
                var verticalAlign = "";

                radius = this.getClockSize() / 2 + this.getNoteNameMargin();
                x = aClock.xpos + this.hourToX(hour, radius);
                y = aClock.ypos + this.hourToY(hour, radius);

                noteName = this.hourToNoteName(hour);

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

                this.myCanvas.writeNoteName(x, y, noteName, this.getNoteNameFontName(), this.getNoteNameFontSize(), horizontalAlign, verticalAlign, "#000000");
            };

            View.prototype.initializeMidiNoteNumberOfHour = function (aClock, hour) {
                var midiNoteNumber = this.hourToMidiNoteNumber(hour);
                aClock.hours[hour - 1].midiNoteNumber = midiNoteNumber;
            };

            View.prototype.addHarmony = function (toneClockId, harmonyId, sColor, bFill, aMidiNotes) {
                var harmony = { "id": 0, "color": "#ff0000", "fill": false, "midiNotes": [], "primeForm": "", "forteCode": "", "intervalVector": "", "primeInversion": "" };
                harmony.id = harmonyId;
                harmony.color = sColor;
                harmony.fill = bFill;
                harmony.midiNotes = aMidiNotes;

                this.addPitchSetNamesToHarmony(harmony, aMidiNotes);
                var index = this.myClocks[toneClockId].harmonies.push(harmony);

                return this.myClocks[toneClockId].harmonies[index - 1];
            };

            View.prototype.addPitchSetNamesToHarmony = function (harmony, aMidiNotes) {
                var oSetFinder = new setfinder.ToneClock.SetFinder();
                oSetFinder.Initialize();
                oSetFinder.FindSet(this.convertMidiNotesToPitchClassArray(aMidiNotes));

                harmony.intervalVector = oSetFinder.pcIVec;
                harmony.primeForm = oSetFinder.pcForte;
                harmony.forteCode = oSetFinder.pcInv;
                harmony.primeInversion = oSetFinder.pcPrime;
            };

            View.prototype.convertMidiNotesToPitchClassArray = function (aMidiNotes) {
                var pitchClassArray = new Array(12);
                var i = 0;

                for (i = 0; i < 12; i++) {
                    pitchClassArray[i] = false;
                }

                for (i = 0; i < aMidiNotes.length; i++) {
                    pitchClassArray[aMidiNotes[i] % 12] = true;
                }

                return pitchClassArray;
            };

            View.prototype.setClockProperties = function (toneClockId, sToneClockName, bDisplayRoot, iRootNoteNumber) {
                var aClock = this.myClocks[toneClockId];
                if (typeof (aClock) !== "undefined") {
                    aClock.id = toneClockId;
                    aClock.name = sToneClockName;
                    aClock.displayRoot = bDisplayRoot;
                    aClock.rootNoteNumber = iRootNoteNumber;
                }
            };

            View.prototype.removeHarmoniesFromSheet = function () {
                var i = 0;

                for (var y = 0; y < this.getClocksVertical(); y++) {
                    for (var x = 0; x < this.getClocksHorizontal(); x++) {
                        if (typeof (this.myClocks[i]) !== "undefined") {
                            this.removeHarmoniesFromClock(i);
                        }
                        i++;
                    }
                }
            };

            View.prototype.removeHarmoniesFromClock = function (toneClockId) {
                var harmonies = [];
                this.myClocks[toneClockId].harmonies = harmonies;
                this.myClocks[toneClockId].name = "";
                this.myClocks[toneClockId].displayRoot = false;
            };

            View.prototype.drawSheetTitle = function () {
                var iCanvasWidth = this.getClocksHorizontal() * this.getClockCanvasSize();
                var sSheetTitle = this.getSheetTitle();

                var x = iCanvasWidth / 2;
                var y = this.getNoteNameFontSize();

                this.myCanvas.writeSheetTitle(x, y, sSheetTitle, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
            };

            View.prototype.drawClockName = function (aClock) {
                var sClockName = "";
                if (typeof (aClock.name) !== "undefined") {
                    sClockName = aClock.name;
                    if (sClockName == "0") {
                        sClockName = "";
                    }
                }

                var clockId = aClock['id'];

                var x = aClock.xpos + this.getClockCanvasSize() / 2;

                var y = aClock.hours[6].ypos + (3 * this.getNoteNameFontSize()) + this.getNoteNameMargin();

                if (sClockName != "") {
                    this.writeText(clockId, 100, sClockName, x, y);
                    y = y + this.getNoteNameFontSize();
                }

                this.drawPitchClassNames(aClock, x, y);
            };

            View.prototype.drawPitchClassNames = function (aClock, x, y) {
                var clockId = aClock['id'];
                var noteNameFontSize = this.getNoteNameFontSize();

                var aHarmony = aClock.harmonies[0];
                if (typeof (aHarmony) !== "undefined") {
                    if (this.myDisplayPrimeForm) {
                        var sPrimeForm = "PF: " + aHarmony.primeForm;
                        this.writeText(clockId, 101, sPrimeForm, x, y);
                        y = y + noteNameFontSize;
                    }

                    if (this.myDisplayForteCode) {
                        var sForteCode = "FC: " + aHarmony.forteCode;
                        this.writeText(clockId, 102, sForteCode, x, y);
                        y = y + noteNameFontSize;
                    }

                    if (this.myDisplayIntervalVector) {
                        var sIntervalVector = "IV: " + aHarmony.intervalVector;
                        this.writeText(clockId, 103, sIntervalVector, x, y);
                        y = y + noteNameFontSize;
                    }

                    if (this.myDisplayPrimeInversion) {
                        var sPrimeInversion = "PI: " + aHarmony.primeInversion;
                        this.writeText(clockId, 104, sPrimeInversion, x, y);
                        y = y + noteNameFontSize;
                    }
                }
            };

            View.prototype.writeText = function (clockId, textId, text, x, y) {
                var objectId = this.createObjectId(clockId, textId);
                this.myCanvas.writeToneClockName(objectId, x, y, text, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
            };

            View.prototype.setClockId = function (aClock) {
                aClock.id = this.myToneClockId;
                this.myToneClockId = this.myToneClockId + 1;
            };

            View.prototype.drawClockId = function (aClock) {
                var x = aClock.xpos;
                var y = aClock.ypos;
                var iCenter = this.getClockCanvasSize() / 2;
                var sFontName = this.getNoteNameFontName();

                x = x + iCenter;
                y = y + iCenter;

                this.myCanvas.writeToneClockId(x, y, aClock.id, sFontName, (1.5 * this.getNoteNameFontSize()), "center", "middle", "#8ec89a");
            };

            View.prototype.drawHarmonies = function (aClock) {
                if ((typeof aClock != "undefined") && (typeof aClock.harmonies != "undefined")) {
                    var length = aClock.harmonies.length;

                    if (length > 0) {
                        for (var i = 0; i <= (length - 1); i++) {
                            this.drawHarmony(aClock, aClock.harmonies[i], i + 24);
                        }
                    }

                    this.drawClockId(aClock);
                }
            };

            View.prototype.drawHarmony = function (aClock, aHarmony, harmonyId) {
                if ((typeof aHarmony != "undefined") && (typeof aHarmony.midiNotes != "undefined")) {
                    var arrayHarmony = new Array(aHarmony.midiNotes.length);

                    for (var j = 0; j < aHarmony.midiNotes.length; j++) {
                        var transposedNoteNumber = this.transposeMidiNoteNumber(aHarmony.midiNotes[j], this.getSheetTransposition());
                        arrayHarmony[j] = transposedNoteNumber;
                    }

                    var objectId;
                    objectId = this.createObjectId(aClock['id'], harmonyId);

                    this.myCanvas.drawHarmony(aClock, arrayHarmony, aHarmony.fill, aHarmony.color, objectId);
                }
            };

            View.prototype.transposeHarmony = function (aClock, aHarmony, hoursDifference) {
                if ((typeof aHarmony != "undefined") && (typeof aHarmony.midiNotes != "undefined")) {
                    var oldHour = 0;
                    var newHour = 0;
                    var midiNoteNumber = 0;

                    for (var j = 0; j < aHarmony.midiNotes.length; j++) {
                        midiNoteNumber = aHarmony.midiNotes[j];
                        oldHour = this.midiNoteNumberToHourIndex(aClock, midiNoteNumber) + 1;
                        newHour = oldHour + hoursDifference % 12;
                        if (newHour < 1) {
                            newHour += 12;
                        }

                        aHarmony.midiNotes[j] = this.hourToMidiNoteNumber(newHour);
                    }
                }
            };

            View.prototype.drawRoot = function (aClock) {
                if (aClock.displayRoot === true) {
                    var noteNumber = this.transposeMidiNoteNumber(aClock.rootNoteNumber, this.getSheetTransposition());

                    var hourIndex = this.midiNoteNumberToHourIndex(aClock, noteNumber);
                    var x = aClock.hours[hourIndex].xpos;
                    var y = aClock.hours[hourIndex].ypos;
                    var radius = ((this.getHourSize()) / 2) * 1.4;

                    var objectId;
                    objectId = this.createObjectId(aClock['id'], hourIndex + 1);

                    this.myCanvas.drawCircle(x, y, radius, "#ff0000", true, objectId);
                }
            };

            View.prototype.transposeMidiNoteNumber = function (iNoteNumber, iTransposition) {
                var transposedNote = iNoteNumber;

                if (iTransposition !== 0) {
                    transposedNote = iNoteNumber + iTransposition;

                    if (transposedNote < 0) {
                        transposedNote = transposedNote + 12;
                    } else if (transposedNote > 11) {
                        transposedNote = transposedNote - 12;
                    }
                }
                return transposedNote;
            };

            View.prototype.midiNoteNumberToHourIndex = function (aClock, midiNoteNumber) {
                var index = 0;
                for (var i = 0; i < 12; i++) {
                    if (aClock.hours[i].midiNoteNumber === midiNoteNumber) {
                        index = i;
                        break;
                    }
                }
                return index;
            };

            View.prototype.noteNameFont = function () {
                var size = this.getNoteNameFontSize();
                var font = this.getNoteNameFontName();

                return size + "px " + font;
            };

            View.prototype.hourToX = function (hour, radius) {
                var centerX = this.getClockCanvasSize() / 2;
                var x = 0;
                var radianMultiplier = Math.PI / 180;

                x = centerX + Math.cos((hour * 30 - 90) * radianMultiplier) * radius;
                return x;
            };

            View.prototype.hourToY = function (hour, radius) {
                var centerY = (this.getClockCanvasSize() / 2);
                var y = 0;
                var radianMultiplier = Math.PI / 180;

                y = centerY + Math.sin((hour * 30 - 90) * radianMultiplier) * radius;
                return y;
            };
            return View;
        })();
        ToneClock.View = View;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
