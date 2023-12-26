/// <reference path="./Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports", './objectid'], function (require, exports, objectid) {
    var ToneClock;
    (function (ToneClock) {
        var Harmony = (function () {
            function Harmony(aCanvas, aSetFinder, aHour, aMidiNoteNumber) {
                this.myCanvas = aCanvas;
                this.myHour = aHour;
                this.mySetFinder = aSetFinder;
                this.myMidiNoteNumber = aMidiNoteNumber;
            }
            Harmony.prototype.createUniqueObjectId = function (objectId, aClocks) {
                var toneclockIndex = objectId.getId1();
                // find the highest harmony Id in use
                var harmonyId = 0;
                for (var x = 0; x < aClocks[toneclockIndex].harmonies.length; x++) {
                    if (aClocks[toneclockIndex].harmonies[x].id > harmonyId) {
                        harmonyId = aClocks[toneclockIndex].harmonies[x].id;
                    }
                }
                //  return a unique Id that is 1 higher than the highest
                var newObjectId = new objectid.ToneClock.ObjectId(objectId.getId1(), harmonyId + 1, 4 /* HARMONY */);
                return newObjectId;
            };
            Harmony.prototype.add = function (aClock, harmonyId, sColor, bFill, aMidiNotes) {
                var harmony = {
                    "id": harmonyId.getId2(),
                    "color": sColor,
                    "fill": bFill,
                    "midiNotes": aMidiNotes,
                    "primeForm": "",
                    "forteCode": "",
                    "intervalVector": "",
                    "primeInversion": ""
                };
                this.addPitchClassSetNames(harmony);
                var index = aClock.harmonies.push(harmony);
                return aClock.harmonies[index - 1];
            };
            Harmony.prototype.move = function (aClock, harmonyId, direction) {
                var harmonyIndex = this.getArrayIndexFromObjectId(aClock, harmonyId);
                switch (direction) {
                    case 3 /* BACKWARD */:
                        this.moveBackward(aClock, harmonyIndex);
                        break;
                    case 2 /* FORWARD */:
                        this.moveForward(aClock, harmonyIndex);
                        break;
                    case 4 /* TO_BACK */:
                        this.moveToBack(aClock, harmonyIndex);
                        break;
                    case 1 /* TO_FRONT */:
                        this.moveToFront(aClock, harmonyIndex);
                        break;
                }
            };
            Harmony.prototype.moveBackward = function (aClock, harmonyIndex) {
                var aHarmony;
                if (harmonyIndex > 0) {
                    aHarmony = aClock.harmonies.splice(harmonyIndex, 1)[0];
                    aClock.harmonies.splice(harmonyIndex - 1, 0, aHarmony);
                }
            };
            Harmony.prototype.moveForward = function (aClock, harmonyIndex) {
                var aHarmony;
                if (harmonyIndex < aClock.harmonies.length - 1) {
                    aHarmony = aClock.harmonies.splice(harmonyIndex, 1)[0];
                    aClock.harmonies.splice(harmonyIndex + 1, 0, aHarmony);
                }
            };
            Harmony.prototype.moveToBack = function (aClock, harmonyIndex) {
                var aHarmony;
                if (harmonyIndex > 0) {
                    aHarmony = aClock.harmonies.splice(harmonyIndex, 1)[0];
                    aClock.harmonies.unshift(aHarmony);
                }
            };
            Harmony.prototype.moveToFront = function (aClock, harmonyIndex) {
                var aHarmony;
                if (harmonyIndex < aClock.harmonies.length - 1) {
                    aHarmony = aClock.harmonies.splice(harmonyIndex, 1)[0];
                    aClock.harmonies.push(aHarmony);
                }
            };
            Harmony.prototype.getArrayIndexFromObjectId = function (aClock, harmonyId) {
                var aHarmony;
                for (var i = 0; i < aClock.harmonies.length; i++) {
                    if (aClock.harmonies[i].id == harmonyId.getId2()) {
                        aHarmony = aClock.harmonies[i];
                        break;
                    }
                }
                return i;
            };
            Harmony.prototype.remove = function (aClock, harmonyId) {
                for (var i = 0; i < aClock.harmonies.length; i++) {
                    if (aClock.harmonies[i].id === harmonyId.getId2()) {
                        aClock.harmonies.splice(i, 1);
                        break;
                    }
                }
                var objectId = new objectid.ToneClock.ObjectId(aClock.id, harmonyId.getId2(), 4 /* HARMONY */);
                this.myCanvas.remove(objectId);
            };
            Harmony.prototype.addPitchClassSetNames = function (aHarmony) {
                if (typeof aHarmony != "undefined") {
                    var aMidiNotes = aHarmony.midiNotes;
                    var names = this.mySetFinder.getNames(this.toPitchClassArray(aMidiNotes));
                    aHarmony.intervalVector = names.intervalVector;
                    aHarmony.primeForm = names.primeForm;
                    aHarmony.forteCode = names.forteCode;
                    aHarmony.primeInversion = names.primeInversion;
                }
            };
            Harmony.prototype.getPitchClassSetNames = function (aClock, harmonyId) {
                var aHarmony = this.getHarmonyFromObjectId(harmonyId, aClock);
                this.addPitchClassSetNames(aHarmony);
                var pcsNames = {
                    "forteCode": aHarmony.forteCode,
                    "intervalVector": aHarmony.intervalVector,
                    "primeForm": aHarmony.primeForm,
                    "primeInversion": aHarmony.primeInversion
                };
                return pcsNames;
            };
            Harmony.prototype.toPitchClassArray = function (aMidiNotes) {
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
            Harmony.prototype.addStructureForOneMidiNoteNumber = function (aClock, midiNoteNumber) {
                // create an empty harmony array
                var aMidiNotes = new Array(1);
                // turn on one note only
                aMidiNotes[0] = midiNoteNumber;
                // create a harmony object for this clock
                var harmonyId = 0;
                var objectId = new objectid.ToneClock.ObjectId(aClock.id, harmonyId, 4 /* HARMONY */);
                var aHarmony = this.add(aClock, objectId, "#000000", true, aMidiNotes);
                // add pitch class set names to the structure
                return aHarmony;
            };
            Harmony.prototype.toggleHour = function (aHarmony, hourAsMidiNoteNumber, isNotANewHarmonicStructure) {
                // convert this harmony into an array of pitch classes
                var aPitchClasses = this.myMidiNoteNumber.toPitchClasses(aHarmony.midiNotes);
                var pitchClassNumber = hourAsMidiNoteNumber % 12;
                // toggle this hour in the harmony include<>exclude
                var index = aPitchClasses.indexOf(pitchClassNumber);
                // if note clicked is in harmony, delete it from the harmony
                if (index != -1) {
                    if (isNotANewHarmonicStructure) {
                        // delete from harmony
                        index = aHarmony.midiNotes.indexOf(hourAsMidiNoteNumber);
                        aHarmony.midiNotes.splice(index, 1);
                    }
                }
                else {
                    // add the note to the harmony
                    if (isNotANewHarmonicStructure) {
                    }
                    aHarmony.midiNotes.push(pitchClassNumber);
                }
            };
            Harmony.prototype.transpose = function (aClock, harmonyId, transpositionInHours, aNNPrefs) {
                var aHarmony = this.getHarmonyFromObjectId(harmonyId, aClock);
                if ((typeof aHarmony != "undefined") && (typeof aHarmony.midiNotes != "undefined")) {
                    var hour = 0;
                    var transposedHour = 0;
                    var midiNoteNumber = 0;
                    for (var j = 0; j < aHarmony.midiNotes.length; j++) {
                        midiNoteNumber = aHarmony.midiNotes[j];
                        hour = this.myMidiNoteNumber.toHourIndex(aClock, midiNoteNumber) + 1;
                        transposedHour = (hour + transpositionInHours) % 12;
                        if (transposedHour < 1) {
                            transposedHour += 12;
                        }
                        aHarmony.midiNotes[j] = this.myHour.toMidiNoteNumber(transposedHour, aNNPrefs);
                    }
                }
            };
            Harmony.prototype.draw = function (aClock, aHarmony, transposition) {
                if ((typeof aHarmony != "undefined") && (typeof aHarmony.midiNotes != "undefined")) {
                    var arrayHarmony = new Array(aHarmony.midiNotes.length);
                    for (var j = 0; j < aHarmony.midiNotes.length; j++) {
                        var transposedNoteNumber = this.myMidiNoteNumber.transpose(aHarmony.midiNotes[j], transposition);
                        arrayHarmony[j] = transposedNoteNumber;
                    }
                    // create objectid for this harmony
                    var objectId;
                    objectId = new objectid.ToneClock.ObjectId(aClock.id, aHarmony.id, 4 /* HARMONY */);
                    // draw the harmony
                    this.myCanvas.drawHarmony(aClock, arrayHarmony, aHarmony.fill, aHarmony.color, objectId);
                }
            };
            Harmony.prototype.drawAll = function (aClock, transposition) {
                if ((typeof aClock != "undefined") && (typeof aClock.harmonies != "undefined")) {
                    // determine how many harmonies this clock has
                    var length = aClock.harmonies.length;
                    // draw each harmony
                    if (length > 0) {
                        for (var i = 0; i <= (length - 1); i++) {
                            aClock.harmonies[i].id = i;
                            this.draw(aClock, aClock.harmonies[i], transposition);
                        }
                    }
                }
            };
            Harmony.prototype.removeAllFromClock = function (aClock) {
                var harmonies = [];
                aClock.harmonies = harmonies;
                aClock.name = "";
                aClock.displayRoot = false;
            };
            Harmony.prototype.getColor = function (objectId, aClock) {
                var aHarmony = this.getHarmonyFromObjectId(objectId, aClock);
                return aHarmony.color;
            };
            Harmony.prototype.setColor = function (harmonyId, aClock, color) {
                var aHarmony = this.getHarmonyFromObjectId(harmonyId, aClock);
                aHarmony.color = color;
            };
            Harmony.prototype.getHarmonyFromObjectId = function (objectId, aClock) {
                // var aObjectId:Array<number> = objectId.toArray();
                var harmonyId = objectId.getId2();
                for (var x = 0; x < aClock.harmonies.length; x = x + 1) {
                    if (aClock.harmonies[x].id == harmonyId) {
                        break;
                    }
                }
                return aClock.harmonies[x];
            };
            return Harmony;
        })();
        ToneClock.Harmony = Harmony;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=harmony.js.map