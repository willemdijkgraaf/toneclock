/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports"], function (require, exports) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var TCMath = (function () {
            function TCMath() {
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
                    ["Re", "Sol", "Do", "Fa", "Si♭", "Mi♭", "La♭", "Re♭", "Sol♭", "Si", "Mi", "La"],
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
                this.arrHarmonicFunctions = ["1", "♭9", "2/9", "♭3/♯9", "3", "4/11", "♭5/♯11", "5", "♯5/♭13", "6/13", "♭7", "7"];
            }
            TCMath.prototype.hourToNoteName = function (hour, aNNPrefs) {
                var noteName = "";
                var noteNameIndex = this.getNoteNameIndexX(hour, aNNPrefs.rotation, aNNPrefs.direction);
                var noteNameAsIndex = this.getNoteNameIndexY(aNNPrefs.nameAs, aNNPrefs.interval, aNNPrefs.accidentals);
                noteName = this.arrNoteNames[noteNameAsIndex][noteNameIndex];
                return noteName;
            };
            TCMath.prototype.hourToHarmonicFunction = function (hour, rootAsMidiNoteNumber, aNNPrefs) {
                var harmonicFunction = "";
                var hourAsMidiNoteNumber = this.hourToMidiNoteNumber(hour, aNNPrefs);
                var index;
                index = ((hourAsMidiNoteNumber + 12) - rootAsMidiNoteNumber) % 12;
                return this.arrHarmonicFunctions[index];
            };
            // calculate vertical index
            TCMath.prototype.getNoteNameIndexY = function (noteNameAs, noteNameInterval, noteNameAccidentals) {
                var index = noteNameAs * 4;
                index += noteNameInterval; // 0=4ths, 1=2nds
                if (noteNameAccidentals === false) {
                    index += 2;
                }
                return index;
            };
            // calculate horizontal index
            TCMath.prototype.getNoteNameIndexX = function (hour, noteNameRotation, noteNameDirection) {
                var middleOfArray = 12;
                var noteId = 0;
                var hourIndex = hour - 1; // calculate array index 0 based
                // rotation can range from -12 to +12
                var rotation = noteNameRotation;
                rotation = rotation * -1;
                if (rotation > 0) {
                    rotation = rotation - 12;
                }
                // determine the noteId for clockwise / anti-clockwise display
                if (noteNameDirection === true) {
                    // direction is  clock wise
                    noteId = middleOfArray + hourIndex;
                }
                else {
                    noteId = middleOfArray - hourIndex;
                }
                noteId = noteId + rotation;
                if (noteId < 0) {
                    noteId += 24;
                }
                noteId = noteId % 12;
                return noteId;
            };
            TCMath.prototype.transposeMidiNoteNumber = function (iNoteNumber, iTransposition) {
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
                return transposedNote % 12; // mod 12
            };
            TCMath.prototype.midiNoteNumberToHourIndex = function (aClock, midiNoteNumber) {
                var index = 0;
                for (var i = 0; i < 12; i++) {
                    if (aClock.hours[i].midiNoteNumber === midiNoteNumber) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
            TCMath.prototype.hourToMidiNoteNumber = function (hour, aNNPrefs) {
                var noteNumber = 0;
                var hourIndex = this.getNoteNameIndexX(hour, aNNPrefs.rotation, aNNPrefs.direction);
                noteNumber = this.arrMidiNoteNumbers[aNNPrefs.interval * 2][hourIndex];
                return noteNumber;
            };
            TCMath.prototype.midiNoteNumbersToPitchClasses = function (aMidiNotes) {
                var pitchClassArray = new Array(aMidiNotes.length);
                for (var i = 0; i < aMidiNotes.length; i++) {
                    pitchClassArray[i] = aMidiNotes[i] % 12;
                }
                return pitchClassArray;
            };
            TCMath.prototype.rgbToHex = function (color) {
                var hex;
                if (color.indexOf("#") > -1) {
                    //for IE
                    hex = color;
                }
                else {
                    var rgb = color.match(/\d+/g);
                    hex = "#" + ("0" + parseInt(rgb[0], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2);
                }
                return hex;
            };
            return TCMath;
        })();
        ToneClock.TCMath = TCMath;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=math.js.map