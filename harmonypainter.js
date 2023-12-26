/// <reference path="./Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports", "./objectid"], function (require, exports, objectid) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var HarmonyPainter = (function () {
            function HarmonyPainter(aCanvas, aMidiNoteNumber) {
                this.myCanvas = aCanvas;
                this.myMidiNoteNumber = aMidiNoteNumber;
            }
            HarmonyPainter.prototype.draw = function (aClock, aHarmony, transposition) {
                if ((typeof aHarmony != "undefined") && (typeof aHarmony.midiNotes != "undefined")) {
                    var arrayHarmony = new Array(aHarmony.midiNotes.length);
                    for (var j = 0; j < aHarmony.midiNotes.length; j++) {
                        var transposedNoteNumber = this.myMidiNoteNumber.transpose(aHarmony.midiNotes[j], transposition);
                        arrayHarmony[j] = transposedNoteNumber;
                    }
                    // create objectid for this harmony
                    var objectId;
                    objectId = new objectid.ToneClock.ObjectId(aClock["id"], aHarmony.id, 4 /* HARMONY */);
                    // draw the harmony
                    this.myCanvas.drawHarmony(aClock, arrayHarmony, aHarmony.fill, aHarmony.color, objectId);
                }
            };
            HarmonyPainter.prototype.drawAll = function (aClock, transposition) {
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
            return HarmonyPainter;
        })();
        ToneClock.HarmonyPainter = HarmonyPainter;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=harmonypainter.js.map