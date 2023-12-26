define(["require", "exports", 'setfinder', 'toneclockmath', 'clock'], function(require, exports, setfinder, toneclockmath, clock) {
    (function (ToneClock) {
        var Harmony = (function () {
            function Harmony(canvas) {
                this.myCanvas = canvas;

                // this.myClocks = clocks;
                this.myMath = new toneclockmath.ToneClock.Math();
            }
            Harmony.prototype.add = function (aClock, harmonyId, sColor, bFill, aMidiNotes) {
                var harmony = { "id": 0, "color": "#ff0000", "fill": false, "midiNotes": [], "primeForm": "", "forteCode": "", "intervalVector": "", "primeInversion": "" };
                harmony.id = harmonyId;
                harmony.color = sColor;
                harmony.fill = bFill;
                harmony.midiNotes = aMidiNotes;

                this.addPitchSetNamesToHarmony(harmony);
                var index = aClock.harmonies.push(harmony);

                return aClock.harmonies[index - 1];
            };

            Harmony.prototype.move = function (aClock, harmonyId, direction) {
                var harmonyIndex = this.getHarmonyArrayIndex(aClock, harmonyId);

                switch (direction) {
                    case 2 /* BACKWARD */:
                        this.moveBackward(aClock, harmonyIndex);
                        break;
                    case 1 /* FORWARD */:
                        this.moveForward(aClock, harmonyIndex);
                        break;
                    case 3 /* TO_BACK */:
                        this.moveToBack(aClock, harmonyIndex);
                        break;
                    case 0 /* TO_FRONT */:
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

            Harmony.prototype.getHarmonyArrayIndex = function (aClock, harmonyId) {
                var aHarmony;

                for (var i = 0; i < aClock.harmonies.length; i++) {
                    if (aClock.harmonies[i].id == harmonyId) {
                        aHarmony = aClock.harmonies[i];
                        break;
                    }
                }

                return i;
            };

            Harmony.prototype.remove = function (aClock, harmonyId) {
                for (var i = 0; i < aClock.harmonies.length; i++) {
                    if (aClock.harmonies[i].id == harmonyId) {
                        aClock.harmonies.splice(i, 1);
                        break;
                    }
                }
                var objectId = this.myMath.createObjectId(aClock.id, harmonyId);
                this.myCanvas.removeHarmony(objectId);
            };

            Harmony.prototype.addPitchSetNamesToHarmony = function (aHarmony) {
                if (typeof aHarmony != "undefined") {
                    var oSetFinder = new setfinder.ToneClock.SetFinder();
                    var aMidiNotes = aHarmony.midiNotes;

                    oSetFinder.Initialize();
                    oSetFinder.FindSet(this.convertMidiNotesToPitchClassArray(aMidiNotes));

                    aHarmony.intervalVector = oSetFinder.getIntervalVector();
                    aHarmony.primeForm = oSetFinder.getPrimeForm();
                    aHarmony.forteCode = oSetFinder.getForteCode();
                    aHarmony.primeInversion = oSetFinder.getInversion();
                }
            };

            Harmony.prototype.convertMidiNotesToPitchClassArray = function (aMidiNotes) {
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

            Harmony.prototype.createHarmonicStructure = function (aClock, hourAsMidiNoteNumber) {
                // create an empty harmony array
                var aMidiNotes = new Array(1);

                // turn on one note only
                aMidiNotes[0] = hourAsMidiNoteNumber;

                // create a harmony object for this clock
                var aHarmony = this.add(aClock, 0, "#000000", true, aMidiNotes);

                // add pitch class set names to the structure
                return aHarmony;
            };

            Harmony.prototype.toggleHourOfHarmony = function (aHarmony, hourAsMidiNoteNumber, isNotANewHarmonicStructure) {
                // convert this harmony into an array of pitch classes
                var aPitchClasses = this.myMath.midiNoteNumbersToPitchClasses(aHarmony.midiNotes);

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
                } else {
                    // add the note to the harmony
                    if (isNotANewHarmonicStructure) {
                    }
                    aHarmony.midiNotes.push(pitchClassNumber);
                }
            };

            Harmony.prototype.transpose = function (aClock, aHarmony, intervalInHours, aNNPrefs) {
                if ((typeof aHarmony != "undefined") && (typeof aHarmony.midiNotes != "undefined")) {
                    var oldHour = 0;
                    var newHour = 0;
                    var midiNoteNumber = 0;

                    for (var j = 0; j < aHarmony.midiNotes.length; j++) {
                        midiNoteNumber = aHarmony.midiNotes[j];
                        oldHour = this.myMath.midiNoteNumberToHourIndex(aClock, midiNoteNumber) + 1;
                        newHour = (oldHour + intervalInHours) % 12;
                        if (newHour < 1) {
                            newHour += 12;
                        }

                        aHarmony.midiNotes[j] = this.myMath.hourToMidiNoteNumber(newHour, aNNPrefs);
                    }
                }
            };

            Harmony.prototype.draw = function (aClock, aHarmony, transposition) {
                if ((typeof aHarmony != "undefined") && (typeof aHarmony.midiNotes != "undefined")) {
                    var arrayHarmony = new Array(aHarmony.midiNotes.length);

                    for (var j = 0; j < aHarmony.midiNotes.length; j++) {
                        var transposedNoteNumber = this.myMath.transposeMidiNoteNumber(aHarmony.midiNotes[j], transposition);
                        arrayHarmony[j] = transposedNoteNumber;
                    }

                    // create objectid for this harmony
                    var objectId;
                    if (aHarmony.id < 24) {
                        aHarmony.id += 24;
                    }
                    objectId = this.myMath.createObjectId(aClock['id'], aHarmony.id);

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
                            aClock.harmonies[i].id = i + 24; // Add 24 to make sure it's id is different from an hour
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
                var aHarmony = this.objectIdToHarmony(objectId, aClock);

                return aHarmony.color;
            };

            Harmony.prototype.setColor = function (harmonyId, aClock, color) {
                // var aHarmony:IJsonHarmony = this.objectIdToHarmony(objectId, aClock);
                var aHarmony = aClock.harmonies[harmonyId];
                aHarmony.color = color;
            };

            Harmony.prototype.objectIdToHarmony = function (objectId, aClock) {
                var aObjectId = this.myMath.ObjectIdToArray(objectId);

                //var clockIndex: number = aObjectId[0];
                var harmonyId = aObjectId[1];

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
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
//# sourceMappingURL=harmony.js.map
