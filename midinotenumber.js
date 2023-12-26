/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports"], function (require, exports) {
    var ToneClock;
    (function (ToneClock) {
        var MidiNoteNumber = (function () {
            function MidiNoteNumber() {
            }
            MidiNoteNumber.prototype.transpose = function (iNoteNumber, iTransposition) {
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
            MidiNoteNumber.prototype.toHourIndex = function (aClock, midiNoteNumber) {
                var index = 0;
                for (var i = 0; i < 12; i++) {
                    if (aClock.hours[i].midiNoteNumber === midiNoteNumber) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
            MidiNoteNumber.prototype.toPitchClasses = function (aMidiNotes) {
                var pitchClassArray = new Array(aMidiNotes.length);
                for (var i = 0; i < aMidiNotes.length; i++) {
                    pitchClassArray[i] = aMidiNotes[i] % 12;
                }
                return pitchClassArray;
            };
            return MidiNoteNumber;
        })();
        ToneClock.MidiNoteNumber = MidiNoteNumber;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=midinotenumber.js.map