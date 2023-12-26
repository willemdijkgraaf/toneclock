/**
 * @author Wim Dijkgraaf
 */

export module ToneClock {
    export class Widget {
        sNAME: string;
        sVERSION: string;

        myContext: any;
        myCanvas: any;
        mySheetTitle: string;
        mySheetTransposition: number;
        myClocksHorizontal: number;
        myClocksVertical: number;
        myClockSize: number;
        myClockCanvasSize: number;
        myCanvasWidth: number;
        myCanvasHeight: number;
        myHourSize: number;
        myClocks: any; // array of clocks with following properties: {'xpos' : 0, 'ypos' : 0}
        myNoteNameStyle: number; // in perfect 4ths
        myNoteNameFlat: boolean;
        myNoteNameAsPitchClass: boolean;
        myNoteNameDirection: boolean;
        myNoteNameMargin: number;
        myNoteNameFontSize: number;
        myNoteNameRotation: number;
        myNoteNameFontName: string;
        myToneClockId: number;
        arrNoteNames: any;
        arrMidiNoteNumbers: any;

        constructor () {
            this.sNAME = "Tone Clock";
            this.sVERSION = "1.1";
            this.myContext = {};
            this.myCanvas = {};
            this.mySheetTitle = "";
            this.mySheetTransposition = 0;
            this.myClocksHorizontal = 0;
            this.myClocksVertical = 0;
            this.myClockSize = 0;
            this.myClockCanvasSize = 0;
            this.myCanvasWidth = 0;
            this.myCanvasHeight = 0;
            this.myHourSize = 0;
            this.myClocks = []; // array of clocks with following properties: {'xpos' : 0, 'ypos' : 0}
            this.myNoteNameStyle = 0; // in perfect 4ths
            this.myNoteNameFlat = false;
            this.myNoteNameAsPitchClass = false;
            this.myNoteNameDirection = false;
            this.myNoteNameMargin = 0;
            this.myNoteNameFontSize = 0;
            this.myNoteNameRotation = 0;
            this.myNoteNameFontName = "";
            this.myToneClockId = 0;

            this.arrNoteNames = [
                [ "G", "C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "B", "E", "A", "D", "G", "C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "B", "E", "A", "D" ] ,
                [ "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D" ] ,
                [ "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D" ] ,
                [ "G", "C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "B", "E", "A", "D", "G", "C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "B", "E", "A", "D" ] ,
                [ "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B", "C", "Db", "D" ] ,
                [ "Db", "C", "B", "Bb", "A", "Ab", "G", "Gb", "F", "E", "Eb", "D", "Db", "C", "B", "Bb", "A", "Ab", "G", "Gb", "F", "E", "Eb", "D" ] ,

                [ "G", "C", "F", "A#", "D#", "G#", "C#", "F#", "B", "E", "A", "D", "G", "C", "F", "A#", "D#", "G#", "C#", "F#", "B", "E", "A", "D" ] ,
                [ "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D" ] ,
                [ "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D", "A", "E", "B", "F#", "C#", "G#", "D#", "A#", "F", "C", "G", "D" ] ,
                [ "G", "C", "F", "A#", "D#", "G#", "C#", "F#", "B", "E", "A", "D", "G", "C", "F", "A#", "D#", "G#", "C#", "F#", "B", "E", "A", "D" ] ,
                [ "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D" ] ,
                [ "C#", "C", "B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D", "C#", "C", "B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D" ] ,

                [ "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2", "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2" ] ,
                [ "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2", "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2" ] ,
                [ "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2", "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2" ] ,
                [ "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2", "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2" ] ,
                [ "3", "4", "5", "6", "7", "8", "9", "10", "11", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "0", "1", "2" ] ,
                [ "1", "0", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2" ] ,

                [ "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2", "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2" ] ,
                [ "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2", "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2" ] ,
                [ "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2", "9", "4", "11", "6", "1", "8", "3", "10", "5", "0", "7", "2" ] ,
                [ "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2", "7", "0", "5", "10", "3", "8", "1", "6", "11", "4", "9", "2" ] ,
                [ "3", "4", "5", "6", "7", "8", "9", "10", "11", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "0", "1", "2" ] ,
                [ "1", "0", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2" ]

            ];

            this.arrMidiNoteNumbers = [
                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2 ] ,
                [ 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ] ,

                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2 ] ,
                [ 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ] ,

                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2 ] ,
                [ 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ] ,

                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5, 0, 7, 2 ] ,
                [ 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7, 0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2 ] ,
                [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2 ] ,
                [ 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
            ];
        }

        getSheetTitle () {
            return this.mySheetTitle;
        }

        setSheetTitle (sTitle) {
            this.mySheetTitle = sTitle;
        }

        getSheetTransposition () {
            return this.mySheetTransposition;
        }

        setSheetTransposition (iTransposition) {
            this.mySheetTransposition = iTransposition % 7; // positive and negative -5 ... 5
        }

        getClocksHorizontal () {
            return this.myClocksHorizontal;
        }

        setClocksHorizontal (amount) {
            this.myClocksHorizontal = amount;
        }

        getClocksVertical () {
            return this.myClocksVertical;
        }

        setClocksVertical (amount) {
            this.myClocksVertical = amount;
        }

        getNoteNameStyle () {
            return this.myNoteNameStyle;
        }

        setNoteNameStyle (styleId) {
            // style id's can be 0 = 4ths, 1 = 5ths and 2 = seconds
            this.myNoteNameStyle = styleId;
        }

        getNoteNameAsPitchClass () {
            return this.myNoteNameAsPitchClass;
        }

        setNoteNameAsPitchClass (bPitchClass) {
            // true means note names as pitch classes
            this.myNoteNameAsPitchClass = bPitchClass;
        }

        getNoteNameFontSize () {
            return this.myNoteNameFontSize;
        }

        setNoteNameFontSize (pixels) {
            this.myNoteNameFontSize = pixels;
        }

        getNoteNameRotation () {
            return this.myNoteNameRotation;
        }

        setNoteNameRotation (rotation) {
            this.myNoteNameRotation = rotation;
        }

        getNoteNameFontName () {
            return this.myNoteNameFontName;
        }

        setNoteNameFontName (fontName) {
            this.myNoteNameFontName = fontName;
        }
        getNoteNameMargin () {
            return this.myNoteNameMargin;
        }

        setNoteNameDirection (bClockwise) {
            this.myNoteNameDirection = bClockwise;
        }

        getNoteNameDirection () {
            return this.myNoteNameDirection;
        }

        setNoteNameFlat (bFlat) {
            this.myNoteNameFlat = bFlat;
        }

        getNoteNameFlat () {
            return this.myNoteNameFlat;
        }

        setNoteNameMargin (pixels) {
            this.myNoteNameMargin = pixels;
        }

        getClockCanvasSize () {
            return this.myClockCanvasSize;
        }

        setClockCanvasSize (pixels) {
            this.myClockCanvasSize = pixels;
            // set the new x and y position of all the current clocks
            // this.initializeClocks ( this.getClocksHorizontal(), this.getClocksVertical() );
        }

        setCanvasSize (horizontalClocks, verticalClocks) {
            this.setClocksHorizontal(horizontalClocks);
            this.setClocksVertical(verticalClocks);

            // add new clock definitions if necesarry and reset x and y positions of all clocks
            // this.initializeClocks ( horizontalClocks, verticalClocks);
        }

        cleanupArrayOfClocks (horizontalClocks, verticalClocks) {
            var currentMembers = this.myClocks.length;
            var newMembers = horizontalClocks * verticalClocks;
            // console.log ("Current # of members: " + currentMembers);

            // do we have to cleanup the array?
            if (currentMembers > newMembers) {
                // some cleanup to do
                var itemsToClean = currentMembers - newMembers;
                for (var i = 0; i < itemsToClean; i++) {
                    this.myClocks.pop();
                }
            }
            return this.myClocks.length;
        }

        initializeClocks () {
            var i = 0;

            for (var y = 0; y < this.getClocksVertical(); y++) {
                for (var x = 0; x < this.getClocksHorizontal(); x++) {
                    if (typeof(this.myClocks[i]) === "undefined") {
                        this.myClocks[i] = {    "id": 0,
                            "name": 0,
                            "xpos": 0,
                            "ypos": 0,
                            "displayRoot": false,
                            "rootNoteNumber": 0,
                            "hours": [
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
                                {"xpos": 0, "ypos": 0, "midiNoteNumber": 0}
                            ],
                            "harmonies": []
                        };
                    }
                    this.myClocks[i].xpos = x * this.getClockCanvasSize();
                    this.myClocks[i].ypos = y * this.getClockCanvasSize();
                    i++;
                } // end for x
            } // end for y
        }

        drawCanvas () {


            this._clearCanvas(); // make "old" canvas blank

            // set the new canvas size
            this.setCanvasWidth(this.getClocksHorizontal() * this.getClockCanvasSize());
            this.setCanvasHeight(this.getClocksVertical() * this.getClockCanvasSize());
            this.myCanvas.setAttribute("width", this.getCanvasWidth());
            this.myCanvas.setAttribute("height", this.getCanvasHeight());

            // initialize clocks
            this.initializeClocks();

            // to display the clock ids, start counting from 0
            this.myToneClockId = 0;

            for (var i = 0; i < this.myClocks.length; i++) {
                this.drawClock(this.myClocks[i]);
            }
            this._drawSheetTitle();
        }

        _clearCanvas () {
            this.myContext.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
        }

        getCanvasWidth () {
            return this.myCanvasWidth;
        }

        setCanvasWidth (width) {
            this.myCanvasWidth = width;
        }

        getCanvasHeight () {
            return this.myCanvasHeight;
        }

        setCanvasHeight (height) {
            this.myCanvasHeight = height;
        }

        getClockSize () {
            return this.myClockSize;
        }

        setClockSize (pixels) {
            this.myClockSize = pixels;
        }

        setHourSize (pixels) {
            this.myHourSize = pixels;
        }

        getHourSize () {
            return (this.myHourSize);
        }

        createCanvasElement (parentElement) {

            this.myCanvas = document.createElement("canvas");

            var myToneClockArea = document.getElementById(parentElement);
            myToneClockArea.appendChild(this.myCanvas);

            this.myContext = this.myCanvas.getContext("2d");
        }

        drawClock (aClock) {
            this.drawHours(aClock);
            this.drawNoteNames(aClock);
            this._drawClockId(aClock);
            this._drawClockName(aClock);
        }

        drawHours (aClock) {

            for (var i = 12; i >= 1; i--) {
                this.drawHour(aClock, i);
            }
        }

        drawHour (aClock, hour) {
            var x = 0;
            var y = 0;
            var radius = 0;

            radius = this.getClockSize() / 2;
            x = aClock.xpos + this.hourToX(hour, radius);
            y = aClock.ypos + this.hourToY(hour, radius);
            // Store the calculated position to easily draw harmonies and melodies between hours
            aClock.hours[hour - 1].xpos = x;
            aClock.hours[hour - 1].ypos = y;

            radius = this.getHourSize() / 2;
            this.drawCircle(x, y, radius, "#000000", false);
        }

        drawCircle (x, y, radius, color, bFill) {
            this.myContext.beginPath();
            this.myContext.arc(x, y, radius, 0, 2 * Math.PI);
            this.myContext.lineWidth = 1;
            this.myContext.strokeStyle = color;
            if (bFill) {
                this.myContext.fillStyle = color;
                this.myContext.fill();
            }
            this.myContext.stroke();
        }

        _getNoteNameIndex () {
            var styleId = this.getNoteNameStyle();
            var iNoteNameIndex = styleId * 2;

            if (this.getNoteNameDirection() === false) {
                iNoteNameIndex = iNoteNameIndex + 1;
            }

            if (this.getNoteNameAsPitchClass()) {
                iNoteNameIndex = iNoteNameIndex + 12;
            }

            if (this.getNoteNameFlat() === false) {
                iNoteNameIndex = iNoteNameIndex + 6;
            }

            return iNoteNameIndex;
        }

        drawNoteNames (aClock) {

            var iNoteNameIndex = this._getNoteNameIndex();


            for (var hour = 12; hour >= 1; hour--) {
                this.drawNoteName(aClock, hour, iNoteNameIndex);
            }
        }

        drawNoteName (aClock, hour, iNoteNameIndex) {
            var x = 0;
            var y = 0;
            var radius = 0;
            var noteName = "";
            var midiNoteNumber = 0;

            radius = this.getClockSize() / 2 + this.getNoteNameMargin();
            x = aClock.xpos + this.hourToX(hour, radius);
            y = aClock.ypos + this.hourToY(hour, radius);

            noteName = this._hourToNoteName(hour, iNoteNameIndex);
            this.writeText(x, y, noteName, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "middle", "#000000");

            midiNoteNumber = this.hourToMidiNoteNumber(hour, iNoteNameIndex);
            aClock.hours[hour - 1].midiNoteNumber = midiNoteNumber;
        }

        _hourToNoteName (hour, iNoteNameIndex) {
            var noteName = "";
            var rotation = this.getNoteNameRotation();

            rotation = rotation * -1;
            if (rotation < 0) {
                rotation = rotation + 12;
            }

            var noteId = rotation + hour - 1;
            noteName = this.arrNoteNames[iNoteNameIndex][noteId];
            return noteName;
        }

        addHarmony (toneClockId, harmonyId, sColor, bFill, aMidiNotes) {
            var harmony = {"id": 0, "color": "#ff0000", "fill": false, "midiNotes": [] };
            harmony.id = harmonyId;
            harmony.color = sColor;
            harmony.fill = bFill;
            harmony.midiNotes = aMidiNotes;

            this.myClocks[toneClockId].harmonies.push(harmony);
        }

        setClockProperties (toneClockId, sToneClockName, bDisplayRoot, iRootNoteNumber) {
            var aClock = this.myClocks[toneClockId];
            if (typeof(aClock) !== "undefined") {
                aClock.id = toneClockId;
                aClock.name = sToneClockName;
                aClock.displayRoot = bDisplayRoot;
                aClock.rootNoteNumber = iRootNoteNumber;
            }
        }

        removeHarmoniesFromSheet () {
            var i = 0;

            for (var y = 0; y < this.getClocksVertical(); y++) {
                for (var x = 0; x < this.getClocksHorizontal(); x++) {
                    if (typeof(this.myClocks[i]) !== "undefined") {
                        this._removeHarmoniesFromClock(i);
                    }
                    i++;
                } // end for x
            } // end for y
        }

        _removeHarmoniesFromClock (toneClockId) {
            var harmonies = [];
            this.myClocks[toneClockId].harmonies = harmonies;
            this.myClocks[toneClockId].name = "";
            this.myClocks[toneClockId].displayRoot = false;
        }

        hourToMidiNoteNumber (hour, styleId) {
            var noteNumber = 0;
            var rotation = this.getNoteNameRotation();

            rotation = rotation * -1;
            if (rotation < 0) {
                rotation = rotation + 12;
            }
            var noteId = rotation + hour - 1;

            noteNumber = this.arrMidiNoteNumbers[styleId][noteId];
            return noteNumber;
        }

        _drawSheetTitle () {
            var iCanvasWidth = this.getClocksHorizontal() * this.getClockCanvasSize();
            var sSheetTitle = this.getSheetTitle();
            // var iSheetTitleWidth = sSheetTitle.length * this.getNoteNameFontSize();

            var x = iCanvasWidth / 2;
            var y = this.getNoteNameFontSize();

            this.writeText(x, y, sSheetTitle, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
        }

        _drawClockName (aClock) {
            if (typeof(aClock.name) !== "undefined") {
                var iCLockCanvasSize = this.getClockCanvasSize();
                var sClockName = aClock.name;
                if (sClockName == "0") {
                    sClockName = "";
                }
                var x = aClock.xpos + iCLockCanvasSize / 2;
                var y = aClock.ypos + iCLockCanvasSize;

                this.writeText(x, y, sClockName, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "bottom", "#000000");
            }
        }

        _drawClockId (aClock) {
            var sId = "" + this.myToneClockId;

            this.myToneClockId = this.myToneClockId + 1;

            var x = aClock.xpos;
            var y = aClock.ypos;
            var iCenter = this.getClockCanvasSize() / 2;
            var sFontName = this.getNoteNameFontName();


            x = x + iCenter;
            y = y + iCenter;

            this.writeText(x, y, sId, sFontName, (1.5 * this.getNoteNameFontSize()), "center", "middle", "#8ec89a");
        }

        drawHarmoniesOfClocks () {
            this.myToneClockId = 0;

            for (var i = 0; i < this.myClocks.length; i++) {
                this._drawHarmonies(i);
            }
        }

        _drawHarmonies (iClockIndex) {
            var aClock = this.myClocks[iClockIndex];
            // draw the root first, if aClock.displayRoot is true
            this._drawRoot(aClock);

            var length = aClock.harmonies.length;

            if (length > 0) {
                for (var i = 0; i <= (length - 1); i++) {
                    this._drawHarmony(aClock, aClock.harmonies[i]);
                }
            }

            this._drawClockId(aClock);
        }

        _drawHarmony (aClock, aHarmony) {
            var toX = 0;
            var toY = 0;
            var endX = 0;
            var endY = 0;
            var bFirstFound = false;

            this.myContext.beginPath();
            this.myContext.moveTo(endX, endY);

            for (var i = 0; i <= 11; i++) {
                for (var j = 0; j <= (aHarmony.midiNotes.length - 1); j++) {
                    // transpose first
                    var transposedNoteNumber = this._transposeMidiNoteNumber(aHarmony.midiNotes[j], this.getSheetTransposition());

                    if (transposedNoteNumber === aClock.hours[i].midiNoteNumber) {
                        toX = aClock.hours[i].xpos;
                        toY = aClock.hours[i].ypos;
                        if (bFirstFound) {
                            this.myContext.lineTo(toX, toY);
                            break;
                        }
                        else {
                            this.myContext.moveTo(toX, toY);
                            endX = toX;
                            endY = toY;
                            bFirstFound = true;
                            break;
                        }

                    }
                }

            }

            this.myContext.lineTo(endX, endY);
            if (aHarmony.fill) {
                this.myContext.fillStyle = aHarmony.color;
                this.myContext.fill();
            }
            this.myContext.lineWidth = 5;
            this.myContext.strokeStyle = aHarmony.color;
            // this.myContext.lineCap = 'round';
            this.myContext.stroke();

        }

        _drawRoot (aClock) {
            if (aClock.displayRoot) {
                // transpose the root according to sheetTransposition
                var noteNumber = this._transposeMidiNoteNumber(aClock.rootNoteNumber, this.getSheetTransposition());

                var hourIndex = this.midiNoteNumberToHourIndex(aClock, noteNumber);
                var x = aClock.hours[hourIndex].xpos;
                var y = aClock.hours[hourIndex].ypos;
                var radius = ((this.getHourSize()) / 2) * 1.4; // 40 percent larger than other clocks
                this.drawCircle(x, y, radius, "#ff0000", true);
            }
        }

        _transposeMidiNoteNumber (iNoteNumber, iTransposition) {
            var transposedNote = iNoteNumber;
            // anything to transpose?
            if (iTransposition !== 0) {
                transposedNote = iNoteNumber + iTransposition;
                // stay within range of 0 .. 11
                if (transposedNote < 0) {
                    transposedNote = transposedNote + 12;
                }
                else if (transposedNote > 11) {
                    transposedNote = transposedNote - 12;
                }
            }
            return transposedNote;
        }

        drawMelody (aClock, aHarmony) {
            var toX = 0;
            var toY = 0;
            var endX = 0;
            var endY = 0;

            var hourIndex = 0;
            var midiNoteNumber = 0;

            midiNoteNumber = aHarmony.midiNotes[0];
            hourIndex = this.midiNoteNumberToHourIndex(aClock, midiNoteNumber);
            endX = aClock.hours[hourIndex].xpos;
            endY = aClock.hours[hourIndex].ypos;

            this.myContext.beginPath();
            this.myContext.moveTo(endX, endY);

            for (var i = 1; i <= (aHarmony.midiNotes.length - 1); i++) {
                midiNoteNumber = aHarmony.midiNotes[i];
                hourIndex = this.midiNoteNumberToHourIndex(aClock, midiNoteNumber);
                toX = aClock.hours[hourIndex].xpos;
                toY = aClock.hours[hourIndex].ypos;
                this.myContext.lineTo(toX, toY);
            }
            this.myContext.lineTo(endX, endY);
            this.myContext.lineWidth = 5;
            this.myContext.strokeStyle = "#000000";
            this.myContext.lineCap = "round";
            this.myContext.stroke();

        }


        midiNoteNumberToHourIndex (aClock, midiNoteNumber) {
            var index = 0;
            for (var i = 0; i <= 12; i++) {

                if (aClock.hours[i].midiNoteNumber === midiNoteNumber) {
                    index = i;
                    break;
                }
            }

            return index;
        }

        noteNameFont () {
            var size = this.getNoteNameFontSize();
            var font = this.getNoteNameFontName();

            return size + "px " + font;
        }

        writeText (x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, color) {

            this.myContext.font = "" + iFontSize + "px " + sFontName;
            this.myContext.textAlign = sTextAlign;
            this.myContext.textBaseline = sTextBaseline;
            this.myContext.save();
            this.myContext.restore();
            this.myContext.fillStyle = color;
            this.myContext.beginPath();
            this.myContext.fillText(text, x, y);
            this.myContext.stroke();
        }

        hourToX (hour, radius) {
            var centerX = this.getClockCanvasSize() / 2;
            var x = 0;
            var radianMultiplier = Math.PI / 180;
            // var radianMultiplier = 180 / Math.PI;
            x = centerX + Math.cos((hour * 30 - 90) * radianMultiplier) * radius;
            return x;
        }

        hourToY (hour, radius) {
            var centerY = (this.getClockCanvasSize() / 2);
            var y = 0;
            var radianMultiplier = Math.PI / 180;
            // var radianMultiplier = 180 / Math.PI;
            y = centerY + Math.sin((hour * 30 - 90) * radianMultiplier) * radius;
            return y;
        } // close last function
    }
}

