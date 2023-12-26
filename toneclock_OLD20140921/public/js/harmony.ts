/**
 * Created by wimdijkgraaf on 11-03-14.
 */

module ToneClock {
    export class Harmony {
        id:number;
        fill: boolean;
        pitchClassSet = [];
        color: string;
        transposition: number;
        fDraw: Function;

        constructor (id: number, color: string, fill: boolean, pitchClassSet, transposition: number) {
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

        getId () {
            return this.id;
        }

        getFill () {
            return this.fill;
        }

        getColor () {
            return this.color; // store as a pitch class
        }

        getPitchClassSet () {
            return this.pitchClassSet;
        }

        setPitchClassSet (pitchClassSet) {

            this.pitchClassSet = [];
            this.pitchToPitchClass(pitchClassSet);

            for (var i = 0; i < pitchClassSet.length; i++) {
                this.pitchClassSet.push(pitchClassSet[i]);
            }
        }

        private pitchToPitchClass (pitchClassSet) {
            for (var i = 0; i < pitchClassSet.length; i++) {
                if (pitchClassSet[i] > 11) {
                    pitchClassSet[i] = pitchClassSet[i] % 12;
                }
            }
            return pitchClassSet;
        }

        setTransposition (transposition) {
            this.transposition = transposition % 12;
        }

        getTransposition () {
            return this.transposition;
        }

        onDraw (fCallback) {
            this.fDraw = fCallback;
        }

        draw (aHours) {

            var aHarmony = [];
            var transposition = this.getTransposition();

            for (var i = 0; i <= 11; i++) {
                for (var j = 0; j < this.pitchClassSet.length; j++) {
                    // transpose first

                    var transposedNoteNumber = this._transposePitchClass(this.pitchClassSet[j], transposition);

                    if (transposedNoteNumber === aHours[i].pitchClass) {
                        var coordinates = {"x": 0, "y": 0};
                        coordinates.x = aHours[i].x;
                        coordinates.y = aHours[i].y;
                        aHarmony.push(coordinates);
                        break;
                    }
                }
            }
            var coord = {"x": 0, "y": 0};
            coord.x = aHarmony[0].x;
            coord.y = aHarmony[0].y;
            aHarmony.push(coord);

            this.fDraw(aHarmony, this.color);
        }

        _transposePitchClass (pitchClass, iTransposition) {
            var transposedNote = pitchClass;
            // anything to transpose?
            if (iTransposition !== 0) {
                transposedNote = pitchClass + iTransposition;
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

    }
}

