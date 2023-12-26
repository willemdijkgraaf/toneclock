/**
* Created by wimdijkgraaf on 11-03-14.
*/
var ToneClock;
(function (ToneClock) {
    var Harmony = (function () {
        function Harmony(id, color, fill, pitchClassSet, transposition) {
            this.pitchClassSet = [];
            // global variables
            this.id = 0;
            this.fill = false;
            this.pitchClassSet = [];
            this.color = "";
            this.transposition = 0;

            // private variables (private to the constructor, not reachable for prototype methods)
            this.id = id;
            this.fill = fill;

            this.setPitchClassSet(pitchClassSet);

            this.color = color;
            this.setTransposition(transposition);
        }
        Harmony.prototype.getId = function () {
            return this.id;
        };

        Harmony.prototype.getFill = function () {
            return this.fill;
        };

        Harmony.prototype.getColor = function () {
            return this.color;
        };

        Harmony.prototype.getPitchClassSet = function () {
            return this.pitchClassSet;
        };

        Harmony.prototype.setPitchClassSet = function (pitchClassSet) {
            this.pitchClassSet = [];
            this.pitchToPitchClass(pitchClassSet);

            for (var i = 0; i < pitchClassSet.length; i++) {
                this.pitchClassSet.push(pitchClassSet[i]);
            }
        };

        Harmony.prototype.pitchToPitchClass = function (pitchClassSet) {
            for (var i = 0; i < pitchClassSet.length; i++) {
                if (pitchClassSet[i] > 11) {
                    pitchClassSet[i] = pitchClassSet[i] % 12;
                }
            }
            return pitchClassSet;
        };

        Harmony.prototype.setTransposition = function (transposition) {
            this.transposition = transposition % 12;
        };

        Harmony.prototype.getTransposition = function () {
            return this.transposition;
        };

        Harmony.prototype.onDraw = function (fCallback) {
            this.fDraw = fCallback;
        };

        Harmony.prototype.draw = function (aHours) {
            var aHarmony = [];
            var transposition = this.getTransposition();

            for (var i = 0; i <= 11; i++) {
                for (var j = 0; j < this.pitchClassSet.length; j++) {
                    // transpose first
                    var transposedNoteNumber = this._transposePitchClass(this.pitchClassSet[j], transposition);

                    if (transposedNoteNumber === aHours[i].pitchClass) {
                        var coordinates = { "x": 0, "y": 0 };
                        coordinates.x = aHours[i].x;
                        coordinates.y = aHours[i].y;
                        aHarmony.push(coordinates);
                        break;
                    }
                }
            }
            var coord = { "x": 0, "y": 0 };
            coord.x = aHarmony[0].x;
            coord.y = aHarmony[0].y;
            aHarmony.push(coord);

            this.fDraw(aHarmony, this.color);
        };

        Harmony.prototype._transposePitchClass = function (pitchClass, iTransposition) {
            var transposedNote = pitchClass;

            // anything to transpose?
            if (iTransposition !== 0) {
                transposedNote = pitchClass + iTransposition;

                // stay within range of 0 .. 11
                if (transposedNote < 0) {
                    transposedNote = transposedNote + 12;
                } else if (transposedNote > 11) {
                    transposedNote = transposedNote - 12;
                }
            }
            return transposedNote;
        };
        return Harmony;
    })();
    ToneClock.Harmony = Harmony;
})(ToneClock || (ToneClock = {}));
//# sourceMappingURL=harmony.js.map
